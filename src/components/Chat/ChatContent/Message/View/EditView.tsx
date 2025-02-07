import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import useSubmit from '@hooks/useSubmit';

import { Attachment, ChatInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import { Send, Paperclip } from 'lucide-react';
import StopGeneratingButton from '@components/StopGeneratingButton/StopGeneratingButton';

import { saveConversationToSupabase } from '@utils/supabaseOperations';
import { authLoader, fetchAdminID } from '@utils/auth';

const loader = async () => {
  const authData = await authLoader();
  const adminData = await fetchAdminID("admin@gmail.com");
  return { authData, adminData };
};

const EditView = ({
  content,
  setIsEdit,
  messageIndex,
  sticky,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const setGenerating = useStore((state) => state.setGenerating);

  const loadData = loader();

  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const [attachments, setAttachments] = useState<File[]>([]);

  const generating = useStore((state) => state.generating);

  const { t } = useTranslation();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      const enterToSubmit = useStore.getState().enterToSubmit;

      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleGenerate();
        resetTextAreaHeight();
      } else if (
        (enterToSubmit && !e.shiftKey) ||
        (!enterToSubmit && (e.ctrlKey || e.shiftKey))
      ) {
        if (sticky) {
          e.preventDefault();
          handleGenerate();
          resetTextAreaHeight();
        }
      }
    }
  };

  const { handleSubmit } = useSubmit();
  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const handleGenerate = async () => {

    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    
    console.log("1")
    const supabaseResponse = saveConversationToSupabase(_content, attachments , (await loadData),
      inputRole, updatedChats, currentChatIndex
  )
    console.log(supabaseResponse)
    console.log("2")
    
    
    const updatedMessages = updatedChats[currentChatIndex].messages;
    
    if (sticky) {
      if (_content !== '' || attachments.length > 0) {
        updatedMessages.push({
          role: inputRole,
          content: _content,
          attachments: attachments.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          }))
        });
      }
      _setContent('');
      setAttachments([]);
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      updatedMessages[messageIndex].attachments = attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleSubmit(attachments[0], _content);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <div
        className={`w-full ${
          sticky
            ? 'py-2 md:py-3 px-2 md:px-4 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
            : ''
        }`}
      >
        <div className='flex items-center gap-2'>
          <div className="flex gap-2">
            <label className="flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
              <Paperclip className="w-5 h-5 text-white/80" />
              <input
                type="file"
                multiple
                onChange={handleAttachment}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
            </label>
          </div>
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full placeholder:text-gray-500/40'
              onChange={(e) => {
                _setContent(e.target.value);
              }}
              value={_content}
              placeholder={t('submitPlaceholder') as string}
              onKeyDown={handleKeyDown}
              rows={1}
            ></textarea>
            {attachments.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {attachments.map((file, index) => (
                  <div key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {file.name}
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {generating ? (
            <StopGeneratingButton />
          ) : (
            <button
            onClick={handleGenerate}
            className='flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50'
            disabled={useStore.getState().generating || _content === ''}
          >
            <Send className='w-5 h-5' />
          </button>
          )}

          
        </div>
      </div>
      
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearMessageWarning') as string}
          handleConfirm={handleGenerate}
        />
      )}
    </>
  );
};

export default EditView;
