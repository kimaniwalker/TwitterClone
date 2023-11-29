import React, { useState, createContext, useRef } from "react";



interface UserPreferenceProviderProps {
    children: React.ReactNode
}
interface UserPreferenceProps {
    hideTabNavigation: boolean
    setHideTabNavigation: React.Dispatch<React.SetStateAction<boolean>>
    currentMessageId: string
    setCurrentMessageId: React.Dispatch<React.SetStateAction<string>>
}
const defaultValue = {
    hideTabNavigation: false,
    setHideTabNavigation: () => false,
    currentMessageId: '',
    setCurrentMessageId: () => ''
}

export const UserPreferenceContext = createContext<UserPreferenceProps>(defaultValue);

export const UserPreferenceWrapper = ({ children }: UserPreferenceProviderProps) => {

    const [hideTabNavigation, setHideTabNavigation] = useState(false)
    const [currentMessageId, setCurrentMessageId] = useState('')


    return (
        <UserPreferenceContext.Provider value={{ hideTabNavigation, setHideTabNavigation, currentMessageId, setCurrentMessageId }}>
            {children}
        </UserPreferenceContext.Provider>
    );
};

export function useUserPreferenceContext() {
    return React.useContext(UserPreferenceContext)
}