import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { useRouter } from 'expo-router';

export default function Notifications() {
  const router = useRouter();
  return (
    <View className="pt-12 px-4 bg-[#17153B] flex-1">
      <Header title="Notifications" router={router} />
    </View>
  )
}

const styles = StyleSheet.create({})