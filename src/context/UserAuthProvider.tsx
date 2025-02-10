import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase";
import { User } from "@supabase/supabase-js";
import { fetchUserFromProfiles, fetchUserId } from "@utils/auth";
import App from "@src/App";
import Skeleton from "@components/Skeleton";

// Define the type for the context
interface UserAuthContextType {
  user: User | null;
  adminId: string | null;
}

// Create context with an undefined default to ensure it's not used outside the provider
const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// Custom hook to use the context safely
export const useAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserAuthProvider");
  }
  return context;
};

// Login & signout functions
const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

const signOut = () => supabase.auth.signOut();

const UserAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data } = await login("user@gmail.com", "realuser");
      const { fetchedProfile: currentUser } = await fetchUserFromProfiles("user@gmail.com");
      const { fetchedData } = await fetchUserId("admin@gmail.com");

      setUser(currentUser ?? null);
      setAdminId(fetchedData?.id ?? null);
      setLoading(false);
    };
    getUser();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        adminId,
      }}>
      {loading ? <Skeleton /> : <App />}
    </UserAuthContext.Provider>
  );
};

export default UserAuthProvider;
