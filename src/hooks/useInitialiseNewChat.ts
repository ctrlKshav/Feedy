import React from 'react';
import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { generateDefaultChat } from '@constants/chat';

const useInitialiseNewChat = () => {
  const chats = useStore((state) => state.chats);
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const initialiseNewChat = () => {
    setChats([generateDefaultChat()]);
    setCurrentChatIndex(0);
    console.log(chats)
  };

  return initialiseNewChat;
};

export default useInitialiseNewChat;
