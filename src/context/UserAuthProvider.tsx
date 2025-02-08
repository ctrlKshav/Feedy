import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import supabase from "@utils/supabase"
import { User } from "@supabase/supabase-js";
import { fetchUserId } from "@utils/auth";
import App from "@src/App";

const UserAuthContext = createContext({});

export const useAuth = () => useContext(UserAuthContext);

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

const signOut = () => supabase.auth.signOut();

const UserAuthProvider = () => {
  const [user, setUser] = useState<null | User>(null);
  const [adminId, setAdminId] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
        
    const {data} = await login("user@gmail.com", "realuser")
    const {fetchedData, fetchError} = await fetchUserId("admin@gmail.com")

    const { user: currentUser } = data;
    setUser(currentUser ?? null);
    setAdminId(fetchedData?.id)
    
    setLoading(false);
    };
    getUser();
    // onAuthStateChange code below
  }, []);
  
  return (
    <UserAuthContext.Provider
      value={{
        user,
        adminId,
      }}>
      {!loading && <App />}
    </UserAuthContext.Provider>
  );
};

export default UserAuthProvider;