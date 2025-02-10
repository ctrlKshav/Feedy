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
    console.log(thread)
    thread.messages.forEach((message : any) => {
      obj.messages.push({
        role: message.role,
        content: message.content,
      });
    })
    
    console.log(obj)
    setChats([obj]) ;
    setCurrentChatIndex(0);
    console.log(chats)
    console.log(currentChatIndex)
  };

  return initialiseNewAdminChat;
};

export default useInitialiseNewAdminChat;