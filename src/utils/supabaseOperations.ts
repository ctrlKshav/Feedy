import { SupabaseThread } from "@type/supabase";
import { User } from "@supabase/supabase-js";
import supabase from "./supabase";
import { Attachment, ChatInterface } from "@type/chat";

export const saveConversationToSupabase = async (user:User | null,adminId: string | null, content : string, 
   inputRole: string, updatedChats: ChatInterface[], currentChatIndex: number, attachments?: Attachment[]
) => {

  if(user?.role === "user"){
  const threadResponse = await supabase
    .from('threads')
    .upsert({
      id: updatedChats[currentChatIndex].id,
      title: updatedChats[currentChatIndex].title,
      user_id: user?.id,
      admin_id: adminId
    })
    .select();

  const messageResponse = await supabase
    .from('messages')
    .insert({
      thread_id: updatedChats[currentChatIndex].id,
      role: inputRole,
      content: content,
      attachments: attachments ? attachments : null,
    })
    .select();

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
    })
    .select();

  const messageResponse = await supabase
    .from('messages')
    .insert({
      thread_id: updatedChats[currentChatIndex].id,
      role: inputRole,
      content: content,
      attachments: attachments ? attachments : null,
    })
    .select('id')

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
      updated_at,
      messages (
        id,
        role,
        content,
        attachments,
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

export const updateUserAttachments = async (
  messageId: string,
  attachments: Attachment[]
) => {
  
  return await supabase
    .from('messages')
    .update({
      attachments: attachments  // Explicitly set attachments to null for user messages
    })
    .eq('id', messageId);
};
