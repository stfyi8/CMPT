import { Text, ScrollView, View } from "react-native";
import type { ReminderItem } from "./Reminder";
import { Checkbox } from 'expo-checkbox';
type ReminderListProps = {
  reminders: ReminderItem[];
};

export default function ReminderList({ reminders }: ReminderListProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} >
       {
        reminders.map((reminder: ReminderItem, index: number) => (
          <View key={index} className="p-4 bg-[#a3d9f7] rounded-[20] flex-row" style={{ margin: 10 }}>  
            <Checkbox value={true} />
            <View style={{ marginLeft: 10 }}>              
              <Text>{reminder.title ?? "Untitled reminder"}</Text>
              {reminder.tasks?.map((task, i) => (
                <Text key={i}>{task}</Text>
              ))}
            </View>
          </View>
        ))
       }
      </ScrollView>
  );
}
