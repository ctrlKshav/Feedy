import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase";
import { User } from "@supabase/supabase-js";
import { fetchUserFromProfiles, fetchUserId } from "@utils/auth";
import Skeleton from "@components/Skeleton";

// Define interface for Admin type
interface Admin extends User {
  persona: string;
}

// Define the unified context type
interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  adminId: string | null;
  loading: boolean;
  authMode: 'user' | 'admin';
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the context safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Login & signout functions
const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });
const signOut = () => supabase.auth.signOut();

interface AuthProviderProps {
  children: ReactNode;
  mode: 'user' | 'admin';
}

export const AuthProvider = ({ children, mode }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAuth = async () => {
      setLoading(true);
      try {
        if (mode === 'admin') {
          const { data } = await login("admin@gmail.com", "realadmin");
          const { fetchedProfile: currentUser } = await fetchUserFromProfiles("admin@gmail.com");
          const { fetchedData } = await fetchUserId("user@gmail.com");
          setUser(currentUser ?? null);
          setAdminId(fetchedData?.id ?? null);
        } else {
          const { data } = await login("user@gmail.com", "realuser");
          const { fetchedProfile: currentUser } = await fetchUserFromProfiles("user@gmail.com");
          const { fetchedProfile: fetchedAdmin } = await fetchUserFromProfiles("admin@gmail.com");
          setUser(currentUser ?? null);
          setAdmin(fetchedAdmin ?? null);
          setAdminId(fetchedAdmin?.id ?? null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    getAuth();
  }, [mode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        adminId,
        loading,
        authMode: mode
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
};

// Example usage for Admin component
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthProvider mode="admin">
    {children}
  </AuthProvider>
);

// Example usage for User component
export const UserAuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthProvider mode="user">
    {children}
  </AuthProvider>
);