import { Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Hero from "../../assets/Pixify-logo.png";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const index = () => {
  const router = useRouter();
  return (
    <>
      <StatusBar style="light" />
        <View className="pt-8 bg-[#17153B] flex-1">
          <Animated.View entering={FadeInUp.delay(50).duration(2000).springify().damping(8)} className="h-[45%] w-full mx-auto mt-8">
            <Image
              source={Hero}
              className="w-full object-cover h-full"
            />
          </Animated.View>
        </View>
        <Animated.View className="bg-white h-[45%] rounded-tl-[40px] shadow-xl shadow-black rounded-tr-[40px] w-full absolute bottom-0">
          <Animated.View
            className="flex-row justify-center items-center mt-16"
            entering={FadeInDown.delay(100).duration(600).springify().damping(10)}
          >
            <Text className="text-3xl px-10 font-medium text-center">
              Let's find{" "}
              <Text className="font-extrabold text-[#201a9b]">Professional</Text>{" "}
              <Text className="font-extrabold text-[#201a9b]">Creativity</Text> at your{" "}
              <Text className="font-extrabold text-[#201a9b]">Fingertips</Text>
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300).duration(600).springify().damping(10)}
            className="px-10 mt-6 text-center"
          >
            <Text className="text-lg text-center text-gray-800">
            Express Yourself, Discover Amazing Content, and Connect with Creators Everywhere.
            </Text>
          </Animated.View>
          <TouchableOpacity onPress={() => router.push('/(auth)/SignIn')}>
            <Animated.View
              entering={FadeInDown.duration(600).delay(400).springify().damping(7)}
              className="bg-[#201a9b] mx-36 py-2 rounded-full mt-10"
            >
              <Text className="text-white text-2xl text-center">Let’s go!</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});
