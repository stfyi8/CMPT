
//DO NOT TOUCH THIS FILE
 import "global.css";
import { View, ActivityIndicator } from "react-native";

export default function StartPage() {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' color="#fe9438"/>
    </View>
  );
}