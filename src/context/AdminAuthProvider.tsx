﻿import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase"
import { User } from "@supabase/supabase-js";
import { fetchUserFromProfiles, fetchUserId } from "@utils/auth";
import Admin from "@src/Admin";
import { Loader2 } from "lucide-react";

const AdminAuthContext = createContext({});

export const useAuth = () => useContext(AdminAuthContext);

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

const signOut = () => supabase.auth.signOut();

const AdminAuthProvider = () => {
  const [user, setUser] = useState<null | User>(null);
  const [adminId, setAdminId] = useState<null | string>(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
        
    const {data} = await login("admin@gmail.com", "realadmin")
    const {fetchedProfile: currentUser, fetchProfileError} = await fetchUserFromProfiles("admin@gmail.com")
    const {fetchedData, fetchError} = await fetchUserId("user@gmail.com")


    setUser(currentUser ?? null);
    setAdminId(fetchedData?.id)

    setLoading(false);
    };
    getUser();
    // onAuthStateChange code below
  }, []);
  
  return (
    <AdminAuthContext.Provider
    value={{
      user,
      adminId,
    }}>
      {loading && 
      <div className='bg-gray-800 min-h-screen flex justify-center items-center'>
        <Loader2  className='text-white '/>
      </div>}

      {!loading && <Admin />}
  </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;