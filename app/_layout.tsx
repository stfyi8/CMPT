
//DO NOT TOUCH THIS FILE
import "global.css"
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {AuthContextProvider, useAuth} from 'context/authContext'
import {Slot, useSegments, useRouter} from "expo-router";
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReminderProvider } from '../components/Reminder';
import { AutoDeleteProvider } from "../components/AutoDelete";
import { ConstProvider } from "../components/Const";

const MainLayout =()=>{
  const{isAuthenticated} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(()=>{
      //check if user is authenticated or not
      if(typeof isAuthenticated=='undefined') return;
      const inApp = segments[0]=='(app)'
      if(isAuthenticated && !inApp){
          (async () => {
            router.replace('ToDo')
          })();
      }else if(isAuthenticated==false){
          router.replace('SignIn')
      }
  }, [isAuthenticated])

  return <Slot />
}
export default function RootLayout() {
  return (
    <AuthContextProvider>
      <ReminderProvider>
        <AutoDeleteProvider>
          <ConstProvider>
        <MainLayout />
        </ConstProvider>
        </AutoDeleteProvider>
      </ReminderProvider>
    </AuthContextProvider>
   
  );
};

