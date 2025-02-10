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
import { useAuth } from './context/AdminAuthProvider';
import ChatAdmin from '@components/Chat/ChatAdmin';

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

function Admin() {
  const initialiseNewChat = useInitialiseNewAdminChat();
  const addAdminChat = useAddAdminChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const chats = useStore.getState().chats;
  const currentChatIndex = useStore.getState().currentChatIndex;
  const {user, adminId} = useAuth();
  

  useEffect(() => {
    const func = async () => {
      const { threadsData, threadsError } = await fetchConversationsFromSupabase(user, adminId);
  
      threadsData?.forEach((thread, index) => {
        // If `some` returns true, it means a match is found, and `addAdminChat` won't be called.
        const exists = chats?.some((chat) => {
          return chat.id === thread.id; // Exits early if condition is met
        });
  
        if (exists == undefined || !exists) {
          addAdminChat(thread.id, thread.title);
          thread.messages.forEach((message) => {
            chats && chats[index].messages.push({
              role: message.role,
              content: message.content,
            });
          })
         
        }
      });
    };
  
    if (user) func();
  }, [user]);

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
      <ChatAdmin />
      {/* <ApiPopup /> */}
      <Toast />
    </div>
  );
}

export default Admin;
