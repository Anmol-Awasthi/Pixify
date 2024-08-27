import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import PostCard from "../../components/PostCard";
import {
  createComment,
  fetchPostDetails,
  removeComment,
} from "../../Services/PostService";
import {
  PaperAirplaneIcon,
  Square3Stack3DIcon,
} from "react-native-heroicons/outline";
import CommentItem from "../../components/CommentItem";
import Header from "../../components/Header";
import { supabase } from "../lib/Supabase";
import { getUserData } from "../../Services/userService";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  // console.log("Post Id: ", postId);

  const [post, setPost] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [sendLoading, setSendLoading] = useState(false);

  const contentContainerStyle = React.useMemo(
    () => ({
      paddingHorizontal: 16,
    }),
    []
  );

  const getPostDetails = useCallback(async () => {
    let res = await fetchPostDetails(postId);
    if (res.success) {
      setPost(res.data);
      // console.log("Post: ", res.data);
    }
    setLoading(false);
  }, [postId]);

  const onAddComment = async () => {
    if (!commentRef.current) return null;
    setSendLoading(true);
    let data = {
      postId: post?.id,
      text: commentRef.current,
      userId: user?.id,
    };
    let res = await createComment(data);
    if (res.success) {
      commentRef.current = "";
      inputRef.current.setNativeProps({ text: '' });
      setSendLoading(false);
      // console.log("Comment added successfully", res.data);
    } else {
      setSendLoading(false);
      Alert.alert(
        "Comment Error",
        "Something went wrong while creating comment !"
      );
    }
  };

  const handleNewComment = async (payload) => {
    // console.log("New comment: ", payload);
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prev) => {
        return {
          ...prev,
          comments: [newComment, ...prev.comments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const loadingView = React.useMemo(
    () => (
      <View className="flex-1 items-center justify-center bg-[#17153B] text-white pt-10">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    ),
    []
  );

  if (loading) {
    return loadingView;
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-[#17153B] text-white pt-10">
        <Text className="text-white text-2xl">Post not found 😰</Text>
      </View>
    );
  }

  const onDeleteComment = async (comment) => {
    // console.log("Comment to delete: ", comment);
    let res = await removeComment(comment?.id);
    if (res.success) {
      // console.log("Comment deleted successfully", res.data);
      setPost((prev) => {
        let comments = prev?.comments?.filter((c) => c.id !== comment.id);
        return { ...prev, comments };
      });
    } else {
      Alert.alert(
        "Comment Error",
        "Something went wrong while deleting comment !"
      );
    }
  };

  return (
    <View className="flex-1 bg-[#17153B] text-white pt-12">
      <View className="px-4">
        <Header title="" router={router} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcons={false}
        />
        <View className="bg-transparent border-2 border-gray-300 px-3 py-2 rounded-lg my-4 flex-row">
          <TextInput
            ref={inputRef}
            placeholder="Type your comment here.."
            className="text-lg text-white flex-1 pr-3"
            placeholderTextColor={"#E3E3E3"}
            onChangeText={(text) => (commentRef.current = text)}
            defaultValue=""
          />
          {sendLoading ? (
            <View className="bg-gray-300 mr-2 p-3 rounded-full">
              <ActivityIndicator size="small" color={"#000"} />
            </View>
          ) : (
            <TouchableOpacity
              className="bg-gray-200 mr-2 p-2 rounded-full"
              onPress={onAddComment}
            >
              <PaperAirplaneIcon size={28} color="black" />
            </TouchableOpacity>
          )}
        </View>

        {/* Comment List  */}
        {/* {console.log("Comments: ", post?.comments)} */}
        <View className="gap-8 mt-2 mb-4 mx-auto w-full">
          {post?.comments?.map((comment) => (
            <CommentItem
              item={comment}
              key={comment.id.toString()}
              canDelete={comment.user.id === user?.id || user.id == post.userId}
              onDelete={onDeleteComment}
            />
          ))}
        </View>
        {post?.comments?.length === 0 && (
          <View className="items-center mt-4 text-white mx-auto w-full">
            <Text className="text-white text-xl font-bold">
              Be the first to comment !
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});
