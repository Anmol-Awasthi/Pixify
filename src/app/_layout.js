import { LogBox, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "./lib/Supabase";
import { getUserData } from "../Services/userService";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
  "You seem to update props of"
]);

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
      async (_event, session) => {
        if (session) {
          setAuth(session?.user);
          await updateUserData(session?.user, session?.user?.email);
          router.replace("/Home");
        } else {
          setAuth(null);
          setUserData({});
          router.replace("/Welcome");
        }
      }
    );

    checkSession();

    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/Welcome");
    }
  };

  const updateUserData = async (user, email) => {
    if (user) {
      let res = await getUserData(user.id);
      if (res.success) {
        setUserData({ ...res.data, email: email || "" });
      }
    } else {
      setUserData({});
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "modal",
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default _layout;
