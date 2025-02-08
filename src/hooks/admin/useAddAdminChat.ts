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
    console.log("Behaviour")
    console.log(realChat)
    
    console.log(currentChatIndex)
      if(chats){
        const obj = generateDefaultAdminChat(thread.id, thread.title, folder)
        console.log("haha")
        thread.messages.forEach((message : any) => {
          obj.messages.push({
            role: message.role,
            content: message.content,
          });
        })
        console.log("pushing p")
        chats.unshift(obj);
        setChats(chats);
        setCurrentChatIndex(currentChatIndex+1);
      }
      else{
        console.log("tf")
         initialiseNewAdminChat(thread)
        console.log("why?")
      }
      
  };

  return addAdminChat;
};

export default useAddAdminChat;
