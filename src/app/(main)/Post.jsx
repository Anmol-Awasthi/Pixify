import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import Header from "../../components/Header";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import TextEditor from "../../components/TextEditor";
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "../../Services/imageService";
import {Video} from 'expo-av';
import { CreateOrUpdatePost } from "../../Services/PostService";





export default function Post() {
  const { user } = useAuth();
  const router = useRouter();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const [file, setFile] = useState(file);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // if(!bodyRef.current || !file) {
    //   Alert.alert("Post upload", "Please choose a media or add a caption");
    //   return;
    // }

    let data = {
      body: bodyRef.current,
      file,
      userId: user.id,
    };

    setLoading(true);
    let res = await CreateOrUpdatePost(data);
    setLoading(false);
    if(res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML('');
      router.back();
    }
    else {
      Alert.alert("Post upload", res.msg);
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == "object") return true;

    return false;
  };

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) return file.type;

    if (file.includes("postImage")) {
      return "image";
    }
    return "video";
  };

  const getFileUrl = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) return file.uri;

    return getSupabaseFileUrl(file)?.uri;
  };

  const pickMedia = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }
    

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  return (
    <View className="pt-12 px-4 bg-[#17153B] flex-1">
      <Header title="Create Post" router={router} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <Pressable
          onPress={() => router.replace("/Profile")}
          className="mt-4 mb-8"
        >
          <View className="flex-row items-center space-x-2">
            <Avatar rounded={10} uri={user?.image} size={44} />
            <View className="flex items-start justify-center">
              <Text className="text-white text-lg font-semibold">
                {user?.name}
              </Text>
              <Text className="text-gray-400">Public</Text>
            </View>
          </View>
        </Pressable>

        {/* Text Editor */}
        <View>
          <TextEditor
            editorRef={editorRef}
            onChange={(body) => (bodyRef.current = body)}
          />
        </View>

        {/* Media Picker */}
        <View className="flex-row justify-around border-2 border-white py-2 rounded-3xl mt-4">
          <View className="flex-1">
            <Pressable onPress={() => pickMedia(true)}>
              <View className="flex items-center justify-center space-y-1">
                <PhotoIcon size={28} color="white" />
                <Text className="text-white">Pick Image</Text>
              </View>
            </Pressable>
          </View>
          <View className="h-full w-[2px] bg-white"></View>
          <View className="flex-1">
            <Pressable onPress={() => pickMedia(false)}>
              <View className="flex items-center justify-center space-y-1">
                <VideoCameraIcon size={28} color="white" />
                <Text className="text-white">Pick Video</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Actual Media */}

        {file && (
          <View className="h-60 w-full overflow-hidden rounded-3xl mt-6">
            {getFileType(file) == "video" ? (
              <Video
              className="flex-1 w-full h0full"
              source={{ uri: getFileUrl(file) }}
              useNativeControls
              resizeMode="cover"
              isLooping
              />
            ) : (
              <Image
                source={{ uri: getFileUrl(file) }}
                className="flex-1"
                resizeMode="cover"
              />
            )}
              <Pressable
                className="absolute bg-red-500 top-2 right-2 z-10 p-1 rounded-full"
                onPress={() => setFile(null)}
              >
                <XMarkIcon size={20} color="white" />
              </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Post Button */}

      {
        loading ? (
          <Text className="mx-auto absolute left-[50%] bottom-11 text-white text-xl">
              <ActivityIndicator size="large" color="white" />
            </Text>
        ) :
        (
          <View className="mb-10">
        <Pressable
          className="border-2 fixed bottom-0 left-0 right-0 border-white w-full mx-auto py-2 rounded-3xl"
          onPress={onSubmit}
        >
          <Text className="text-center font-medium text-white text-3xl -tracking-wider">
            Post
          </Text>
        </Pressable>
      </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({});
