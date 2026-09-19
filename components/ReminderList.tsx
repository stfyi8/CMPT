import { Text, ScrollView, View, TouchableOpacity, Pressable, Modal, Alert, Image, Platform } from "react-native";
import type { ReminderItem } from "./Reminder";
import { Checkbox } from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState, useEffect } from "react";
import { useAutoDelete } from "./AutoDelete";
import { useConst } from "./Const"
import ReminderModal from "./ReminderModal"
import { useReminder } from '../components/Reminder';

//import { BlurView } from 'expo-blur';


type ReminderListProps = {
  reminders: (ReminderItem & { id: string })[];
  onCheckerChange: (reminderId: string, checker: boolean[]) => Promise<void>;
};

export default function ReminderList({ reminders, onCheckerChange }: ReminderListProps) {
  const { selectedReminder, setSelectedReminder } = useConst();
  const { isEnabled, setIsEnabled, } = useAutoDelete();
  const { deleteData } = useReminder()

  useEffect(() => {
    if (!isEnabled) return;

    reminders.forEach((reminder) => {
      const checker = selectedReminder?.checker;

      const allChecked =
        checker &&
        checker.every(Boolean);

      if (allChecked) {
        deleteData(reminder.id);
      }
    });
  }, [isEnabled, reminders, selectedReminder]);




  if (!isEnabled) {
    return (
      <ScrollView
        style={{ flex: 1, minHeight: 0 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(2) }}
      >
        {
          reminders.map((reminder, index: number) => (
            <View key={index}>
              <TouchableOpacity onPress={() => setSelectedReminder(reminder)}>
                <View className="p-4 bg-[#a3d9f7] rounded-[20] justify-between flex-row items-center" style={{ margin: 10 }}>
                  <View className="flex-row items-center">
                    <View style={{ marginLeft: 10 }}>
                      {/* Task title */}
                      <Text style={{ fontSize: hp(2.5) }}>{reminder.title ?? "Untitled reminder"}</Text>

                      {/* add Due date here */}
                      <Text style={{ fontSize: hp(1.5) }}>{
                      reminder.time.toLocaleString()
                      }</Text>

                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {/*edit button*/}
                    <TouchableOpacity onPress={() => { alert("Reminder edited" + index) }} style={{ padding: 5 }}>
                      <Ionicons name="pencil" size={24} color="grey" />
                    </TouchableOpacity>

                    {/*delete button, color="#ef5151" */}
                    <TouchableOpacity onPress={() => { deleteData(reminder.id) }} style={{ padding: 5 }}>
                      <Ionicons name="trash" size={24} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
        <ReminderModal reminders={reminders} onCheckerChange={onCheckerChange} />
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
          reminders.map((reminder, index: number) => (
            <TouchableOpacity key={index} onPress={() => setSelectedReminder(reminder)}>
              <View className="p-4 bg-[#a3d9f7] rounded-[20] justify-between flex-row items-center" style={{ margin: 10 }}>
                <View className="flex-row items-center">
                  <View style={{ marginLeft: 10 }} >
                    {/* Task title */}
                    <Text style={[{ fontSize: hp(2.5) }]}>{reminder.title ?? "Untitled reminder"}</Text>

                    {/* add Due date here */}
                    <Text style={{ fontSize: hp(1.5) }}>{reminder.time.toLocaleString()}</Text>

                  </View>
                </View>
                {/*edit button*/}
                <TouchableOpacity onPress={() => { alert("Reminder edited" + index) }} style={{ padding: 5 }}>
                  <Ionicons name="pencil" size={24} color="grey" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            // if statement? if(isEnabled && selectedReminder.checker){return () => deleteData(reminder.id)}
          )
          )
        }
        <ReminderModal reminders={reminders} onCheckerChange={onCheckerChange} />

      </ScrollView>



    )
  }
}