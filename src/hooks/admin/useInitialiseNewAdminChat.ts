import React from 'react';
import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { generateDefaultAdminChat, generateDefaultChat } from '@constants/chat';

const useInitialiseNewAdminChat = () => {
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore.getState().currentChatIndex;
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const chats = useStore.getState().chats;

  const initialiseNewAdminChat = (thread: any) => {
    const obj = generateDefaultAdminChat(thread.id, thread.title);
    thread.messages.forEach((message : any) => {
      obj.messages.push({
        role: message.role,
        content: message.content,
      });
    })
    
    setChats([obj]) ;
    setCurrentChatIndex(0);
  };

  return initialiseNewAdminChat;
};

export default useInitialiseNewAdminChat;