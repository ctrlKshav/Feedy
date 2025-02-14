import React, { useState , useEffect } from 'react';
import { BrowserRouter } from "react-router";

import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu1 from '@components/Menu/MenuAdmin';

import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';
import supabase from '@utils/supabase';
import { authLoader, fetchUserId } from '@utils/auth';
import { fetchConversationsFromSupabase } from '@utils/supabaseOperations';
import useInitialiseNewAdminChat from '@hooks/admin/useInitialiseNewAdminChat';
import useAddAdminChat from '@hooks/admin/useAddAdminChat';
import { useAuth } from './context/AdminAuthProvider';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ChatAdmin from '@components/Chat/ChatAdmin';
import Skeleton from '@components/Skeleton';
import MenuAdmin from '@components/Menu/MenuAdmin';
import useUpdateChats from '@utils/updateChats';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

function AdminChild() {

  const initialiseNewChat = useInitialiseNewChat();
  const addAdminChat = useAddAdminChat();
  const updateChats = useUpdateChats();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const chats = useStore.getState().chats;
  const currentChatIndex = useStore.getState().currentChatIndex;
  const {user, adminId} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  

  useEffect(() => {
    const func = async () => {
      setLoading(true)
      const { threadsData, threadsError } = await fetchConversationsFromSupabase(user, adminId);

      if(threadsData == undefined || threadsData.length < 1 || threadsError){
        console.log('hello')
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
      <MenuAdmin loading={loading} />
      <ChatAdmin />
      {/* <ApiPopup /> */}
      <Toast />
    </div>
  );
}

function Admin() {
  return (
      <Suspense fallback={
        <Skeleton />
      }>
        <AdminChild />
      </Suspense>
  );
}

export default Admin;
