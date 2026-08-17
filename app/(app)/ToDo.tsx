import { Link } from 'expo-router';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 import "global.css"
import { Image, Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { useAuth } from '../../context/authContext';
export default function list() {
  const {logout} = useAuth()
  const handleLogout = async ()=> {
    await logout();
  }
  return (
    <View className='flex-1'>
    <View className='gap-10'>
    <View className='bg-[#fe9438] pb-7 rounded-[30]'style={{paddingTop: Platform.OS === 'android' ? 60 : 70}}>
        <Text className='text-6xl text-center' style={[styles.shadow,{fontSize:hp(5.5)}]}>To-Do-List</Text>
      </View>
      <Text>wow</Text>

      <Pressable onPress={handleLogout}>
        <Text>logout</Text>
      </Pressable>
      
    {/* add the created reminder component */}
   </View>
      <View className=" flex-1 items-end justify-end p-5 pr-2 bg-top bg-red-20">
      <Link href='/AddReminder' asChild>
     <Pressable>
      <Image 
            source={require('assets/myAssets/addButton.png')}
          />
      </Pressable>
      </Link>
    </View>
   </View>
  );
};

    const styles = StyleSheet.create({
      shadow:{
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 4 },
    textAlign: "center",
    color: "#fff",
    fontFamily: "LINE Seed JP",
  },
    })