import { authLoader, fetchAdminID } from "@utils/auth";
import supabase from "./supabase";

import useStore from "@store/store";

import { ChatInterface } from "@type/chat";

export const saveConversationToSupabase = async (content : string, attachments : File[] , loadData: any
    , inputRole: string, updatedChats: ChatInterface[], currentChatIndex: number
) => {

    const { authData, adminData } = loadData;
          
    const threadResponse = await supabase
      .from('threads')
      .upsert({
        id: updatedChats[currentChatIndex].id,
        title: updatedChats[currentChatIndex].title,
        user_id: authData.userData.user?.id,
        admin_id: adminData.adminData?.id
      });

    const messageResponse = await supabase
      .from('messages')
      .upsert({
        thread_id: updatedChats[currentChatIndex].id,
        role: inputRole,
        content: content,
      })

      return { threadResponse, messageResponse };

}