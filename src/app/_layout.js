import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "./lib/Supabase";
import Home from "./(main)/Home";
import index from "./index";
import { getUserData } from "../Services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const { setAuth, setUserData } = useAuth();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // console.log("Session user: ", session?.user);

        if (session) {
          setAuth(session.user);
          updateUserData(session?.user);
          // console.log("Attempting to navigate to /Home...");
          router.replace("/Home");
          // console.log("Redirection call made.");
        } else {
          setAuth(null);
          router.replace("/");
        }
      }
    );
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user.id);
    if(res.success) {
      setUserData(res.data);
    }
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default _layout;
