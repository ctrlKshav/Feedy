import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Admin from './Admin';
import './main.css';
await import('katex/dist/katex.min.css');

import './i18n';
import { BrowserRouter, Routes, Route } from 'react-router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
    </BrowserRouter>
  </>
);
