// DO NOT TOUCH THIS FILE
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import type { ReminderItem } from "./Reminder";

export type ConstItem = {
      selectedReminder: SelectedReminder;
  setSelectedReminder: React.Dispatch<
    React.SetStateAction<SelectedReminder>
  >;
};

type SelectedReminder = (ReminderItem & { id: string }) | null;

type ConstContextValue = {
  selectedReminder: SelectedReminder;
  setSelectedReminder: React.Dispatch<
    React.SetStateAction<SelectedReminder>
  >;
};

export const Const = createContext<ConstContextValue | undefined>(undefined);

export const ConstProvider = ({ children }: PropsWithChildren) => {
    const [selectedReminder, setSelectedReminder] = useState<(ReminderItem & { id: string }) | null>(null);
   
    return (
        <Const.Provider value={{selectedReminder, setSelectedReminder }}>
            {children}
        </Const.Provider>
    );
};

export const useConst = () => {
    const value = useContext(Const);

    if (!value) {
        throw new Error("useAutoDelete must be wrapped inside AutoDeleteProvider");
    }

    return value;
};

