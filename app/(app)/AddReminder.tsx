import { useState, useRef } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Link } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@react-native-vector-icons/octicons';
import "global.css"

export default function ToDo() {
  const titleRef = useRef("")
  const [tasks, setTasks] = useState<string[]>([""]);
  const [modalVisible, setModalVisible] = useState(false);

   const updateTask = (index: number, value: string) => {
    setTasks(prev => prev.map((t, i) => (i === index ? value : t)));
  };
  return (
    <View className='flex-1'>
<View className='gap-10 flex-1'>
          <View className='bg-[#fe9438] pt-20 pb-7 rounded-[30]' style={{ paddingTop: Platform.OS === 'android' ? 60 : 70 }}>
            <Text className='text-center text-white' style={[styles.shadow, { fontSize: hp(5.5) }]}>Add Reminder</Text>
          </View>
          <View className='gap-4 flex-1' style={{ paddingHorizontal: wp(5) }}>
          <View className="flex-row gap-1 p-2 items-center bg-[#a3d9f7] rounded-[20]">
            <Text className='p-1' style={{ fontSize: hp(2) }}>Title:</Text>
            <TextInput
              onChangeText={value=> titleRef.current=value}
              placeholder="Title"
              className="flex-1  text-neutral-700 bg-white rounded-xl p-3"
              placeholderTextColor="#999999"
            />
          </View>
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}  showsVerticalScrollIndicator={false}>
            {tasks.map((task, index) => (
              <View className="flex-row p-2 items-center bg-[#a3d9f7] rounded-[20] " key={index} >
                <Text className='p-1' style={{ fontSize: hp(2) }}>Task:</Text>
                <TextInput
                  onChangeText={v => updateTask(index, v)}   
                  value={task} 
                  placeholder={`Item ${index + 1}`}
                  placeholderTextColor="#999999"
                  className="flex-1  text-neutral-700 bg-white rounded-xl pl-3"
                />
                <Pressable onPress={() => {
            if (tasks.length > 1) {
              setTasks(prev => prev.filter((_, i) => i !== index)); // remove row
                }}}>
                  <Octicons name="trash" size={hp(2)} color="grey" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View className="flex-row items-end justify-end pb-4 pr-2">
        <Link href='/ToDo' asChild>
          <Pressable className=' p-4 bg-[#ff0000] rounded-full'>
            <Text className='text-center text-white' style={[styles.shadow, { fontSize: hp(4) }]}>Delete</Text>
          </Pressable>
          </Link>

          <Pressable onPress={() => {
      setTasks(prev => [...prev, ""]);   // add a row
    }} className='pl-1'>
            <Image 
            source={require('assets/myAssets/addButton.png')}
            />
          </Pressable>

           <Pressable className=' p-4 bg-[#07d200] rounded-full'>
            <Text className='text-center text-white' style={[styles.shadow, { fontSize: hp(4) }]}>Create</Text>
          </Pressable>
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

// {tasks.map((task, index) => (
//       <Text key={index}>{task}</Text>
//     ))}