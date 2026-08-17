 import "global.css"
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {AuthContextProvider, useAuth} from 'context/authContext'
import {Slot, useSegments, useRouter} from "expo-router";
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainLayout =()=>{
  const{isAuthenticated} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(()=>{
      //check if user is authenticated or not
      if(typeof isAuthenticated=='undefined') return;
      const inApp = segments[0]=='(app)'
      if(isAuthenticated && !inApp){
          // redirect to saved default screen, else to choice
          (async () => {
            const saved = await AsyncStorage.getItem('defaultScreen');
            router.replace(saved || 'choice');
          })();
      }else if(isAuthenticated==false){
          //redirect to sign in
          router.replace('SignIn')
      }
  }, [isAuthenticated])

  return <Slot />
}
export default function RootLayout() {
  return (
    <AuthContextProvider>
        <MainLayout/>
    </AuthContextProvider>
   
  );
};
