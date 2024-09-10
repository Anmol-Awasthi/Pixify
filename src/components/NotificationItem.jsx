import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";

const NotificationItem = ({ item, router }) => {
  //   console.log(item);

  const handleClick = () => {
    let {postId, commentId} = JSON.parse(item.data);
    router.push({pathname: 'postDetails', params: {postId, commentId}})
  }

  const createdAtDate = moment(item.created_at).format("MMM D");
  const createdAtTime = moment(item.created_at).format("h:mm A");

  return (
    <TouchableOpacity onPress={handleClick} className="bg-black/30 border-2 border-white mb-4 p-2 py-3 rounded-2xl">
      <View className="flex-row space-x-4 items-center justify-start">
        <Avatar uri={item.sender.image} size={50} rounded={18} />
        <View>
          <Text className="text-white font-bold text-2xl">
            {item.sender.name}{" "}
            <Text className="text-lg font-semibold">{item.title}</Text>
          </Text>
          <Text className="text-white">
            {createdAtDate} · {createdAtTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({});
