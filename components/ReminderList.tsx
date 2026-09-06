import { Text, ScrollView, View, TouchableOpacity, Pressable, Modal, Alert, Image, Platform } from "react-native";
import type { ReminderItem } from "./Reminder";
import { Checkbox } from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from "react";
import { useAutoDelete } from "./AutoDelete";
import { BlurView } from 'expo-blur';


type ReminderListProps = {
  reminders: ReminderItem[];
};

export default function ReminderList({ reminders }: ReminderListProps) {
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(null);
  const { isEnabled, setIsEnabled, } = useAutoDelete();
  const [isDone, setIsDone] = useState(false);

  const closeModal = () => setSelectedReminder(null);

  if (!isEnabled) {
    return (
      <ScrollView
        style={{ flex: 1, minHeight: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(2) }}
      >
        {
          reminders.map((reminder: ReminderItem, index: number) => (
            <View key={index}>
              <TouchableOpacity onPress={() => setSelectedReminder(reminder)}>
                <View className="p-4 bg-[#a3d9f7] rounded-[20] justify-between flex-row items-center" style={{ margin: 10 }}>
                  <View className="flex-row items-center">
                    <View style={{ marginLeft: 10 }}>
                      {/* Task title */}
                      <Text style={[{ fontSize: hp(2.5) }, isDone && { textDecorationLine: 'line-through' }]}>{reminder.title ?? "Untitled reminder"}</Text>

                      {/* add Due date here */}
                      <Text style={[{ fontSize: hp(1.5) }, isDone && { textDecorationLine: 'line-through' }]}>DD/MM/YY</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {/*edit button*/}
                    <TouchableOpacity onPress={() => { alert("Reminder edited" + index) }} style={{ padding: 5 }}>
                      <Ionicons name="pencil" size={24} color="grey" />
                    </TouchableOpacity>

                    {/*delete button*/}
                    <TouchableOpacity onPress={() => { alert("Reminder deleted" + index) }} style={{ padding: 5 }}>
                      <Ionicons name="trash" size={24} color="grey" /> {/*color="#ef5151" */}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
         <Modal
          transparent={true}
          visible={selectedReminder !== null}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            closeModal();
          }}>
          <View className="items-center pt-4">
           <Image
              source={require('assets/myAssets/note.png')}
              style={{ marginTop: hp(30), width: 400, height: 400, marginLeft: hp(3) }}
            />
            <View style={{position: "absolute", marginTop: hp(34), width: 300, height: 280}}>
              <Text style={{ fontSize: hp(4), textAlign: 'center', marginBottom: 12 }}>
                {selectedReminder?.title}
              </Text>

              {selectedReminder?.tasks && selectedReminder.tasks.length > 0 ? (
                <ScrollView
                  className="gap-1"
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 10, paddingBottom: hp(8) }}
                >
                  {selectedReminder.tasks.map((task: string, taskIndex: number) => (
                    <View key={taskIndex} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, margin: 3}} >
                      <Checkbox value={false} />
                      <Text style={{ fontSize: hp(3), textAlign: "center" }}>{task}</Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View></View>
              )}
              
              {/*close Modal button*/}
              <TouchableOpacity onPress={closeModal} style={{  padding: 15, position: "absolute", marginLeft: Platform.OS === 'android' ?   wp(60) : wp(54), marginTop: Platform.OS === 'android' ?   wp(67) : wp(59)}} className=" rounded-[20]">
               <Image
              source={require('assets/myAssets/closeModal.png')}
              style={{width: 90, height: 87}}
            />
              </TouchableOpacity>
            </View>
            </View>
        </Modal>
      </ScrollView>

    );
  } else {
    return (
      <ScrollView
        style={{ flex: 1, minHeight: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(2) }}
      >
        {
          reminders.map((reminder: ReminderItem, index: number) => (
            <TouchableOpacity key={index} onPress={() => setSelectedReminder(reminder)}>
              <View className="p-4 bg-[#a3d9f7] rounded-[20] justify-between flex-row items-center" style={{ margin: 10 }}>
                <View className="flex-row items-center">
                  <View style={{ marginLeft: 10 }} >
                    {/* Task title */}
                    <Text style={[{ fontSize: hp(2.5) }, isDone && { textDecorationLine: 'line-through' }]}>{reminder.title ?? "Untitled reminder"}</Text>

                    {/* add Due date here */}
                    <Text style={[{ fontSize: hp(1.5) }, isDone && { textDecorationLine: 'line-through' }]}>DD/MM/YY</Text>
                  </View>
                </View>
                {/*edit button*/}
                <TouchableOpacity onPress={() => { alert("Reminder edited" + index) }} style={{ padding: 5 }}>
                  <Ionicons name="pencil" size={24} color="grey" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        }

       <Modal
          transparent={true}
          visible={selectedReminder !== null}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            closeModal();
          }}>
          <View className="items-center pt-4">
           <Image
              source={require('assets/myAssets/note.png')}
              style={{ marginTop: hp(30), width: 400, height: 400, marginLeft: hp(3) }}
            />
            <View style={{position: "absolute", marginTop: hp(34), width: 300, height: 280}}>
              <Text style={{ fontSize: hp(4), textAlign: 'center', marginBottom: 12 }}>
                {selectedReminder?.title}
              </Text>

              {selectedReminder?.tasks && selectedReminder.tasks.length > 0 ? (
                <ScrollView
                  className="gap-1"
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 10, paddingBottom: hp(8) }}
                >
                  {selectedReminder.tasks.map((task: string, taskIndex: number) => (
                    <View key={taskIndex} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, margin: 3}} >
                      <Checkbox value={false} />
                      <Text style={{ fontSize: hp(3), textAlign: "center" }}>{task}</Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View></View>
              )}
              
              {/*close Modal button*/}
              <TouchableOpacity onPress={closeModal} style={{  padding: 15, position: "absolute", marginLeft: Platform.OS === 'android' ?   wp(60) : wp(54), marginTop: Platform.OS === 'android' ?   wp(67) : wp(59)}} className=" rounded-[20]">
               <Image
              source={require('assets/myAssets/closeModal.png')}
              style={{width: 90, height: 87}}
            />
              </TouchableOpacity>
            </View>
            </View>
        </Modal>
      </ScrollView>

    )
  }
}