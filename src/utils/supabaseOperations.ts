import { User } from "@supabase/supabase-js";
import supabase from "./supabase";

import { ChatInterface } from "@type/chat";

export const saveConversationToSupabase = async (user:User,adminId: string, content : string, attachments : File[] 
    , inputRole: string, updatedChats: ChatInterface[], currentChatIndex: number
) => {

    const threadResponse = await supabase
      .from('threads')
      .upsert({
        id: updatedChats[currentChatIndex].id,
        title: updatedChats[currentChatIndex].title,
        user_id: user?.id,
        admin_id: adminId
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

export const fetchConversationsFromSupabase = async (user:User, adminId: string ) => {
  
  const { data: threadsData, error: threadsError } = await supabase
  .from('threads')
  .select(`
    id,
    title,
    user_id,
    messages (
      id,
      content,
      created_at,
      user_id,
      admin_id,
      role,
      thread_id
    )
  `)
  .eq('admin_id', user?.id);

  console.log(threadsData)
  return {threadsData, threadsError}

}