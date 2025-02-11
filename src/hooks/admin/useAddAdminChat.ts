import React from 'react';
import useStore from '@store/store';
import { generateDefaultAdminChat } from '@constants/chat';
import { ChatInterface } from '@type/chat';
import useInitialiseNewAdminChat from './useInitialiseNewAdminChat';
import { SupabaseThread, ThreadMessage } from '@type/supabase';

const useAddAdminChat = () => {
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex)
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const initialiseNewAdminChat = useInitialiseNewAdminChat();

  const addAdminChat =  async (thread: SupabaseThread, folder?:string,) => {
    const chats = useStore.getState().chats;
    const realChat = chats
    
      if(chats){
        const obj = generateDefaultAdminChat(thread.id, thread.title, folder)
        const sortedMessages = thread.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        sortedMessages.forEach((message : ThreadMessage) => {
          obj.messages.push({
            role: message.role,
            content: message.content,
            attachments: message.attachments
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
