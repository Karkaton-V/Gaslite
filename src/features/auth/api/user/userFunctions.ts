import { supabase } from "@/shared/lib/supabase/client";

//functions for login page
export async function loginUser(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error };
}

//functions for register page
export async function registerUser(
  email: string,
  password: string,
  username: string,
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        handle: username,
        display_name: username, // link display_name to handle
      },
    },
  });

  return { error };
}

//functions for PasswordResetPage
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}
