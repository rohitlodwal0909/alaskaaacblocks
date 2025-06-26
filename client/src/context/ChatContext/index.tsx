'use client'
import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import React from "react";
import useSWR from 'swr';
import  {  ChatsType, MessageType }  from '../../features/chat/Chatdata';
import  ChatData  from '../../features/chat/Chatdata';



// Define context props interface
export interface ChatContextProps {
    chatData: ChatsType[];
    chatContent: any[];
    chatSearch: string;
    selectedChat: ChatsType | null;
    loading: boolean;
    error: string;
    activeChatId: number | null;
    setChatContent: Dispatch<SetStateAction<any[]>>;
    setChatSearch: Dispatch<SetStateAction<string>>;
    setSelectedChat: Dispatch<SetStateAction<ChatsType | null>>;
    setActiveChatId: Dispatch<SetStateAction<number | null>>;
    sendMessage: (chatId: number | string, message: MessageType) => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string>>;
}

// Create the context
export const ChatContext = createContext<ChatContextProps>({
    chatData: [],
    chatContent: [],
    chatSearch: '',
    selectedChat: null,
    loading: true,
    error: '',
    activeChatId: null,
    setChatContent: () => { },
    setChatSearch: () => { },
    setSelectedChat: () => { },
    setActiveChatId: () => { },
    sendMessage: () => { },
    setLoading: () => { },
    setError: () => { },
});

// Create the provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chatData, setChatData] = useState<ChatsType[]>([]);
    const [chatContent, setChatContent] = useState<any[]>([]);
    const [chatSearch, setChatSearch] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<ChatsType | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

   

    // Fetch chat data from the API
useEffect(() => {
  if (ChatData) {
    setChatData(ChatData);

    if (!selectedChat && ChatData.length > 0) {
      setSelectedChat(ChatData[0]);
    }

    setLoading(false);
  }
}, []);

    // Function to send a message to a chat identified by `chatId` using an API call.
    // const sendMessage = async (chatId: number | string, message: MessageType) => {
        // try {
        //     let { data } = await mutate(postFetcher('/api/sendMessage', { chatId, message }));
        //     let chat = data.find((chat: any) => chat.id === chatId)
        //     setSelectedChat(chat);
        // } catch (error) {
        //     console.error('Error sending message:', error);
        // }
    // };

    const value: ChatContextProps = {
        chatData,
        chatContent,
        chatSearch,
        selectedChat,
        loading,
        error,
        activeChatId,
        setChatContent,
        setChatSearch,
        setSelectedChat,
        setActiveChatId,
        // sendMessage,
        setError,
        setLoading,
    };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};


