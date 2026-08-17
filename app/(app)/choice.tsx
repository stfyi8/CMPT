import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "global.css"

export default function Choice() {
  const handlePress = (screen: string) => async () => {
    await AsyncStorage.setItem('defaultScreen', screen);
  };
  return (
    <View className='flex-1 items-center justify-center gap-10'>
      <Link href='/ToDo' asChild>
        <Pressable onPress={handlePress('ToDo')} className='p-6 bg-[#fe9438] rounded-full opacity-75'>
          <Text>This device creates reminders</Text>
        </Pressable>
      </Link>
      <Link href='/AddReminder' asChild className='p-6 bg-[#fe9438] rounded-full opacity-75'>
        <Pressable onPress={handlePress('Notification')}>
          <Text>This device recieves reminders</Text>
        </Pressable>
      </Link>
      {/* <Link href='/AddReminder' asChild>
    <Pressable>
      <Text>This device receives and acceptes reminders</Text>
    </Pressable>
    </Link> */}
    </View>
  );
}