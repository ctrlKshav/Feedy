import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase";
import { User } from "@supabase/supabase-js";
import { fetchUserFromProfiles, fetchUserId } from "@utils/auth";
import Admin from "@src/Admin";
import Skeleton from "@components/Skeleton";

// Define the context type
interface AdminAuthContextType {
  user: User | null;
  adminId: string | null;
}

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Custom hook to use the context safely
export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AdminAuthProvider");
  }
  return context;
};

// Login & signout functions
const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

const signOut = () => supabase.auth.signOut();

const AdminAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await login("admin@gmail.com", "realadmin");
      const { fetchedProfile: currentUser } = await fetchUserFromProfiles("admin@gmail.com");
      const { fetchedData } = await fetchUserId("user@gmail.com");

      setUser(currentUser ?? null);
      setAdminId(fetchedData?.id ?? null);
      setLoading(false);
    };
    getUser();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, adminId }}>
      {loading ? <Skeleton /> : <Admin />}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
