import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useAuth } from "../../contexts/AuthContext";
import { getUserImageSrc, uploadImage } from "../../Services/imageService";
import {
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { updateUserData } from "../../Services/userService";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInDown } from "react-native-reanimated";

const EditProfile = () => {
  const router = useRouter();
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    image: null,
    address: "",
    phoneNumber: "",
    bio: "",
  });

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image.uri
      : getUserImageSrc(user?.image);

  const onImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setUser({ ...user, image: result.assets[0] });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        image: currentUser.image || null,
        address: currentUser.address || "",
        phoneNumber: currentUser.phoneNumber || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const onSubmit = async () => {
    let userData = { ...user };
    // console.log(userData);

    let { name, address, image, phoneNumber, bio } = userData;

    if (!name || !address || !phoneNumber || !bio) {
      Alert.alert("Profile", "Please fill all the fields.");
      setLoading(false);
      return;
    }
    setLoading(true);

    if (!image) {
      Alert.alert("Profile", "Please select a profile picture.");
      setLoading(false);
      return;
    }

    if (typeof image === "object") {
      try {
        let imageRes = await uploadImage("profiles", image?.uri, true);
        if (imageRes.success) {
          userData.image = imageRes.data;
        } else {
          userData.image = null;
          Alert.alert(
            "Profile",
            imageRes.msg || "Failed to upload image. Please try again."
          );
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert(
          "Profile Error",
          "Failed to upload image. Please try again."
        );
        setLoading(false);
        return;
      }
    }

    try {
      const response = await updateUserData(currentUser.id, userData);
      if (response.success) {
        setUserData({ ...currentUser, ...userData });
        setLoading(false);
        router.back();
      } else {
        Alert.alert(
          "Error",
          response.msg || "Failed to update profile. Please try again."
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 pt-12 px-4 bg-[#17153B]">
      <Header title="Edit Profile" router={router} />

      <Animated.View
        entering={FadeInDown.delay(100).springify().damping(10)}
        className="flex items-center justify-center mt-14"
      >
        <View>
          <View className="h-32 w-32 border-2 border-white rounded-2xl overflow-hidden relative">
            <Image
              source={imageSource}
              className="h-full w-full object-cover"
            />
          </View>
          <Pressable
            onPress={onImagePick}
            className="absolute -bottom-2 -right-4 bg-white rounded-xl shadow-2xl shadow-black p-2"
          >
            <CameraIcon size={24} color="black" />
          </Pressable>
        </View>
      </Animated.View>

      {/* form */}

      <View className="mt-16 flex items-center justify-center space-y-5">
        <Animated.View
          entering={FadeInDown.delay(150).springify().damping(10)}
          className="flex-row w-[90%] border-2 pl-2 border-gray-500 rounded-2xl py-3 items-center space-x-2"
        >
          <UserIcon size={28} color="gray" />
          <TextInput
            value={user.name}
            placeholder="Enter your name"
            onChangeText={(value) => setUser({ ...user, name: value })}
            className="text-white flex-1 font-medium text-xl"
            placeholderTextColor={"gray"}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).springify().damping(10)}
          className="flex-row w-[90%] border-2 pl-2 border-gray-500 rounded-2xl py-3 items-center space-x-2"
        >
          <PhoneIcon size={28} color="gray" />
          <TextInput
            value={user.phoneNumber}
            placeholder="Enter your phone number"
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            className="text-white flex-1 font-medium text-xl"
            placeholderTextColor={"gray"}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(250).springify().damping(10)}
          className="flex-row w-[90%] border-2 pl-2 border-gray-500 rounded-2xl py-3 items-center space-x-2"
        >
          <MapPinIcon size={28} color="gray" />
          <TextInput
            value={user.address}
            placeholder="Enter your city"
            onChangeText={(value) => setUser({ ...user, address: value })}
            className="text-white flex-1 font-medium text-xl"
            placeholderTextColor={"gray"}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(300).springify().damping(10)}
          className="flex-row w-[90%] border-2 pl-3 border-gray-500 rounded-2xl py-3 items-center space-x-2"
        >
          <TextInput
            value={user.bio}
            placeholder="Enter your bio"
            multiline={true}
            maxLength={150}
            numberOfLines={4}
            onChangeText={(value) => setUser({ ...user, bio: value })}
            className="text-white flex-1 font-medium text-xl"
            placeholderTextColor={"gray"}
            style={{
              textAlignVertical: "top",
            }}
          />
        </Animated.View>
      </View>

      {loading ? (
        <Text className="mx-auto absolute left-[50%] bottom-10 text-white text-xl">
          <ActivityIndicator size="large" color="white" />
        </Text>
      ) : (
        <Animated.View
          entering={FadeInDown.delay(350).springify().damping(10)}
          className="fixed -bottom-20 left-0 right-0"
        >
          <Pressable
            onPress={onSubmit}
            className="border-2 border-white w-[90%] mx-auto py-3 rounded-2xl"
          >
            <Text className="text-center font-medium text-white text-2xl">
              Update details
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
