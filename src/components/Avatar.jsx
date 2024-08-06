import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Image} from 'expo-image'
import { getUserImageSrc } from '../Services/imageService'

const Avatar = ({
    uri,
    size=20,
    rounded=20,
    style={}
}) => {
  return (
    <View className="">
      <Image 
    source={getUserImageSrc(uri)}
    transition={100}
    style={[styles.avatar, {height: size, width: size, borderRadius:rounded}, style]}
    />
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        borderColor: 'white',
        borderWidth: 1,
    }
})