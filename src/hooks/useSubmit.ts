// useSubmit.ts
import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '@type/chat';
import { getImageAnalysis } from '@api/api';

const useSubmit = () => {
  const { t } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);

  const handleSubmit = async (imageFile: File, question: string) => {
    if (generating) return;
    setGenerating(true);

    try {
      // Get the analysis from the backend
      const analysis = await getImageAnalysis(imageFile, question);
      
      // Update the chat with the assistant's response
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      
      // Add assistant's response
      updatedChats[currentChatIndex].messages.push({
        role: 'assistant',
        content: analysis.response,
      });
      
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