import { useState, useCallback, useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@react-native-vector-icons/octicons';
import { useReminder } from '../../components/Reminder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "global.css"



// you can edit all components with className="" e.g. View, Text, pressable...

export default function ToDo() {
  const { tasks, setTasks } = useReminder();
  const { saveData } = useReminder();
  const { title, setTitle } = useReminder();


  const updateTask = (index: number, value: string) => {
    setTasks(prev => prev.map((t, i) => (i === index ? value : t)));
  };
  // DO NOT TOUCH ANYTHING ABOVE 
  return (
    <View className='flex-1'>
      <View className='gap-10 flex-1'>

        {/* The Add Reminder header on top*/}
        <View className='bg-[#fe9438] pt-20 pb-7 rounded-[30]' style={{ paddingTop: Platform.OS === 'android' ? 60 : 70 }}>
          <Text className='text-center text-white' style={[styles.shadow, { fontSize: hp(5.5) }]}>Add Reminder</Text>
        </View>

         
         {/* This is the textbox to add the title*/}
        <View className='gap-4 flex-1' style={{ paddingHorizontal: wp(5) }}>
          <View className="flex-row gap-1 p-2 items-center bg-[#a3d9f7] rounded-[20]">
            <Text className='p-1' style={{ fontSize: hp(2) }}>Title:</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="Title"
              className="flex-1  text-neutral-700 bg-white rounded-xl p-3"
              placeholderTextColor="#999999"
            />
          </View>

          {/* This is the textbox to add tasks*/}
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {tasks.map((task, index) => (
              <View className="flex-row p-2 items-center bg-[#a3d9f7] rounded-[20]" key={index} >
                <Text className='p-1' style={{ fontSize: hp(2) }}>Task:</Text>
                <TextInput
                  onChangeText={v => updateTask(index, v)}
                  placeholder={`Item ${index + 1}`}
                  placeholderTextColor="#999999"
                  className="flex-1  text-neutral-700 bg-white rounded-xl pl-3"
                // clearButtonMode="while-editing" < = have the x to clear text 
                />

                {/* This is the delete button for each task */}
                <Pressable onPress={() => {
                  if (tasks.length > 1) {
                    setTasks(prev => prev.filter((_, i) => i !== index)); // remove row
                  }
                }}>
                  <Octicons name="x" size={hp(2)} color="#a53030" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </View> 


      <View className="flex-row items-center justify-between p-6" >

        {/* this is the delete button at the bottom*/}
        <Link href='/ToDo' asChild>
          <Pressable className=' p-4 bg-[#ff0000] rounded-full' onPress={() => {}}>
            <Text className='text-center text-white' style={[styles.shadow, { fontSize: hp(4) }]}>Delete</Text>
          </Pressable>
        </Link>
        
       {/* This is + button in the middle to add tasks */}
        <Pressable onPress={() => {
          setTasks(prev => [...prev, ""]);   // add a row
        }} className='pl-1'>
          <Image
            source={require('assets/myAssets/addButton.png')}
          />
        </Pressable>

        {/* This is the create button at the bottom */}
        <Link href='/ToDo' asChild>
          <Pressable className=' p-4 bg-[#07d200] rounded-full' onPress={() => { saveData() }}>
            <Text className='text-center text-white' style={[styles.shadow, { fontSize: hp(4) }]}>Create</Text>
          </Pressable>
        </Link>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  shadow: {
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 4 },
    textAlign: "center",
    fontFamily: "LINE Seed JP",
  },

  scrollArea: {
    width: '100%',
    marginTop: 5,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
    gap: 15 // Spacing between scrolling boxes
  },
})

