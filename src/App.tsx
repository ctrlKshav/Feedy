import React, { useEffect } from 'react';
import { BrowserRouter } from "react-router";

import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';
import Menu1 from '@components/Menu/Menu1';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';
import { fetchConversationsFromSupabase } from '@utils/supabaseOperations';

import useInitialiseNewAdminChat from '@hooks/admin/useInitialiseNewAdminChat';
import useAddAdminChat from '@hooks/admin/useAddAdminChat';
import supabase from '@utils/supabase';
import { fetchUserId } from '@utils/auth';
import { useAuth } from './context/UserAuthProvider';

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

function App() {
  const initialiseNewChat = useInitialiseNewChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const addAdminChat = useAddAdminChat();
  const chats = useStore.getState().chats;
  const currentChatIndex = useStore.getState().currentChatIndex;

  const {user, adminId} = useAuth();
  
  useEffect(() => {
    const func = async () => {

      const {threadsData, threadsError} = await fetchConversationsFromSupabase(user, adminId);    
      threadsData?.map((thread) => {
        chats?.forEach((chat) => {
          if(chat.id === thread.id)
            return
        })
        addAdminChat(thread.id, thread.title)
        
      })
    }
    func();
  }, []);
  
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() => {
    // legacy local storage
    const oldChats = localStorage.getItem('chats');
    const apiKey = localStorage.getItem('apiKey');
    const theme = localStorage.getItem('theme');

    if (apiKey) {
      // legacy local storage
      setApiKey(apiKey);
      localStorage.removeItem('apiKey');
    }

    if (theme) {
      // legacy local storage
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }
  }, []);

  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      {/* <ApiPopup /> */}
      <Toast />
    </div>
  );
}

export default App;
