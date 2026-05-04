import { supabase } from "@/shared/lib/supabase/client";

export async function getDisplayName() {
  // get auth
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || authData.user == null) throw new Error("Must be logged in");

  // grab user id
  const userId = authData.user.id;

  // grab display name
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId) // no "where" clause, have to use eq() to match
    .single();

  if (error) throw error;
  return data.display_name;
}

// takes in new display name as parameter, updates db accordingly
export async function updateDisplayName(newDisplayName: string) {
  // get auth
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || authData.user == null) throw new Error("Must be logged in");

  // grab user id
  const userId = authData.user.id;

  // update db
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: newDisplayName })
    .eq("id", userId);

  if (error) throw error;
}

export async function getHandle() {
  // get auth
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || authData.user == null) throw new Error("Must be logged in");

  // grab user id
  const userId = authData.user.id;

  // grab handle
  const { data, error } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data.handle;
}

export async function updateHandle(newHandle: string) {
  // get auth
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || authData.user == null) throw new Error("Must be logged in");

  // grab user id
  const userId = authData.user.id;

  // update db
  const { data, error } = await supabase
    .from("profiles")
    .update({ handle: newHandle })
    .eq("id", userId);

  if (error) throw error;
}

export async function getAvatar() {
  // this function returns avatar URL

  // get auth
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || authData.user == null) throw new Error("Must be logged in");

  // grab user id
  const userId = authData.user.id;

  // grab avatar bucket path
  const { data, error } = await supabase
    .from("profiles")
    .select("profile_pic")
    .eq("id", userId)
    .single();

  if (error) throw error;

  // use supabase to grab URL
  const { data: avatarData } = supabase.storage
    .from("avatars")
    .getPublicUrl(data.profile_pic);

  // url can then be rendered as an image as needed
  return avatarData.publicUrl;
}

export async function updateAvatar() {}

export async function getFollowedUsers() {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from("following")
    .select("isFollowed")
    .eq("isFollowing", userId);

  if (error) throw error;

  return data;
}
