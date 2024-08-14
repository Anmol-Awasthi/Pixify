import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = ({title, router, showBackButton=true, mb=10}) => {

  return (
    <View className='flex items-center justify-center space-x-2' style={{marginBottom: mb}}>
       {
        showBackButton &&
        <TouchableOpacity onPress={() => router.back()} className="border-2 border-white h-10 w-10 flex items-center justify-center rounded-full absolute left-0">
          <View  className="flex items-center justify-center">
            <Ionicons name="chevron-back" size={28} color="white" />
          </View>
        </TouchableOpacity>
       } 
      <Text className="text-3xl text-white font-semibold">{title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})