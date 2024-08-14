import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <View className="flex-1 bg-[#17153B] flex justify-center items-center">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  )
}

export default index

const styles = StyleSheet.create({})