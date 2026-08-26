// DO NOT TOUCH THIS FILE
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type ReminderContextValue = {
    tasks: string[];
    setTasks: React.Dispatch<React.SetStateAction<string[]>>;
    saveData: () => Promise<void>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const Reminder = createContext<ReminderContextValue | undefined>(undefined);

export const ReminderProvider = ({ children }: PropsWithChildren) => {
    const [tasks, setTasks] = useState<string[]>([""]);
    const [title, setTitle] = useState("");
    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem("tasks");
                if (stored !== null) {
                    setTasks(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load tasks", e);
            }
        };
        loadData();
    }, []);

     useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem("title");
                if (stored !== null) {
                    setTitle(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load title", e);
            }
        };
        loadData();
    }, []);

    const saveData = async () => {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        await AsyncStorage.setItem("title", JSON.stringify(title));
    };

    return (
        <Reminder.Provider value={{ tasks, setTasks, saveData, title, setTitle }}>
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