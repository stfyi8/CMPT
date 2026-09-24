import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Checkbox } from 'expo-checkbox';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useAuth } from 'context/authContext';
import { getRoomId, isReminderComplete, unblockApps } from '../../common';
import type { ReminderItem } from "../../components/Reminder";

type ReminderWithId = ReminderItem & { id: string };

export default function BlockedScreen() {
  const params = useLocalSearchParams();
  const appName = typeof params.app === "string" ? params.app : "This app";

  const { user } = useAuth();
  const [reminders, setReminders] = useState<ReminderWithId[]>([]);


  useEffect(() => {
    if (!user?.uid) return;

    const roomId = getRoomId(user?.uid ?? user?.userId);
    const taskRef = collection(doc(db, "rooms", roomId), "tasks");
    const q = query(taskRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const allTasks = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const storedTime = data.time;
        return {
          id: docSnap.id,
          ...data,
          time: storedTime?.toDate?.() ?? storedTime,
        };
      });
      setReminders(allTasks as ReminderWithId[]);
    });

    return unsub;
  }, [user?.uid]);

  const saveChecker = async (reminderId: string, checker: boolean[]) => {
    const roomId = getRoomId(user?.uid ?? user?.userId);
    await updateDoc(doc(db, "rooms", roomId, "tasks", reminderId), { checker });
  };

  const [now, setNow] = useState(() => Date.now());

 
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeReminders = reminders.filter((reminder) => {
    const dueTime = reminder.time?.getTime?.();
    return dueTime && now >= dueTime && !isReminderComplete(reminder);
  });


  const wasBlockedRef = useRef(false);

  useEffect(() => {
    const isBlocked = activeReminders.length > 0;

    const clearIfNeeded = async () => {
      if (isBlocked || !wasBlockedRef.current) return;

      try {
        unblockApps();

        router.replace('/ToDo');
      } catch (error) {
        console.error("Failed to clear blocks from BlockedScreen:", error);
      }
    };

    void clearIfNeeded();

    wasBlockedRef.current = isBlocked;
  }, [reminders, activeReminders.length]);

  return (
      <View className="bg-[#fe9438] flex-1">
        <View className="bg-[#FFFFFF] flex-1 m-4 rounded-[30]" >
      {activeReminders.length === 0 && (
        <Text style={{ fontSize: hp(2), textAlign: "center", marginTop: 12 }}>
          No overdue tasks right now.
        </Text>
      )}
      

      {activeReminders.map((reminder) => (
        <View key={reminder.id} style={{ marginTop: 16 }}>
          <View className='bg-[#a3d9f7] p-4 rounded-[30] m-2' >
          <Text className=' text-center' style={[ {fontSize: hp(5.5)}]}>{reminder.title ?? "Untitled reminder"}</Text>
          </View>
        <View className="-4 bg-[#a3d9f7] rounded-[20]" style={{ margin: 10 }}>
          {(reminder.tasks ?? []).map((task, taskIndex) => (
            <View key={taskIndex} style={styles.taskRow}> 
              <Checkbox
                value={reminder.checker?.[taskIndex] ?? false}
                onValueChange={(checked) => {
                  const updatedChecker = Array.from(
                    { length: reminder.tasks?.length ?? 0 },
                    (_, i) => reminder.checker?.[i] ?? false
                  );
                  updatedChecker[taskIndex] = checked;
                  saveChecker(reminder.id, updatedChecker);
                }}
              />
              <Text
                style={[
                  { fontSize: hp(3), marginLeft: 8 },
                  reminder.checker?.[taskIndex] && {
                    textDecorationLine: "line-through",
                    color: "#565555",
                  },
                ]}
              >
                {task}
              </Text>
            </View>
          ))}
          </View>
        </View>
      ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    padding:10,
  },
});