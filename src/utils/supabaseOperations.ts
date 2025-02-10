import { SupabaseThread } from "@type/supabase";
import { User } from "@supabase/supabase-js";
import supabase from "./supabase";
import { ChatInterface } from "@type/chat";

export const saveConversationToSupabase = async (user:User | null,adminId: string | null, content : string, attachments : File[] 
  , inputRole: string, updatedChats: ChatInterface[], currentChatIndex: number
) => {

  if(user?.role === "user"){
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
  else {
    const threadResponse = await supabase
    .from('threads')
    .upsert({
      id: updatedChats[currentChatIndex].id,
      title: updatedChats[currentChatIndex].title,
      admin_id: user?.id,
      user_id: adminId
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

}

export const fetchConversationsFromSupabase = async (
  user: User | null,
  adminId: string | null
): Promise<{ threadsData: SupabaseThread[] | null; threadsError: any }> => {
  if (!user) return { threadsData: null, threadsError: "User not found" };

  const query = supabase
    .from("threads")
    .select(
      `
      id,
      title,
      admin_id,
      user_id,
      created_at,
      messages (
        id,
        role,
        content,
        created_at,
        user_id,
        admin_id,
        thread_id
      )
    `
    );

  const { data: threadsData, error: threadsError } =
    user?.role === "admin"
      ? await query.eq("admin_id", user.id)
      : await query.eq("user_id", user.id);

  return { threadsData: threadsData as SupabaseThread[] | null, threadsError };
};
