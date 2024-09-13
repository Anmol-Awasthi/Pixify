import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import {
  EnvelopeIcon,
  PencilIcon,
  PhoneIcon,
  PowerIcon,
} from "react-native-heroicons/outline";
import { supabase } from "../lib/Supabase";
import Avatar from "../../components/Avatar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { fetchPosts } from "../../Services/PostService";
import PostCard from "../../components/PostCard";

export default function Profile() {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(7);

  const getPosts = async () => {
    if (!hasMore) return;
    // setLoading(true);
    let res = await fetchPosts(limit, user.id);
    if (res.success) {
      if (res.data.length < limit) {
        setHasMore(false);
      }
      setPosts(res.data);
      setLimit((prevLimit) => prevLimit + 7);
    }
    // setLoading(false);
  };

  return (
    <View className="flex-1 pt-12 px-4 bg-[#17153B] text-white">
      <View>
        <Header title="Profile" router={router} />
        <View className="bg-[#faaeae] h-10 w-10 flex items-center justify-center rounded-full absolute right-0">
          <TouchableOpacity
            onPress={() => onLogout()}
            className="flex items-center justify-center"
          >
            <PowerIcon size={28} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={posts}
        ListHeaderComponent={<UserHeader user={user} router={router} />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20, marginTop: 20 }}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} showMoreIcons={false} />
        )}
        onEndReached={getPosts}
        onEndReachedThreshold={0}
        ListFooterComponent={posts.length === 0 ? (
          <View className="self-center mt-4">
            <Text className="text-white text-lg">Make your first post now !</Text>
          </View>
        ) : (
          <View className="self-center mt-4">
            <Text className="text-white text-lg">That's what you have posted so far !</Text>
          </View>
        )}
        
      />
    </View>
  );
  
}

const onLogout = async () => {
  Alert.alert("Log Out", "Are you sure you want to sign out?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Log Out",
      style: "destructive",
      onPress: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.log("Error: ", error.message);
          Alert.alert("Log Out", "Error logging out.");
        }
      },
    },
  ]);
};

const UserHeader = ({ user, router }) => {
  return (
    <View className="mt-1">
      <View className="">
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(10)}
          className="AvatarContainer flex items-start ml-6 justify-center"
        >
          <View className="relative">
            <Avatar
              uri={user?.image}
              size={100}
              rounded={20}
              style={{ borderCurve: "continuous", borderWidth: 2 }}
            />
            <Pressable
              onPress={() => router.push("/EditProfile")}
              className="absolute -bottom-2 -right-4 bg-white rounded-xl shadow-2xl shadow-black p-2"
            >
              <PencilIcon size={20} color="black" />
            </Pressable>
          </View>
        </Animated.View>

        <View className="flex-row items-end ml-6 space-x-2 mt-6">
          <Animated.View
            entering={FadeInDown.delay(150).springify().damping(10)}
            // className=" flex items-center justify-center mt-4"
          >
            <Text className="text-white text-2xl font-medium">
              {user?.name}
            </Text>
          </Animated.View>

          {user && user.address && (
            <Animated.View
              entering={FadeInDown.delay(200).springify().damping(10)}
              // className="flex-row items-center justify-center gap-2"
              className="pb-[1px]"
            >
              <Text className="text-white/75 text-base font-medium">
                {user.address}
              </Text>
            </Animated.View>
          )}
        </View>

        <View className="flex items-start ml-4 justify-start gap-y-2 mt-1">
          <Animated.View
            entering={FadeInDown.delay(250).springify().damping(10)}
            className="flex-row items-center justify-start space-x-2 py-1 px-2 border-gray-700 rounded-3xl "
          >
            <EnvelopeIcon size={16} color="gray" />
            <Text className="text-white/80 text-base font-medium">
              {user?.email}
            </Text>
          </Animated.View>

          {user && user.phoneNumber && (
            <Animated.View
              entering={FadeInDown.delay(300).springify().damping(10)}
              className="flex-row items-center justify-start space-x-2 py-1 px-2 border-gray-700 rounded-3xl "
            >
              <PhoneIcon size={16} color="gray" />
              <Text className="text-white/80 text-bse font-medium">
                {user?.phoneNumber}
              </Text>
            </Animated.View>
          )}

          {user && user.bio && (
            <Animated.View
              entering={FadeInDown.delay(350).springify().damping(10)}
              className="flex-row items-center justify-start space-x-2 py-1 px-2 border-gray-700 rounded-3xl "
            >
              <Text className="text-white/80 text-base font-medium">
                {user?.bio}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};
