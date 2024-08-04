import { Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Hero from "../../assets/Hero-img.png";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";

const index = () => {
  const router = useRouter();
  return (
    <>
      <StatusBar style="light" />
        <View className="pt-8 bg-[#17153B] flex-1">
          <View className="h-[45%] object-cover w-[90%] mx-auto mt-8">
            <Image
              source={Hero}
              className="w-full object-cover h-full"
            />
          </View>
        </View>
        <View className="bg-white h-[45%] rounded-tl-[40px] shadow-xl shadow-black rounded-tr-[40px] w-full absolute bottom-0">
          <Animated.View
            className="flex-row justify-center items-center mt-16"
            entering={FadeInDown.delay(100).duration(1000).springify().damping(10)}
          >
            <Text className="text-3xl px-10 font-medium text-center">
              Let's Find{" "}
              <Text className="font-bold text-[#201a9b]">Professional</Text>{" "}
              <Text className="font-bold text-[#201a9b]">Cleaning</Text> and{" "}
              <Text className="font-bold text-[#201a9b]">Repair</Text> Service
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300).duration(1000).springify().damping(10)}
            className="px-10 mt-6 text-center"
          >
            <Text className="text-xl text-center text-gray-800">
              Best App to find services near you which deliver a professional
              experience
            </Text>
          </Animated.View>
          <TouchableOpacity onPress={() => router.push('/(auth)/SignIn')}>
            <Animated.View
              entering={FadeInDown.duration(1000).delay(500).springify().damping(7)}
              className="bg-[#201a9b] mx-24 py-2 rounded-full mt-10"
            >
              <Text className="text-white text-2xl text-center">Let's Get Started</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});
