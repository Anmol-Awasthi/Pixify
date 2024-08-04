import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { EnvelopeIcon, LockClosedIcon } from "react-native-heroicons/outline";

export default function SignUp() {
  const router = useRouter();
  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-1 pt-8 px-8 bg-[#17153B]">
        <Pressable onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={36} color="white" />
        </Pressable>
        <View className="mt-[30%] flex flex-row items-center justify-center">
          <Text className="text-4xl text-center  mb-4 text-white font-semibold">
            Create Your Account !
          </Text>
        </View>

        <View className="pt-14 flex items-center gap-4">
        <Animated.View entering={FadeInDown.delay(100).duration(1000).springify().damping(10)} className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4">
            <EnvelopeIcon size={24} color="white" />
            <TextInput
              className="flex-1 tracking-widest text-xl text-white"
              placeholder="Username"
              keyboardType="default"
              required={true}
              placeholderTextColor={"white"}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(100).duration(1000).springify().damping(10)} className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4">
            <EnvelopeIcon size={24} color="white" />
            <TextInput
              className="flex-1 tracking-widest text-xl text-white"
              placeholder="Email"
              keyboardType="email-address"
              required={true}
              placeholderTextColor={"white"}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300).duration(1000).springify().damping(10)} className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4">
            <LockClosedIcon size={24} color="white" />
            <TextInput
              className="text-xl flex-1 tracking-widest text-white"
              placeholder="Password"
              required={true}
              keyboardType="password"
              secureTextEntry={true}
              placeholderTextColor={"white"}
            />
          </Animated.View>
        </View>
        <View className="flex items-center justify-center">
          <Pressable
            className="bg-[#6EACDA] rounded-xl w-[50%] py-3 px-6 mt-10"
            onPress={() => router.push("/")}
          >
            <Text className="text-white text-2xl font-bold text-center">
              Sign Up
            </Text>
          </Pressable>
        </View>

        <View className="mt-20 flex flex-row items-center justify-center">
          <Text className="text-white text-xl mr-2">
            Already have an account ?
          </Text>
          <Pressable onPress={() => router.push("/(auth)/SignIn")}>
            <Text className="text-xl text-[#83c3f5]">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
