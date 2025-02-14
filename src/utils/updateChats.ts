import React from 'react'
import { SupabaseThread, ThreadMessage} from '@type/supabase';
import useStore from '@store/store';
import { generateDefaultAdminChat } from '@constants/chat';


const useUpdateChats = () => {
    // const setMessages = useStore((state) => state.setMessages);
    const chats = useStore.getState().chats;
    const setChats = useStore((state) => state.setChats);

    const updateChats = (thread: SupabaseThread) => {
        console.log('reach')
        
    
        const obj = generateDefaultAdminChat(thread.id, thread.title)
    
        const sortedMessages = thread.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                sortedMessages.forEach((message : ThreadMessage) => {
                  obj.messages.push({
                    role: message.role,
                    content: message.content,
                    attachments: message.attachments
                  });
                })
        console.log("real1")
        console.log(chats)
        console.log("real2")
        const currentChatIndex = chats?.findIndex((chat) => chat.id === thread.id);
        const updatedChats = chats?.splice(currentChatIndex ?? -1 , 1, obj);
        console.log(chats)
        setChats(chats ?? [])
        
    }

  return updateChats;
};

export default useUpdateChats;
