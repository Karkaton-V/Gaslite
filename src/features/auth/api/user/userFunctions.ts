import { supabase } from "@/shared/lib/supabase/client";

/* ============================================================
   INTERNAL AUTH HELPER
   (Prevents repeating supabase.auth.getUser everywhere)
============================================================ */

async function authUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Must be logged in");
  return data.user;
}

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
  const user = await authUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data.display_name;
}

export async function updateDisplayName(newDisplayName: string) {
  const user = await authUser();

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: newDisplayName })
    .eq("id", user.id);

  if (error) throw error;
}

export async function getHandle() {
  const user = await authUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data.handle;
}

export async function updateHandle(newHandle: string) {
  const user = await authUser();

  const { error } = await supabase
    .from("profiles")
    .update({ handle: newHandle })
    .eq("id", user.id);

  if (error) throw error;
}

/* ============================================================
   AVATAR
============================================================ */

export async function getAvatar() {
  const user = await authUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("profile_pic")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  const path = data.profile_pic || "default/default.png";

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

  return urlData.publicUrl;
}

export async function updateAvatar() {
  // TODO: implement upload + update logic
}

/* ============================================================
   FOLLOWING
============================================================ */

export async function getFollowedUsers() {
  const user = await authUser();

  const { data, error } = await supabase
    .from("following")
    .select("isFollowed")
    .eq("isFollowing", user.id);

  if (error) throw error;

  return data.map((row) => row.isFollowed);
}

/* ============================================================
   FEED
============================================================ */

export async function getFeedForUser(userId: string) {
  const { data: follows, error: followErr } = await supabase
    .from("following")
    .select("isFollowed")
    .eq("isFollowing", userId);

  if (followErr) throw followErr;

  const followedIds = follows?.map((f) => f.isFollowed) ?? [];
  if (followedIds.length === 0) return [];

  const { data: posts, error: postErr } = await supabase
    .from("user_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .in("user_id", followedIds)
    .order("created_at", { ascending: false });

  if (postErr) throw postErr;

  return posts;
}
