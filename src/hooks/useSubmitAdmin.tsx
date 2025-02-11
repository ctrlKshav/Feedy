// useSubmitAdmin.ts
import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { Attachment, ChatInterface } from '@type/chat';
import { uploadImages, getImageAnalysis } from '@api/api';
import { saveConversationToSupabase, updateUserAttachments } from '@utils/supabaseOperations';

const useSubmitAdmin = () => {
  const { t } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);



  const handleSubmit = async (messageId: string, images: File[], question: string) => {
    if (generating) return;
    setGenerating(true);

    try {
      
      const uploadResponse = await uploadImages(images);
      if (uploadResponse.status !== 'success') {
          throw new Error('Failed to upload images');
      }
      const uploadedImages = uploadResponse.images

      const uploadedAttachments: Attachment[] = uploadedImages.map((image) => {
          return {
          url: image.image_url,
          name: image.image_name,
          type: 'image'
          }
      })
      
      const updateResponse = updateUserAttachments(messageId, uploadedAttachments);

    } catch (e: unknown) {
      const err = (e as Error).message;
      console.log(err);
      setError(err);
    }
    setGenerating(false);
  };

  return { handleSubmit, error };
};

export default useSubmitAdmin;