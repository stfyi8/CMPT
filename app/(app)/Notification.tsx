
import { StatusBar } from 'expo-status-bar';
 import "global.css";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";

export default function Notification() {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' color="#fe9438"/>
    </View>
  );
}