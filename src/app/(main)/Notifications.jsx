import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "expo-router";
import { notificationDetails } from "../../Services/notificationService";
import { useAuth } from "../../contexts/AuthContext";
import NotificationItem from "../../components/NotificationItem";

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await notificationDetails(user.id);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  return (
    <View className="pt-12 px-4 bg-[#17153B] flex-1">
      <Header title="Notifications" router={router} />
      <ScrollView
      showVerticalScrollIndicator={false}
      contentContainerStyle={{marginTop: 40, flex: 1}}
      >
        {
          notifications.map((item)=> {
            return (
              <NotificationItem
               item={item}
               key={item.id}
               router={router}
               />
            )
          })
        }
        {
          notifications.length != 0 && (
            <View className='items-center mt-10'><Text className="text-white text-lg">No more notifications 😌</Text></View>
          )
        }
        {
          notifications.length == 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-2xl">No notifications yet 😞 !</Text>
            </View>
          ) 
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
