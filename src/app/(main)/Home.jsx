import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../lib/Supabase";
import { HeartIcon, PlusCircleIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../Services/PostService";
import PostCard from "../../components/PostCard";
import { getUserData } from "../../Services/userService";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(4);

  const handlePostEvent = async (payload) => {
    console.log("Payload: ", payload);
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    // getPosts();
    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    if(!hasMore) return;
    setLimit((prevLimit) => prevLimit + 4);
    console.log("Fetching posts...", limit);
    let res = await fetchPosts(limit);
    // console.log("User from 1st post: ", res.data[0].user);

    if (res.success) {
      // console.log("Posts length: ", posts.length);
      // console.log("Result data length: ", res.data.length);
      if(posts.length==res.data.length) {
        setHasMore(false);
      }
      setPosts(res.data);
    }
  };

  // const onLogout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.log("Error: ", error.message);
  //     Alert.alert("Sign Out", "Error signing out.");
  //   }
  // };

  const router = useRouter();

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 pt-12 px-4 bg-[#17153B] text-white">
        {/* Header */}
        <View className="flex-row mb-2 justify-between items-center">
          <View>
            <Text className="text-4xl text-white tracking-widest font-bold">
              Pixify
            </Text>
          </View>
          {/* icons */}
          <View className="flex-row space-x-3">
            <Pressable onPress={() => router.push("/Notifications")}>
              <HeartIcon size={40} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/Post")}>
              <PlusCircleIcon size={40} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/Profile")}>
              <Avatar
                uri={user?.image}
                size={40}
                rounded={12}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Feed */}

        <FlatList
          data={posts}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={() => {
            getPosts();
            // console.log("Reached end");
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            <View className={`${posts.length == 0 ? "mt-40" : "mt-10"}`}>
              {
                hasMore ? (
                  <ActivityIndicator size="large" color="white" />
                ) :
                <View className="flex items-center justify-center"><Text className='text-white text-xl'>No more posts 😟</Text></View>
              }
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
