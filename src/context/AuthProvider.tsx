import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase";
import { fetchUserFromProfiles } from "@utils/auth";
import Skeleton from "@components/Skeleton";
import { Profile } from "@type/supabase";
import useStore from "@store/store"; // <-- import the Zustand store

interface AuthContextType {
  login: (email: string, password: string, adminEmail: string) => Promise<any>;
  signUp: (email: string, password: string, adminEmail: string) => Promise<any>; // Add this line
  signOut: () => Promise<void>;
  user: Profile | null;
  loading: boolean;
  admin: Profile | null;
  adminId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [user, setUser] = useState<Profile | null>(null);
  const [admin, setAdmin] = useState<Profile | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Pull setAdminId from Zustand store
  const setAdminIdState = useStore((state) => state.setAdminIdState);

  // Store adminId in localStorage
  const storeAdminId = (id: string | null) => {
    setAdminId(id);
    setAdminIdState(id || "");
    if (id) {
      localStorage.setItem("adminId", id);
    } else {
      localStorage.removeItem("adminId");
    }
  };

  const login = async (email: string, password: string, adminEmail: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { fetchedProfile } = await fetchUserFromProfiles(email);
      setUser(fetchedProfile ?? null);

      // Fetch admin
      const { fetchedProfile: fetchedAdmin } = await fetchUserFromProfiles(adminEmail);
      setAdmin(fetchedAdmin ?? null);

      const fetchedAdminId = fetchedAdmin?.id ?? null;
      storeAdminId(fetchedAdminId);

      return fetchedProfile;
    } catch (err) {
      console.error("Authentication error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    console.log('reach')
    setLoading(true);
    try {
      // Sign up the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      },
    );
      console.log(data)
      
      if (error) throw error;

      if (data.user) {
        // Fetch the automatically created profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        // Set the user state
        setUser(profileData);

        return profileData;
      }
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdmin(null);
    storeAdminId(null);
  };

  // Check existing session on mount + pull adminId from localStorage
  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        // If adminId is in localStorage, set it
        const storedAdminId = localStorage.getItem("adminId");
        if (storedAdminId) {
          storeAdminId(storedAdminId);
          // Optionally fetch the admin by ID or email if needed
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const { fetchedProfile } = await fetchUserFromProfiles(session.user.email);
          setUser(fetchedProfile ?? null);

          if (fetchedProfile?.adminEmail) {
            const { fetchedProfile: fetchedAdmin } = await fetchUserFromProfiles(fetchedProfile.adminEmail);
            setAdmin(fetchedAdmin ?? null);
            // If needed, overwrite stored adminId from the user’s record:
            storeAdminId(fetchedAdmin?.id ?? null);
          }
        }
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      login, 
      signUp, // Add this line
      signOut, 
      user, 
      loading, 
      admin, 
      adminId 
    }}>
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
};