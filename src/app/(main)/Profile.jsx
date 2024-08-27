import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import React from "react";
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

export default function Profile() {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  return (
    <View className="flex-1 pt-12 px-4 bg-[#17153B] text-white">
      <UserHeader user={user} router={router} />
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
    <View className="flex-1">
      <Header title="Profile" router={router} />
      <View className="bg-[#faaeae] h-10 w-10 flex items-center justify-center rounded-full absolute right-0">
        <TouchableOpacity
          onPress={() => onLogout()}
          className="flex items-center justify-center"
        >
          <PowerIcon size={28} color="red" />
        </TouchableOpacity>
      </View>

      <View className="mt-14">
        <Animated.View
          entering={FadeInDown.delay(100).springify().damping(10)}
          className="AvatarContainer flex items-center justify-center"
        >
          <View className="relative">
            <Avatar
              uri={user?.image}
              size={130}
              rounded={20}
              style={{ borderCurve: "continuous", borderWidth: 2 }}
            />
            <Pressable
              onPress={() => router.push("/EditProfile")}
              className="absolute -bottom-2 -right-4 bg-white rounded-xl shadow-2xl shadow-black p-2"
            >
              <PencilIcon size={24} color="black" />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(150).springify().damping(10)}
          className=" flex items-center justify-center mt-7"
        >
          <Text className="text-white text-3xl font-medium">{user?.name}</Text>
        </Animated.View>

        {user && user.address && (
          <Animated.View
            entering={FadeInDown.delay(200).springify().damping(10)}
            className="flex-row items-center justify-center gap-2"
          >
            <Text className="text-white/75 text-lg font-medium">
              {user.address}
            </Text>
          </Animated.View>
        )}

        <View className="flex items-center justify-start gap-y-7 mx-auto w-[90%] mt-10">
          <Animated.View
            entering={FadeInDown.delay(250).springify().damping(10)}
            className="flex-row items-center justify-start space-x-3 py-2 px-4 border-gray-500 rounded-3xl border-2"
          >
            <EnvelopeIcon size={20} color="white" />
            <Text className="text-white text-xl font-medium">
              {user?.email}
            </Text>
          </Animated.View>

          {user && user.phoneNumber && (
            <Animated.View
              entering={FadeInDown.delay(300).springify().damping(10)}
              className="flex-row items-center justify-start space-x-3 py-2 px-4 border-gray-500 rounded-3xl border-2"
            >
              <PhoneIcon size={20} color="white" />
              <Text className="text-white text-xl font-medium">
                {user?.phoneNumber}
              </Text>
            </Animated.View>
          )}

          {user && user.bio && (
            <Animated.View
              entering={FadeInDown.delay(350).springify().damping(10)}
              className="flex-row items-center justify-start space-x-3 py-2 px-4 border-gray-500 rounded-3xl border-2"
            >
              <Text className="text-white text-xl font-medium">
                {user?.bio}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};
