import { LogBox, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "./lib/Supabase";
import { getUserData } from "../Services/userService";

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer', 'Warning: TRenderEngineProvider']);

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
          // console.log("Session user email: ", session.user.email);
          setAuth(session?.user);
          updateUserData(session?.user, session?.user?.email);
          router.replace("/Home");
        } else {
          setAuth(null);
          setUserData({});
          router.replace("/Welcome");
        }
      }
    );
  }, []);

  const updateUserData = async (user, email) => {
    if (user) {
      let res = await getUserData(user.id);
      if (res.success) {
        setUserData({ ...res.data, email: email || '' });
      }
    } else {
      // Handle the case where user is null
      setUserData({});
    }
  };
  
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
