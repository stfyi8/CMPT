import { Link } from 'expo-router';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 import "global.css"
import { Image, Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { useAuth } from '../../context/authContext';
import { useReminder } from '../../components/Reminder';
import { Ionicons } from '@expo/vector-icons';
import { useState} from 'react';
import { Checkbox } from '@futurejj/react-native-checkbox';

export default function list() {
  const {logout} = useAuth()
   const { tasks, setTasks } = useReminder();
  const { title, setTitle } = useReminder();
  const [checked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const handleLogout = async ()=> {
    await logout();
  }
  // DO NOT TOUCH ANYTHING ABOVE 
  return (

    <View className='flex-1'>
    <View className='gap-10'>
     
       {/* The To-Do-List header on top*/}
    <View className='bg-[#fe9438] pb-7 rounded-[30]'style={{paddingTop: Platform.OS === 'android' ? 60 : 70}}>
        <Text className='text-6xl text-center' style={[styles.shadow,{fontSize:hp(5.5)}]}>To-Do-List</Text>
      </View>

        {/* The reminder component when you create the reminder*/}
        <View className="flex-1 gap-1 p-2 items-center bg-[#a3d9f7] rounded-[20] text-end">
        <Text className="text-lg font-bold">{title}</Text>
       {tasks.map((task, index) => (
        <View key={index}>
        <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={toggleCheckbox}
        />
       <Text>{task}</Text>
       </View>
      ))}
      </View>
      
      {/* logout button */}
      <Pressable onPress={handleLogout}>
        <Text>logout</Text>
      </Pressable>
   </View>

       {/* the plus button at the bottom right */}
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