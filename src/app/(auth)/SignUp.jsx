import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../lib/Supabase";

export default function SignUp() {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const userNameRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !userNameRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    } else {
      let email = emailRef.current.trim();
      let password = passwordRef.current.trim();
      let name = userNameRef.current.trim();
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name,
            },
          },
        });
  
        if (error) throw error;
  
        // Inform the user to check their email
        Alert.alert(
          "Check Your Email",
          "A verification email has been sent. Please check your inbox to verify your email address."
        );
  
        // Optionally, you can redirect to a different page or reset the form
        router.replace("/SignIn"); // Or any other page you'd like to navigate to
      } catch (error) {
        console.log("Error:", error);
        Alert.alert("Sign Up", error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 px-8 bg-[#17153B]">
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
          className="mt-[50%] flex"
        >
          <Text className="text-4xl mb-4 text-[#83c3f5] font-semibold">
            Join Now !
          </Text>
          <Text className="text-xl text-white">Become a Pixify-er</Text>
        </Animated.View>

        <View className="pt-14 flex items-center gap-4">
          <Animated.View
            entering={FadeInDown.delay(50)
              .duration(1000)
              .springify()
              .damping(10)}
            className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4"
          >
            <UserCircleIcon size={24} color="gray" />
            <TextInput
              className="flex-1 tracking-wider text-xl text-white"
              placeholder="Username"
              keyboardType="default"
              required={true}
              placeholderTextColor={"gray"}
              onChangeText={(value) => (userNameRef.current = value)}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(150)
              .duration(1000)
              .springify()
              .damping(10)}
            className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4"
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
            entering={FadeInDown.delay(250)
              .duration(1000)
              .springify()
              .damping(10)}
            className="flex border-b-2 rounded-md py-2 border-white flex-row items-center gap-4"
          >
            <LockClosedIcon size={24} color="gray" />
            <TextInput
              className="text-xl flex-1 tracking-widest text-white"
              placeholder="Password"
              required={true}
              keyboardType="password"
              secureTextEntry={true}
              placeholderTextColor={"gray"}
              onChangeText={(value) => (passwordRef.current = value)}
            />
          </Animated.View>
        </View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify().damping(8)}
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
              <Text className="text-white text-2xl font-bold text-center">
                Sign Up
              </Text>
            </Pressable>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500)
            .duration(1000)
            .springify()
            .damping(11)}
          className="mt-14 flex flex-row items-center justify-center"
        >
          <Text className="text-white text-xl mr-2">
            Already have an account ?
          </Text>
          <Pressable onPress={() => router.replace("/(auth)/SignIn")}>
            <Text className="text-xl text-[#83c3f5]">Sign In</Text>
          </Pressable>
        </Animated.View>
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
