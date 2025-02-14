import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Admin from './Admin';
import './main.css';
await import('katex/dist/katex.min.css');

import './i18n';
import { BrowserRouter, Routes, Route } from 'react-router';
import Skeleton from '@components/Skeleton';
import PersonnaBuilderPage from './PersonaBuilderPage';
import { UserAuthProvider } from './context/AuthProvider';
import { AdminAuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <UserAuthProvider>
              <App />
            </UserAuthProvider>
          } hydrateFallbackElement={<Skeleton />} />

          <Route path='/admin' element={
            <AdminAuthProvider>
              <Admin />
            </AdminAuthProvider>
          } hydrateFallbackElement={<Skeleton />} />
          
          <Route path='/admin/manage-persona' element={<PersonnaBuilderPage />} hydrateFallbackElement={<Skeleton />} />
        </Routes>
    </BrowserRouter>
  </>
);
