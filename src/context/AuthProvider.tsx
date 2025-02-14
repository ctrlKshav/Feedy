import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase";
import { User } from "@supabase/supabase-js";
import { fetchUserFromProfiles } from "@utils/auth";
import Skeleton from "@components/Skeleton";

// Extend the Supabase User with optional fields (e.g., persona).
interface ExtendedUser extends User {
  persona?: string;
}

// AuthContext interface with simplified fields
interface AuthContextType {
  login: (email: string, password: string, adminEmail: string) => Promise<any>;
  signOut: () => Promise<void>;
  user: ExtendedUser | null;
  loading: boolean;
  admin: ExtendedUser | null; // <--- new field for the other person's profile
  adminId: string | null;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [admin, setAdmin] = useState<ExtendedUser | null>(null); // <--- new state
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Updated login function to accept adminEmail
  const login = async (email: string, password: string, adminEmail: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { fetchedProfile } = await fetchUserFromProfiles(email);
      setUser(fetchedProfile ?? null);

      // Fetch the other person's (admin) profile
      const { fetchedProfile: fetchedAdmin } = await fetchUserFromProfiles(adminEmail);
      setAdmin(fetchedAdmin ?? null);
      const adminId = fetchedAdmin?.id ?? null;
      setAdminId(adminId);
      return fetchedProfile;

    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
    
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Check existing session on mount
  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { fetchedProfile } = await fetchUserFromProfiles(session.user.email ?? "");
          setUser(fetchedProfile ?? null);
        }
        
      } catch (error) {
        console.error("Session error:", error);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ login, signOut, user, loading, admin, adminId }}>
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
};