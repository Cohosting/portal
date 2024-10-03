import React, { createContext, useContext, useRef, useState } from 'react';

// Create the context
const ConversationContext = createContext();



// Create a provider component
export const ConversationProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const listRef = useRef(null);

    return (
        <ConversationContext.Provider value={{
            listRef,
            sidebarOpen,
            setSidebarOpen
        }}>
            {children}
        </ConversationContext.Provider>
    );
};
// Create a custom hook to use the context
export const useConversationContext = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversationContext must be used within a ConversationProvider');
    }
    return useContext(ConversationContext);
};