import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { EnvelopeIcon, LockClosedIcon } from "react-native-heroicons/outline";
import Ionicons from "@expo/vector-icons/Ionicons";
import { supabase } from "../lib/Supabase";
import { StatusBar } from "expo-status-bar";

export default function SignUp() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Error: ", error.message);
        Alert.alert("Login", error.message);
      } else {
        // Handle successful login, e.g., navigate to another screen
        // console.log("Login successful");
      }
    } catch (error) {
      console.log("Unexpected Error: ", error.message);
      Alert.alert("Login", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 bg-[#17153B]">
        <View className="px-8 flex-1">
          <View className="border-2 border-white h-10 w-10 flex items-center justify-center rounded-full absolute top-14 left-8">
            <Pressable
              onPress={() => router.back()}
              className="flex items-center justify-center"
            >
              <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>
          </View>
          <Animated.View
            entering={FadeInUp.delay(50).duration(1000).springify().damping(7)}
            className="mt-[55%] flex"
          >
            <Text className="text-4xl mb-4 text-[#83c3f5] font-semibold">
              Welcome back!
            </Text>
            <Text className="text-xl text-white">
              Log in to continue your creative journey
            </Text>
          </Animated.View>

          <View className="mt-20">
            <Animated.View
              entering={FadeInDown.delay(100)
                .duration(1000)
                .springify()
                .damping(10)}
              className="flex border-b-2 py-2 rounded-md border-white flex-row items-center gap-4"
            >
              <EnvelopeIcon size={24} color="gray" />
              <TextInput
                className="flex-1 tracking-wider text-xl text-white"
                placeholder="Email"
                keyboardType="email-address"
                required={true}
                placeholderTextColor={"gray"}
                onChangeText={(value) => (emailRef.current = value)}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(300)
                .duration(1000)
                .springify()
                .damping(10)}
              className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4 mt-8"
            >
              <LockClosedIcon size={24} color="gray" />
              <TextInput
                className="text-xl flex-1 tracking-wider text-white"
                placeholder="Password"
                required={true}
                secureTextEntry={true}
                placeholderTextColor={"gray"}
                onChangeText={(value) => (passwordRef.current = value)}
              />
            </Animated.View>
          </View>
          <Animated.View
            entering={FadeInDown.delay(450)
              .duration(1000)
              .springify()
              .damping(8)}
            className="flex items-center justify-center"
          >
            {loading ? (
              <Text className="text-white px-6 mt-10 text-xl">
                <ActivityIndicator size="large" color="white" />
              </Text>
            ) : (
              <Pressable
                className="border-2 border-white rounded-xl w-[40%] py-2 px-6 mt-10"
                onPress={onSubmit}
              >
                <Text className="text-white text-3xl font-bold text-center">
                  Sign In
                </Text>
              </Pressable>
            )}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(550)
              .duration(1000)
              .springify()
              .damping(11)}
            className="mt-16 flex flex-row items-center justify-center"
          >
            <Text className="text-white text-xl mr-2">
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/SignUp")}>
              <Text className="text-xl text-[#83c3f5]">Sign Up</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </>
  );
}
