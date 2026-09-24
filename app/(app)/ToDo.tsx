import { Link } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import "global.css"
import { Image, Pressable, StyleSheet, Text, View, Platform, Switch, TouchableOpacity, Alert } from "react-native";
import { useReminder, type ReminderItem } from '../../components/Reminder';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { getRoomId, isReminderComplete, unblockApps } from '../../common';
import { db } from 'firebaseConfig';
import { doc, setDoc, collection, query, orderBy, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from 'context/authContext';
import ReminderList from '../../components/ReminderList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { useAutoDelete } from '../../components/AutoDelete';
import { timerNotification } from "../../components/LocalNotification";
import {
  getBlockedApps,
  getInstalledApps,
  setBlockedApps as setNativeBlockedApps, // renamed to avoid collision with local state setter
  startMonitoring,
} from "expo-app-blocker";
import { useConst } from "../../components/Const"

type InstalledApp = Awaited<
  ReturnType<typeof getInstalledApps>
>[number];

const ESSENTIAL_PACKAGES = new Set([
  "com.android.settings",
  "com.android.systemui",
  "com.google.android.dialer",
  "com.android.dialer",
  "com.android.launcher",
  "com.android.launcher3",
  "com.google.android.apps.nexuslauncher",
  "com.stfyi.CMPT",
  "com.android.camera2",
  "com.google.android.apps.photos",
  "com.google.apps.gm",
  "com.google.android.calendar",
  "com.google.android.deskclock",
  "com.google.android.contacts",
  "com.google.android.apps.docs",
  "com.google.android.documentsui",
  "com.google.android.gm",
  "com.android.vending",
  "com.google.android.apps.maps",
  // "com.google.android.apps.messaging",
  "com.google.android.apps.safetyhub",
  "com.android.stk",
]);


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
  const { isEnabled, setIsEnabled, } = useAutoDelete();
  const { toggleSwitch } = useAutoDelete();
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const snapPoints = useMemo(() => ['25%'], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { user } = useAuth();
  const { logout } = useAuth()
  const [reminders, setReminders] = useState<(ReminderItem & { id: string })[]>([]);
  const { selectedReminder, setSelectedReminder } = useConst();

  // Tracks whether we last evaluated as "blocked" or "unblocked", so the
  // combined block/unlock effect below only calls the native block/unlock
  // functions (and fires their Alerts) on an actual state transition,
  // instead of on every 15s poll.
  const wasBlockedRef = useRef(false);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    initialize();
  }, []); // init initialize


  async function blockAllNonEssentialApps() {
    if (installedApps.length === 0) return;
    try {
      const packagesToBlock = installedApps
        .map((app) => app.packageName)
        .filter((packageName) => !ESSENTIAL_PACKAGES.has(packageName));

      await setNativeBlockedApps(packagesToBlock); // actually calls the native library
      await startMonitoring();
      setBlockedApps(packagesToBlock); // local UI state
    } catch (error) {
      console.error("Failed to block apps:", error);
      Alert.alert("Error", "Unable to block non-essential apps.");
    }
  }

  async function unlockApps() {
    try {
      unblockApps();
      setBlockedApps([]);
      Alert.alert("Tasks completed", "All apps have been unlocked.");
    } catch (error) {
      console.error("Failed to unlock apps:", error);
      Alert.alert("Error", "Unable to unlock apps.");
    }
  }

 
  useEffect(() => {
    const evaluate = () => {
      const now = Date.now();

      const shouldBeBlocked = reminders.some((reminder) => {
        const dueTime = reminder.time?.getTime?.();
        return dueTime && now >= dueTime && !isReminderComplete(reminder);
      });

      if (shouldBeBlocked && !wasBlockedRef.current) {
        blockAllNonEssentialApps();
      } else if (!shouldBeBlocked && wasBlockedRef.current) {
        unlockApps();
      }

      wasBlockedRef.current = shouldBeBlocked;
    };

    evaluate();
    const interval = setInterval(evaluate, 5000);
    return () => clearInterval(interval);
  }, [reminders, installedApps]); // combined block/unlock condition

  async function initialize() {
    try {
      setLoading(true);

      const apps = await getInstalledApps();
      const existingBlockedApps = await getBlockedApps();

      setBlockedApps(existingBlockedApps);
      setInstalledApps(apps);
      wasBlockedRef.current = existingBlockedApps.length > 0;

      await startMonitoring();

      console.log(
        "Installed apps:",
        apps.map((app) => app.packageName)
      );
    } catch (error) {
      console.error("Failed to initialize app blocker:", error);
      Alert.alert("Error", "Unable to initialize the app blocker.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (reminders.length === 0) return;
    void timerNotification({ reminders });
  }, [reminders]);

  const saveChecker = async (reminderId: string, checker: boolean[]) => {
    const roomId = getRoomId(user?.uid || user?.userId);
    await updateDoc(doc(db, "rooms", roomId, "tasks", reminderId), { checker });
  };

  const handleLogout = async () => {
    await logout();
  }

  useEffect(() => {
    if (!user?.uid) return;
    createRoomIfNotExists();

    let roomId = getRoomId(user?.uid || user?.userId);
    const docRef = doc(db, "rooms", roomId);
    const taskRef = collection(docRef, "tasks");
    const q = query(taskRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      //console.log("snapshot docs:", snapshot.docs.length);
      const allTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        const storedTime = data.time;

        return {
          id: doc.id,
          ...data,
          time: storedTime?.toDate?.() ?? storedTime,
        };
      });
      //console.log("allTasks:", allTasks);
      setReminders(allTasks as (ReminderItem & { id: string })[]);
    });


    return unsub;
  }, [user?.uid]); //firebase

  const createRoomIfNotExists = async () => {
    const roomId = getRoomId(user?.uid || user?.userId);
    await setDoc(doc(db, "rooms", roomId), {});
  }; //firebase

  // DO NOT TOUCH ANYTHING ABOVE 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className='flex-1'>
          <View className='flex-1'>

            {/* The To-Do-List header on top*/}
            <View className='bg-[#fe9438] pb-7 rounded-[30]' style={{ paddingTop: Platform.OS === 'android' ? 60 : 70, marginBottom: 20}}>
              <Text className='text-6xl text-center' style={[styles.shadow, {fontSize: hp(5.5)}]}>To-Do-List</Text>
            </View>

            {/* The reminder component when you create the reminder*/}
            <View style={{ flex: 1, minHeight: 0 }}>
              <ReminderList reminders={reminders} onCheckerChange={saveChecker} />
            </View>
          </View>

          {/* the plus and settingsbutton at the bottom */}
          <View className="flex-row items-end pl-4 pr-2 justify-between" style={{ paddingBottom: Platform.OS === 'android' ? 20 : 40 }}>

            <TouchableOpacity onPress={handlePresentModalPress}>
              <Image
                source={require('assets/myAssets/settings.png')}
              />
            </TouchableOpacity>

            <Link href='/AddReminder' asChild>
              <TouchableOpacity>
                <Image
                  source={require('assets/myAssets/addButton.png')}
                />
              </TouchableOpacity>
            </Link>
          </View>


          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={handleSheetChanges}
            index={1}
          >
            <BottomSheetView>
              <Text className='text-center' style={{ fontSize: hp(2) }}>Settings</Text>

              {/* Toggle auto delete when all is striked through */}
              <View className="flex-row items-center justify-between p-6" >
                <Text style={{ fontSize: hp(2) }}>Auto Delete</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#fe9438' }}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  className=''
                />
              </View>

              {/* logout button */}
              <Pressable onPress={handleLogout} className='p-4 bg-[#fe9438] rounded-lg m-2'>
                <Text className='text-center text-white font-bold' style={[{ fontSize: hp(2) }]}>logout</Text>
              </Pressable>

            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 4 },
    textAlign: "center",
    color: "#fff",
    fontFamily: "LINE Seed JP",
  },
})