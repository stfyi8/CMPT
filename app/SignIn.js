 import "global.css"
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Pressable, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Link } from 'expo-router';
import { Octicons } from '@react-native-vector-icons/octicons';
import { useRef, useState } from 'react';
import { useAuth } from '../context/authContext';
export default function SignIn() {

  const usernameRef = useRef("")
  const passwordRef = useRef("")
  const [loading, setLoading] = useState(false)
  const {login} = useAuth();

  const handleLogin = async ()=> {
      if(!usernameRef.current || !passwordRef.current){
        Alert.alert('Sign In', "Please fill in respective details!")// title, message
        return;
      }
      setLoading(true);
      const response = await login(usernameRef.current, passwordRef.current);
      setLoading(false)
      if (!response.success){
        Alert.alert('Sign In', response.msg);
      }
  }
  return (
    <View className="flex-1" style={{paddingHorizontal:wp(5)}}>
      <View className="gap-6">
      <Text className="text-center" style={[{fontSize:hp(4)},{paddingTop:hp(30)}]}>Sign In</Text>
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
          {/* forgot password */}
        <Text style={{fontSize: hp(1.8)}} class> Forgot Password?</Text>
      </View>
        
  {/* Sign in button */}
        <View>
          {
            loading? (
              <View>
                  <ActivityIndicator size='large' color="#fe9438"/>
              </View>
            ):(
                <TouchableOpacity onPress={handleLogin} style={{height:hp(6.5)}} className="bg-[#fe9438] justify-center rounded-xl items-center">
                   <Text style={{fontSize: hp(2.7)}} className="text-white font-bold tracking-wide">
                     Login
                    </Text>
               </TouchableOpacity>
            )
        }   
      </View>
      
       {/* sign up button */}
      <View className="flex-row justify-center">
        <Text style={{fontSize: hp(1.8)}} className="font-semibold text-neutral-500">Don't have an account? </Text>
        <Link href='/SignUp' asChild>
        <Pressable>
        <Text style={{fontSize: hp(1.8)}} className="font-semibold text-[#fe9438]">Sign up</Text>
        </Pressable>
        </Link>
      </View>
    </View>
    </View>
  );
};

