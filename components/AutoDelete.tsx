// DO NOT TOUCH THIS FILE
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";


export type AutoDeleteItem = {
     isEnabled?: boolean;
};

type AutoDeleteContextValue = {
    isEnabled: boolean;
    setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSwitch: () => void;

};

export const AutoDelete = createContext<AutoDeleteContextValue | undefined>(undefined);

export const AutoDeleteProvider = ({ children }: PropsWithChildren) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    return (
        <AutoDelete.Provider value={{ isEnabled, setIsEnabled, toggleSwitch }}>
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

