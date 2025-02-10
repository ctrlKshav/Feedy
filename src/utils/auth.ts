import supabase from "./supabase";

export const authLoader = async ( email : string, password : string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (authError) {
        console.error('Error fetching user:', authError);
      }
    return { authData, authError };
};

export const fetchUserId = async ( email : string) => {
  const { data: fetchedData, error: fetchError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  return { fetchedData, fetchError };
}

export const fetchUserFromProfiles = async ( email : string) => {
  const { data: fetchedProfile, error: fetchProfileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  return { fetchedProfile, fetchProfileError };
}


