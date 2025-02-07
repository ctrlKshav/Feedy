import React, { useState , useEffect } from 'react';
import { BrowserRouter } from "react-router";

import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu1 from '@components/Menu/Menu1';

import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';
import supabase from '@utils/supabase';
import { authLoader, fetchUserId } from '@utils/auth';
import { fetchConversationsFromSupabase } from '@utils/supabaseOperations';
import useInitialiseNewAdminChat from '@hooks/admin/useInitialiseNewAdminChat';
import useAddAdminChat from '@hooks/admin/useAddAdminChat';
import { useAuth } from './context/AuthProvider';

const loader = async () => {
  const {authData, authError} = await authLoader("admin@gmail.com", "realadmin");
  const {fetchedData, fetchError} = await fetchUserId("user@gmail.com");
  return { authData, fetchedData };
};

function Admin() {
  const initialiseNewChat = useInitialiseNewAdminChat();
  const addAdminChat = useAddAdminChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const {user, adminId} = useAuth();

  // const [authData, setAuthData] = useState({})
  // const [fetchedData, setFetchedData] = useState<null | {}>({})

  useEffect(() => {
    const func = async () => {
      // setAuthData(authData)
      // setFetchedData(fetchedData)
      const {threadsData, threadsError} = await fetchConversationsFromSupabase(user, adminId);    
      threadsData?.map((thread) => {
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
  
  })


  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu1 />
      <Chat />
      {/* <ApiPopup /> */}
      <Toast />
    </div>
  );
}

export default Admin;
