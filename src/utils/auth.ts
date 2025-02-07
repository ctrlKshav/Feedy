import supabase from "./supabase";

export const authLoader = async () => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "user@gmail.com",
        password: "realuser"
      });
      if (authError) {
        console.error('Error fetching user:', authError);
      }
    // console.log(authData)
    return { userData: authData, authError };
};

export const fetchAdminID = async ( adminEmail : string) => {
  const { data: adminData, error: adminError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', adminEmail)
    .single();

  return { adminData, adminError };
}

