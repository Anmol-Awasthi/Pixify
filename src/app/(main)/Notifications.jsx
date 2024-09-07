import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useRouter } from 'expo-router';
import { notificationDetails } from '../../Services/notificationService';
import { useAuth } from '../../contexts/AuthContext';


export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const {user} =  useAuth();

  useEffect(() => {
    getNotifications();
  }, [])

  const getNotifications = async () => {
    let res = await notificationDetails(user.id)
    if(res.success){
      setNotifications(res.data);
    }
  }

  return (
    <View className="pt-12 px-4 bg-[#17153B] flex-1">
      <Header title="Notifications" router={router} />
      <ScrollView
      showsVerticalScrollIndicator={false}
      >

      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({})