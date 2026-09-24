import { createContext, useContext, useState, useEffect, useRef, type PropsWithChildren } from "react";
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
    const initialized = useRef(false);

    // Load the persisted preference once on mount.
    useEffect(() => {
        let active = true;
        AsyncStorage.getItem("autoDelete")
            .then(value => {
                if (!active) return;
                if (value != null) setIsEnabled(JSON.parse(value));
                initialized.current = true;
            })
            .catch(() => {
                initialized.current = true;
            });
        return () => {
            active = false;
        };
    }, []);

    // Persist whenever the preference changes (skips the pre-load default).
    useEffect(() => {
        if (!initialized.current) return;
        AsyncStorage.setItem("autoDelete", JSON.stringify(isEnabled));
    }, [isEnabled]);

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

