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
import {
  BellAlertIcon,
  BellIcon,
  HeartIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
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
  const [limit, setLimit] = useState(7);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePostEvent = async (payload) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
    if (payload.eventType === "DELETE" && payload.old.id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id != payload.old.id)
      );
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // setLoading(true);
    await getPosts();
    setRefreshing(false);
    // setLoading(false);
  }, []);

  useEffect(() => {
    const postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    const likeChannel = supabase
      .channel("likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "postLikes" },
        handleLikeEvent
      )
      .subscribe();

    const commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        handleCommentEvent
      )
      .subscribe();

    // getPosts();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(likeChannel);
      supabase.removeChannel(commentChannel);
    };
  }, []);

  useEffect(() => {
    getPosts();
  }, []);

  const handleLikeEvent = (payload) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === payload.new.postId) {
          const likesCount =
            payload.eventType === "INSERT"
              ? post.postLikes.length + 1
              : post.postLikes.length - 1;
          return { ...post, postLikes: { length: likesCount } };
        }
        return post;
      });
    });
  };

  const handleCommentEvent = (payload) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === payload.new.postId) {
          const commentsCount =
            payload.eventType === "INSERT"
              ? post.comments.count + 1
              : post.comments.count - 1;
          return { ...post, comments: { count: commentsCount } };
        }
        return post;
      });
    });
  };

  const getPosts = async () => {
    if (!hasMore) return;
    setLoading(true);
    let res = await fetchPosts(limit);
    if (res.success) {
      if (res.data.length < limit) {
        setHasMore(false);
      }
      setPosts(res.data);
      setLimit(prevLimit => prevLimit + 7);
    }
    setLoading(false);
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
          <View className="flex-row space-x-1 items-end">
            <Text className="text-3xl text-white tracking-widest font-bold">
              Pixify
            </Text>
            <Text className="text-gray-400 pb-1">by Anmol</Text>
          </View>
          {/* icons */}
          <View className="flex-row space-x-3">
            <Pressable onPress={() => router.push("/Notifications")}>
              <BellIcon size={36} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/Post")}>
              <PlusCircleIcon size={36} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/Profile")}>
              <Avatar
                uri={user?.image}
                size={36}
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
          refreshing={refreshing || loading}
          onRefresh={onRefresh}
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
            <View className={`${posts.length == 0 ? "hidden" : "block mt-10"}`}>
              {hasMore ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <View className="flex items-center justify-center">
                  <Text className="text-white text-xl">No more posts 😟</Text>
                </View>
              )}
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
