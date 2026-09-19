import { Text, ScrollView, View, TouchableOpacity, Pressable, Modal, Alert, Image, Platform } from "react-native";
import type { ReminderItem } from "./Reminder";
import { Checkbox } from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useConst} from "./Const"
import { useAutoDelete } from "./AutoDelete";
import {useReminder} from "./Reminder"
//import { BlurView } from 'expo-blur';

type ReminderListProps = {
  reminders: (ReminderItem & { id: string })[];
  onCheckerChange: (reminderId: string, checker: boolean[]) => Promise<void>;
};

const ReminderModal = ({reminders, onCheckerChange}: ReminderListProps) => {
    const {selectedReminder, setSelectedReminder} = useConst();
    const closeModal = () => setSelectedReminder(null);
  return (
    <View>
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
            <View style={{ position: "absolute", marginTop: hp(34), width: 300, height: 280 }}>
              <Text style={{ fontSize: hp(4), textAlign: 'center', marginBottom: 12 }}>
                {selectedReminder?.title}
              </Text>

                 <ScrollView
                  className="gap-1"
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 10, paddingBottom: hp(8) }}
                >
               {/*close Modal button*/}
              {selectedReminder?.tasks?.map((task: string, taskIndex: number) => (
                  <View key={taskIndex} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, margin: 3 }} >
                    <Checkbox
                      value={selectedReminder.checker?.[taskIndex] ?? false}
                      onValueChange={ (checked) => {
                        if (!selectedReminder) return;

                        const updatedChecker = Array.from(
                          { length: selectedReminder.tasks?.length ?? 0 },
                          (_, index) => selectedReminder.checker?.[index] ?? false
                        );
                        updatedChecker[taskIndex] = checked;

                        setSelectedReminder({
                          ...selectedReminder,
                          checker: updatedChecker,
                        });
                        onCheckerChange(selectedReminder.id, updatedChecker);
                      }
                    }
                    />
                    <Text style={[{fontSize: hp(3), textAlign: "center"},  selectedReminder.checker?.[taskIndex] && {textDecorationLine: 'line-through', color: '#565555'}]}>{task}</Text>
                  </View>
              ))}
              </ScrollView>

              {/*close Modal button*/}
              <TouchableOpacity onPress={closeModal} style={{ padding: 15, position: "absolute", marginLeft: Platform.OS === 'android' ? wp(60) : wp(54), marginTop: Platform.OS === 'android' ? wp(67) : wp(59) }} className=" rounded-[20]">
                <Image
                  source={require('assets/myAssets/closeModal.png')}
                  style={{ width: 90, height: 87 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  )
}

export default ReminderModal