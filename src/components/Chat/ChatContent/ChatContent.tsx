import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';
import ScrollToBottomButton from './ScrollToBottomButton';
import Message from './Message';
import InputMessage from './Message/InputMessage';
import useSubmit from '@hooks/useSubmit';
import { ExamplePromptsComponent } from '@components/ExamplePrompts';

const ChatContent = () => {
  const inputRole = useStore((state) => state.inputRole);
  const setError = useStore((state) => state.setError);
  const messages = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const stickyIndex = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const advancedMode = false;
  const generating = useStore.getState().generating;
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const saveRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = messages.some((message) => message.role === 'user');
  const hasAdminMessages = messages.some((message) => message.role === 'admin');

  // NEW: Add state for input message
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating, inputMessage]);

  const { error } = useSubmit();

  return (
    <div className='flex-1 flex flex-col h-full relative'>
      <div className='flex-1 overflow-y-auto'>
        <ScrollToBottom className='h-full dark:bg-gray-800' followButtonClassName='hidden'>
          <ScrollToBottomButton />
          <div className='flex flex-col items-center text-sm dark:bg-gray-800 min-h-full'>
            <div className='flex flex-col items-center text-sm dark:bg-gray-800 w-full' ref={saveRef}>
              {messages?.map((message, index) => (
                (advancedMode || index !== 0 || message.role !== 'system') && (
                  <React.Fragment key={index}>
                    <Message role={message.role} content={message.content} messageIndex={index} />
                  </React.Fragment>
                )
              ))}
            </div>
            {!hasUserMessages && !hasAdminMessages && (
              <div className="w-full">
                <ExamplePromptsComponent setInputMessage={setInputMessage} role={'user'} />
              </div>
            )}
          </div>
        </ScrollToBottom>
      </div>
      <div className='w-full dark:bg-gray-800'>
        <InputMessage role={inputRole} content={inputMessage} messageIndex={stickyIndex} />
      </div>
    </div>
  );
};

export default ChatContent;
