import { supabase } from "@/shared/lib/supabase/client";

/* ============================================================
   AUTH FUNCTIONS
============================================================ */

export async function loginUser(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error };
}

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
        display_name: username,
      },
    },
  });

  return { error };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}

/* ============================================================
   PROFILE GETTERS / SETTERS
============================================================ */

export async function getDisplayName() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Must be logged in");

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", authData.user.id)
    .single();

  if (error) throw error;
  return data.display_name;
}

export async function updateDisplayName(newDisplayName: string) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: newDisplayName })
    .eq("id", authData.user.id);

  if (error) throw error;
}

export async function getHandle() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const { data, error } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", authData.user.id)
    .single();

  if (error) throw error;
  return data.handle;
}

export async function updateHandle(newHandle: string) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const { error } = await supabase
    .from("profiles")
    .update({ handle: newHandle })
    .eq("id", authData.user.id);

  if (error) throw error;
}

/* ============================================================
   AVATAR
============================================================ */

export async function getAvatar() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const { data, error } = await supabase
    .from("profiles")
    .select("profile_pic")
    .eq("id", authData.user.id)
    .single();

  if (error) throw error;

  const path = data.profile_pic || "default/default.png";

  const { data: avatarData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  return avatarData.publicUrl;
}

export async function updateAvatar() {
  // TODO: implement upload + update logic
}

/* ============================================================
   FOLLOWING
============================================================ */

export async function getFollowedUsers() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from("following")
    .select("isFollowed")
    .eq("isFollowing", userId);

  if (error) throw error;

  // Return a flat array of UUIDs
  return data.map((row) => row.isFollowed);
}

/* ============================================================
   FEED
============================================================ */

export async function getFeedForUser(userId: string) {
  // 1. Get followed users
  const { data: follows, error: followErr } = await supabase
    .from("following")
    .select("isFollowed")
    .eq("isFollowing", userId);

  if (followErr) throw followErr;

  const followedIds = follows?.map((f) => f.isFollowed) ?? [];

  if (followedIds.length === 0) return [];

  // 2. Get posts from followed users
  const { data: posts, error: postErr } = await supabase
    .from("user_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .in("user_id", followedIds)
    .order("created_at", { ascending: false });

  if (postErr) throw postErr;

  return posts;
}
