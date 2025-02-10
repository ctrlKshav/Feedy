import React from 'react';
import useStore from '@store/store';
import { generateDefaultAdminChat } from '@constants/chat';
import { ChatInterface } from '@type/chat';
import useInitialiseNewAdminChat from './useInitialiseNewAdminChat';

const useAddAdminChat = () => {
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex)
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const initialiseNewAdminChat = useInitialiseNewAdminChat();

  const addAdminChat =  async (thread: any, folder?:string,) => {
    const chats = useStore.getState().chats;
    const realChat = chats
    
      if(chats){
        const obj = generateDefaultAdminChat(thread.id, thread.title, folder)
        thread.messages.forEach((message : any) => {
          obj.messages.push({
            role: message.role,
            content: message.content,
          });
        })
        chats.unshift(obj);
        setChats(chats);
        setCurrentChatIndex(currentChatIndex+1);
      }
      else{
         initialiseNewAdminChat(thread)
      }
      
  };

  return addAdminChat;
};

export default useAddAdminChat;
