import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState, memo } from "react";
import Avatar from "./Avatar";
import moment from "moment";
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseFileUrl } from "../Services/imageService";
import { Video } from "expo-av";
import { createPostLike, removePostLike } from "../Services/PostService";
import { stripHtmlTags } from "../helpers/common";

const PostCard = memo(({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcons = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const createdAtDate = moment(item.created_at).format("D MMM YY");
  const createdAtTime = moment(item.created_at).format("h:mm A");
  const [likes, setLikes] = useState([]);

  const openPostDetails = () => {
    if (!showMoreIcons) return null;
    router.push({ pathname: "postDetails", params: { postId: item.id } });
  };

  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, []);

  let liked = likes.filter((like) => like.userId === currentUser?.id).length > 0;

  const onLike = async () => {
    if (liked) {
      let updateLikes = likes.filter((like) => like.userId !== currentUser?.id);
      let res = await removePostLike(item.id, currentUser?.id);
      if (res.success) {
        setLikes([...updateLikes]);
      } else {
        Alert.alert("Post", "Something went wrong !");
      }
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item.id,
      };
      let res = await createPostLike(data);
      if (res.success) {
        setLikes([...likes, data]);
      } else {
        Alert.alert("Post", "Something went wrong !");
      }
    }
  };

  const handleDeletePost = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          onDelete(item);
        },
      },
    ]);
  }

  return (
    <View
      className={`${
        hasShadow ? "shadow-lg" : ""
      } border-2 border-gray-300 rounded-3xl px-4 py-2 my-2 flex flex-col`}
    >
      {/* User info */}
      <View className="flex-row items-center space-x-2 justify-start my-2">
        <Avatar uri={item.user.image} size={40} rounded={12} />
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{item.user.name}</Text>
          <View className="flex-row items-center space-x-1">
            <Text className="text-sm text-white/80">{createdAtDate}</Text>
            <Text className="text-sm text-white/80">·</Text>
            <Text className="text-sm text-white/80">{createdAtTime}</Text>
          </View>
        </View>
        {showMoreIcons && (
          <TouchableOpacity onPress={openPostDetails}>
            <EllipsisHorizontalIcon size={35} color="white" />
          </TouchableOpacity>
        )}
        {showDelete && currentUser?.id === item.user.id && (
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={() => onEdit(item)}
              className="opacity-80"
            >
              <PencilIcon size={28} color="yellow" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeletePost}
              className="opacity-80"
            >
              <TrashIcon size={28} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post body and media */}
      <View className={`pl-2 ${item.file ? "mb-3" : "mb-2"}`}>
        {item.body && (
          <RenderHtml
            contentWidth={100}
            source={{ html: item.body }}
            tagsStyles={{
              body: { color: "white", fontSize: 18, fontWeight: 600 },
              p: { color: "white" },
              span: { color: "white" },
            }}
          />
        )}
      </View>

      {/* Post Images */}
      {item?.file && item?.file?.includes("postImages") && (
        <View className="rounded-2xl overflow-hidden w-full aspect-square mb-3">
          <Image
            source={getSupabaseFileUrl(item.file)}
            transition={100}
            className="flex-1"
            contentFit="cover"
          />
        </View>
      )}

      {/* Post Video */}
      {item?.file && item?.file?.includes("postVideos") && (
        <View className="border border-gray-500 overflow-hidden h-[473px] rounded-3xl mt-4 mb-4">
          <Video
            source={{ uri: getSupabaseFileUrl(item.file) }}
            className="w-full h-full"
            resizeMode="contain"
            useNativeControls
            isLooping
          />
        </View>
      )}

      {/* Post Actions */}
      {showMoreIcons && (
        <View className="flex-row bg-black/30 border-2 border-gray-500 rounded-2xl mb-2 justify-around w-full items-center space-x-4 h-14 mt-2">
          <View>
            <TouchableOpacity
              onPress={onLike}
              className="p-2 flex-row items-center space-x-1"
            >
              <HeartIcon
                size={30}
                color={liked ? "red" : "white"}
                fill={liked ? "red" : "white"}
              />
              <Text className="text-white text-lg">{likes?.length}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={openPostDetails}
              className=" flex-row items-center justify-center space-x-1 p-2"
            >
              <ChatBubbleBottomCenterTextIcon size={30} color="white" />
              <Text className="text-white text-lg">
                {item?.comments?.[0]?.count || 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
});

export default PostCard;
