 import "global.css"
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Pressable, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Link } from 'expo-router';
import { Octicons } from '@react-native-vector-icons/octicons';
import { useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/authContext';
export default function SignUp() {

  const usernameRef = useRef("")
  const passwordRef = useRef("")
  const [loading, setLoading] = useState(false)
  const {register} = useAuth()

  const handleRegister = async ()=> {
      if(!usernameRef.current || !passwordRef.current){
        Alert.alert('Sign In', "Please fill in respective details!")// title, message
        return;
      }

      setLoading(true)

      let response = await register(usernameRef.current, passwordRef.current);
      setLoading(false);

      console.log('got results:', response);
      if(response.success){
        console.log('stored keys:', await AsyncStorage.getAllKeys());
      }
      if(!response.success){
        Alert.alert('Sign Up', response.msg);
      }
  }
  return (
    <View className="flex-1" style={{paddingHorizontal:wp(5)}}>
      <View className="gap-6">
      <Text className="text-center" style={[{fontSize:hp(4)},{paddingTop:hp(30)}]}>Sign Up</Text>
      <View className="flex-row gap-4 p-4 items-center bg-neutral-100 rounded-xl">
        
         {/* username and password inputs */}
        <Octicons name="mail" size={hp(2.7)} color="gray"/>
         <TextInput 
         onChangeText={value=> usernameRef.current=value}
          style={{fontSize:hp(2)}}
          placeholder="Email"
          className="flex-1  text-neutral-700"
          />
      </View>
      <View className="gap-3">
      <View className="flex-row gap-4 p-4 items-center bg-neutral-100 rounded-xl">
        <Octicons name="lock" size={hp(2.7)} color="gray"/>
         <TextInput 
         onChangeText={value=> passwordRef.current=value}
          style={{fontSize:hp(2)}}
          placeholder="Password"
          secureTextEntry
          className="flex-1  text-neutral-700"
          />
          </View>
      </View>
        
  {/* Sign in button */}
        <View>
          {
            loading? (
              <View>
                  <ActivityIndicator size='large' color="#fe9438"/>
              </View>
            ):(
                <TouchableOpacity onPress={handleRegister} style={{height:hp(6.5)}} className="bg-[#fe9438] justify-center rounded-xl items-center">
                   <Text style={{fontSize: hp(2.7)}} className="text-white font-bold tracking-wide">
                     Sign Up
                    </Text>
               </TouchableOpacity>
            )
        }   
      </View>
      
      {/* sign up button */}  
      <View className="flex-row justify-center">
        <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-500">Already have an account? </Text>
        <Link href='/SignIn' asChild>
        <Pressable>
        <Text style={{fontSize: hp(1.8)}} className="font-semibold text-[#fe9438]">Sign in</Text>
        </Pressable>
        </Link>
      </View>
    </View>
    </View>
  );
};

