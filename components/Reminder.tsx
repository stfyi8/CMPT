// DO NOT TOUCH THIS FILE
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { getRoomId } from "common";
import { useAuth } from "context/authContext";
import { db } from 'firebaseConfig';
import { addDoc, collection, doc, Timestamp, deleteDoc } from 'firebase/firestore';


export type ReminderItem = {
    title?: string;
    tasks?: string[];
    createdAt?: unknown;
    time: Date;
    checker: boolean[];
    // deleteData: (taskId: string) => Promise<void>;
};

type ReminderContextValue = {
    tasks: string[];
    setTasks: React.Dispatch<React.SetStateAction<string[]>>;
    saveData: () => Promise<void>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    time: Date;
    setTime: React.Dispatch<React.SetStateAction<Date>>;
    checker: boolean[]
    deleteData: (taskId: string) => Promise<void>;
};

export const Reminder = createContext<ReminderContextValue | undefined>(undefined);

export const ReminderProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<string[]>([""]);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState(new Date())
    const checker = tasks.map(() => false);

    const saveData = async () => {
        // await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        // await AsyncStorage.setItem("title", JSON.stringify(title));

        if (!title || tasks.length === 0 || tasks.every(task => !task.trim())) return;
        try {
            const roomId = getRoomId(user?.uid ?? user?.userId);
            const docRef = doc(db, "rooms", roomId);
            const taskRef = collection(docRef, "tasks");

            const newDoc = await addDoc(taskRef, {
                title,
                tasks,
                checker,
                time,
                createdAt: Timestamp.fromDate(new Date()),
            });

            console.log("Document written with ID: ", newDoc.id);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Failed to save reminder";
            Alert.alert('save', message);
        }

        if (title.length === 0 || tasks.length === 0) {
            setTitle("");
            setTasks([""]);
        }
    };

    const deleteData = async (taskId: string) => {
    try {
        const roomId = getRoomId(user?.uid ?? user?.userId);

        const taskRef = doc(db, "rooms", roomId, "tasks", taskId);

        await deleteDoc(taskRef);

        console.log("Task successfully deleted!");
    } catch (error) {
        console.error("Error deleting task:");
    }
};


    console.log("tasks in context", tasks, title, time);

    return (
        <Reminder.Provider value={{
            tasks, setTasks, saveData, title, setTitle, time, setTime, checker, deleteData
        }}>
            {children}
        </Reminder.Provider>
    );
};

export const useReminder = () => {
    const value = useContext(Reminder);

    if (!value) {
        throw new Error("useReminder must be wrapped inside ReminderProvider");
    }

    return value;
};

//asyncStorage not used anymore, but can keep if needed.
// useEffect(() => {
//     const loadData = async () => {
//         try {
//             const stored = await AsyncStorage.getItem("tasks");
//             if (stored !== null) {
//                 setTasks(JSON.parse(stored));
//             }
//         } catch (e) {
//             console.error("Failed to load tasks", e);
//         }
//     };
//     loadData();
// }, []);

//  useEffect(() => {
//     const loadData = async () => {
//         try {
//             const stored = await AsyncStorage.getItem("title");
//             if (stored !== null) {
//                 setTitle(JSON.parse(stored));
//             }
//         } catch (e) {
//             console.error("Failed to load title", e);
//         }
//     };
//     loadData();
// }, []);