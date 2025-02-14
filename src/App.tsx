import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router";

import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';
import Menu1 from '@components/Menu/MenuAdmin';

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
// import { useAuth } from './context/UserAuthProvider';
import { useAuth } from './context/AuthProvider';
import { Loader2 } from 'lucide-react';
import updateChats from '@utils/updateChats';
import Skeleton from '@components/Skeleton';
import useUpdateChats from '@utils/updateChats';

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

function  AppChild() {
  
  const initialiseNewChat = useInitialiseNewChat();
  const updateChats = useUpdateChats();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const addAdminChat = useAddAdminChat();
  const chats = useStore.getState().chats;
  const currentChatIndex = useStore.getState().currentChatIndex;
  const [loading, setLoading] = useState<boolean>(true);

  const {user, adminId} = useAuth();
  
  useEffect(() => {
    console.log('reaching')
    const func = async () => {
      setLoading(true)
      console.log('raught')
      const { threadsData, threadsError } = await fetchConversationsFromSupabase(user, adminId);
      console.log(threadsData)
      if(threadsData == undefined || threadsData.length < 1 || threadsError){
        initialiseNewChat();
        setLoading(false)
        return;
      }
  
      threadsData.forEach(async (thread) => {
        // If `some` returns true, it means a match is found, and `addAdminChat` won't be called.
        const exists = chats?.some((chat) => {
          return chat.id === thread.id; // Exits early if condition is met
        });
        if (exists == undefined || !exists) {
          await addAdminChat(thread);
        }
        else{
            const response = updateChats(thread);
          }
      });
      setLoading(false)
    };
  
    if (user) func();
  },[]);
  

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
    <div className='overflow-hidden w-full h-full relative '>
      <Menu loading={loading} />
      <Chat loading={loading} />
      {/* <ApiPopup /> */}
      <Toast />
    </div>
  );
}

function App() {
  return (
      <Suspense fallback={
        <Skeleton /> 
      }>
        <AppChild />
      </Suspense>
  );
}

export default App;
