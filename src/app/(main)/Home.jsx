import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../lib/Supabase";
import {
  HeartIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { getUserData } from "../../Services/userService";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, setAuth } = useAuth();
  
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error: ", error.message);
      Alert.alert("Sign Out", "Error signing out.");
    }
  };

  const router = useRouter();

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 pt-12 px-4 bg-[#17153B] text-white">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl text-white tracking-widest font-bold">
              Pixify
            </Text>
          </View>
          {/* icons */}
          <View className="flex-row space-x-3">
            <Pressable onPress={() => router.push("/Notifications")}>
              <HeartIcon size={30} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/Post")}>
              <PlusCircleIcon size={30} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/Profile")}>
              <Avatar
                uri={user?.image}
                size={30}
                rounded={15}
                style={{ borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
