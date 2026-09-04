import { Link } from 'expo-router';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 import "global.css"
import { Image, Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { useReminder, type ReminderItem } from '../../components/Reminder';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect} from 'react';
import { getRoomId } from '../../common';
import { db } from 'firebaseConfig';
import { doc, setDoc, collection, query, orderBy, onSnapshot} from 'firebase/firestore';
import { useAuth } from 'context/authContext';
import ReminderList from '../../components/ReminderList';



export class PointStruct {
  // Readonly properties enforce immutability
  readonly checkbox: number;

  // Custom Initializer
  constructor(checkbox: number) {
    this.checkbox = checkbox;
    Object.freeze(this); // Guarantees the object cannot be mutated directly
  }
}

export default function list() {
  const {user} = useAuth();
  const {logout} = useAuth()
   const { tasks, setTasks } = useReminder();
  const { title, setTitle } = useReminder();
  // const {checked, setChecked} = useReminder();
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  const handleLogout = async ()=> {
    await logout();
  }

   useEffect(() => {
        if (!user?.uid) return;
        createRoomIfNotExists();

        let roomId = getRoomId(user?.uid || user?.userId);
        const docRef = doc(db, "rooms", roomId);
        const taskRef = collection(docRef, "tasks");
        const q = query(taskRef);

        let unsub = onSnapshot(q, (snapshot) => {
          //console.log("snapshot docs:", snapshot.docs.length);
  const allTasks = snapshot.docs.map(doc => doc.data());
  //console.log("allTasks:", allTasks);
  setReminders(allTasks as ReminderItem[]);
});
        

        return unsub;
      }, [user?.uid]);
    
      const createRoomIfNotExists = async () => {
        const roomId = getRoomId(user?.uid || user?.userId);
        await setDoc(doc(db, "rooms", roomId), {});
      };

  // DO NOT TOUCH ANYTHING ABOVE 
  return (

    <View className='flex-1'>
    <View className='gap-10'>
     
       {/* The To-Do-List header on top*/}
    <View className='bg-[#fe9438] pb-7 rounded-[30]'style={{paddingTop: Platform.OS === 'android' ? 60 : 70}}>
        <Text className='text-6xl text-center' style={[styles.shadow,{fontSize:hp(5.5)}]}>To-Do-List</Text>
      </View>

        {/* The reminder component when you create the reminder*/}
        <ReminderList reminders={reminders}/>
      
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