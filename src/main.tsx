import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import App from './App';
import Admin from './Admin';
import PersonaBuilderPage from './PersonaBuilderPage';
import Skeleton from '@components/Skeleton';
import {
  AuthProvider,
  useAuth,
} from './context/AuthProvider';
import './main.css';
import './i18n';
import LoginPage from '@components/Login';
import SignupPage from '@components/SignUp';

await import('katex/dist/katex.min.css');

const UserProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <Skeleton />;
  }

  if (!user || user.role !== 'user') {
    signOut();
    return <Navigate to='/login' replace />;
  }
return (
  <>
    {children}
  </>
  );
};

const AdminProtectedRoute = ({ children }: { children: React.ReactNode}) => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <Skeleton />;
  }

  if (!user || user.role !== 'admin') {
    signOut();
    return <Navigate to='/login' replace />;
  }
return (
  <>
    {children}
  </>
)

};

// Route configurations
const AppRoutes = () => (
  <Routes>
    {/* Auth Routes */}
    <Route path="/signup" element={
      <AuthProvider>
        <SignupPage />
      </AuthProvider>

    } />

    <Route path="/login" element={
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    } /> 
    
    {/* User routes */}
    <Route
      path='/'
      element={
        <AuthProvider>
          <UserProtectedRoute>
              <App />
          </UserProtectedRoute>
        </AuthProvider>
      }
    />

    {/* Admin routes */}
    <Route
      path='/admin'
      element={
        <AuthProvider>
        <AdminProtectedRoute>
              <Admin />
          </AdminProtectedRoute>
        </AuthProvider>
      }
    />
    <Route
      path='/admin/manage-persona'
      element={
        <AuthProvider>
          <AdminProtectedRoute>
              <PersonaBuilderPage />
          </AdminProtectedRoute>
          </AuthProvider>
      }
    />

    {/* Fallback route */}
    <Route path='*' element={<Navigate to='/' replace />} />
  </Routes>
);

// Ensure this is the only time you call createRoot for #root:
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <Suspense fallback={<Skeleton />}>
      <AppRoutes />
    </Suspense>
  </BrowserRouter>
);
