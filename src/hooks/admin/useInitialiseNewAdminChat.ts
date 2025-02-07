import React from 'react';
import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { generateDefaultAdminChat, generateDefaultChat } from '@constants/chat';

const useInitialiseNewAdminChat = () => {
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);

  const initialiseNewAdminChat = (id: string, title: string) => {
    setChats([generateDefaultAdminChat(id, title)]);
    setCurrentChatIndex(0);
  };

  return initialiseNewAdminChat;
};

export default useInitialiseNewAdminChat;