// useSubmit.ts
import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { Attachment, ChatInterface } from '@type/chat';
import { uploadImages, getImageAnalysis } from '@api/api';
import { saveConversationToSupabase, updateUserAttachments } from '@utils/supabaseOperations';
import { useAuth } from '@src/context/UserAuthProvider';

const useSubmit = () => {
  const { t } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const setChats = useStore((state) => state.setChats);
  const inputRole = useStore((state) => state.inputRole);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const {user,adminId} = useAuth();



  const handleSubmit = async (messageId: string, images: File[], question: string) => {
    if (generating) return;
    setGenerating(true);

    try {
      
      const uploadResponse = await uploadImages(images);
      if (uploadResponse.status !== 'success') {
        throw new Error('Failed to upload images');
      }

      // Then get the analysis using the uploaded image URLs
      const analyses = await getImageAnalysis(uploadResponse.images, question);
      
      // Update the chat with the assistant's response
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      let netResponse = ``;
      

      const attachments = analyses.map((analysis) => {
        
        const cleanResponse = analysis.response.replace(/```/g, '').trim();
        
        netResponse += `\n**Image: ${analysis.image_name}**\n${cleanResponse}\n`;

        
        return {
          url: analysis.image_url,
          name: analysis.image_name,
          type: "image"
        }

      })

        // Add assistant's response
      updatedChats[currentChatIndex].messages.push({
        role: 'assistant',
        content: netResponse,
        attachments: attachments,
      });

      const updateResponse = updateUserAttachments(messageId, attachments);

      const supabaseResponse = saveConversationToSupabase(
        user,
        adminId,
        netResponse,
        "assistant",
        updatedChats,
        currentChatIndex,
        attachments,
      );    
      
      setChats(updatedChats);
    } catch (e: unknown) {
      const err = (e as Error).message;
      console.log(err);
      setError(err);
    }
    setGenerating(false);
  };

  return { handleSubmit, error };
};

export default useSubmit;