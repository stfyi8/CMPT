// DO NOT TOUCH THIS FILE
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export type AutoDeleteItem = {
     isEnabled?: boolean;
};

type AutoDeleteContextValue = {
    isEnabled: boolean;
    setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSwitch: () => void;
    saveAuto: () => void;
};

export const AutoDelete = createContext<AutoDeleteContextValue | undefined>(undefined);

export const AutoDeleteProvider = ({ children }: PropsWithChildren) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    const saveAuto = async () =>{
         await AsyncStorage.setItem("autoDelete", JSON.stringify(isEnabled));
    }

    return (
        <AutoDelete.Provider value={{ isEnabled, setIsEnabled, toggleSwitch, saveAuto }}>
            {children}
        </AutoDelete.Provider>
    );
};

export const useAutoDelete = () => {
    const value = useContext(AutoDelete);

    if (!value) {
        throw new Error("useAutoDelete must be wrapped inside AutoDeleteProvider");
    }

    return value;
};

