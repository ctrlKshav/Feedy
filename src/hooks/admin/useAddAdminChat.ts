import React from 'react';
import useStore from '@store/store';
import { generateDefaultAdminChat } from '@constants/chat';
import { ChatInterface } from '@type/chat';

const useAddAdminChat = () => {
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const addAdminChat = (id: string, title: string, folder?:string) => {
    const chats = useStore.getState().chats;
      if(chats){
        chats.unshift(generateDefaultAdminChat(id, title, folder));
        setChats(chats);
        setCurrentChatIndex(0);
      }
      
  };

  return addAdminChat;
};

export default useAddAdminChat;
