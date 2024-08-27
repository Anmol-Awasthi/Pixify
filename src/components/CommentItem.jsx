import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";
import { ArchiveBoxIcon, TrashIcon } from "react-native-heroicons/outline";

const CommentItem = ({ item, canDelete = false, onDelete = () => {} }) => {
  const createdAtDate = moment(item.created_at).format("D MMM");
  const createdAtTime = moment(item.created_at).format("h:mm A");

  const handleDelete = () => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete(item);
        }
      },
    ]);
  };
  return (
    <View className="border-2 border-gray-500 p-1 px-2 rounded-lg mb-3">
      <View className="flex-row space-x-2 items-center justify-between">
        <View className="flex-row space-x-2">
          <Avatar uri={item.user.image} size={35} rounded={10} />
          <View className="items-start justify-center">
            <Text className="text-white font-semibold">{item.user.name}</Text>
            <View className="flex-row items-center justify-center space-x-1">
              <Text className="text-white/80 text-xs">{createdAtDate}</Text>
              <Text className="text-sm text-white/80">·</Text>
              <Text className="text-white/80 text-xs">{createdAtTime}</Text>
            </View>
          </View>
        </View>
        {canDelete && (
          <TouchableOpacity onPress={handleDelete} className="mr-2 opacity-80">
            <TrashIcon size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <View className="mt-2">
        <Text className="text-white">{item.text}</Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({});
