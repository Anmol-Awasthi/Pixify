import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";
import { ChatBubbleBottomCenterTextIcon, DocumentTextIcon, EllipsisHorizontalIcon, HandThumbUpIcon, HeartIcon, ShareIcon } from "react-native-heroicons/outline";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { getSupabaseFileUrl } from "../Services/imageService";
import { Video } from "expo-av";

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
  const createdAtDate = moment(item.created_at).format("D MMM YY");

  const createdAtTime = moment(item.created_at).format("h:mm A");

  const openPostDetails = () => {};

  let liked = false;
  const likes = [];

  return (
    <View
      className={`${
        hasShadow ? "shadow-lg" : ""
      } border-2 border-gray-500 rounded-3xl px-4 py-2 my-2`}
    >
      {/* User info */}
      <View className="flex-row items-center space-x-2 justify-start my-2">
        <Avatar uri={item.user.image} size={40} rounded={12} />
        <View className="flex-1">
          <Text className="text-white font-bold text-xl">
            {item.user.name}
          </Text>
          <View className="flex-row items-center space-x-1">
            <Text className="text-sm text-white/80">{createdAtDate}</Text>
            <Text className="text-sm text-white/80">·</Text>
            <Text className="text-sm text-white/80">{createdAtTime}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <EllipsisHorizontalIcon size={35} color="white" />
        </TouchableOpacity>
      </View>

      {/* Post body and media */}

      <View className="pl-2">
        {item.body && (
          <RenderHtml
            contentWidth={100}
            source={{ html: item.body }}
            tagsStyles={{
              body: { color: "white", fontSize: 18, fontWeight: 600 },
              p: { color: "white" },
              span: { color: "white" },
              // Add more tags as needed
            }}
          />
        )}
      </View>


      {/* Post Images */}

      {
        item?.file && item?.file?.includes('postImages') && (
          <Image
          source={getSupabaseFileUrl(item.file)}
          transition={100}
          className="w-full h-64 rounded-3xl mt-4 mb-2"
          contentFit="cover"
          />
        )
      }

      {/* Post Video */}

      {
        item?.file && item?.file?.includes('postVideos') && (
          <View className="border border-gray-500 mt-4 mb-2 rounded-3xl">
            <Video
            source={{ uri: getSupabaseFileUrl(item.file) }}
            className="w-full h-[400px] rounded-3xl"
            resizeMode="contain"
            useNativeControls
            isLooping
            
          />
          </View>
        )
      }

      {/* Post Actions */}
      <View className="flex-row flex-1 bg-cyan-5000 justify-around items-center space-x-4 mt-2 mb-1">
        <View>
          <TouchableOpacity onPress={() => {console.log("Liked")}} className="p-2 flex-row items-center space-x-1">
          <HeartIcon  size={30} color={liked ? 'red' : 'white'} fill={liked ? 'red' : 'white'} />
          <Text className='text-white text-lg'>{likes?.length}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity className="p-2">
          <ChatBubbleBottomCenterTextIcon size={30} color="white" />
          </TouchableOpacity>  
        </View>
        <View>
          <TouchableOpacity className="p-2">
          <ShareIcon size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({});
