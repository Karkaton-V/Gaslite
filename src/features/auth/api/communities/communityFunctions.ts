/**
 * Community API utilities
 * Centralized wrapper for all Supabase operations.
 */

import { supabase } from "@/shared/lib/supabase/client";

/* -----------------------------
   Fetch a single community
------------------------------ */
export async function getCommunity(id: string) {
  return await supabase
    .from("communities")
    .select("id, name, picture, follower_count, created_at")
    .eq("id", id)
    .single();
}

/* -----------------------------
   Fetch all communities
------------------------------ */
export async function getAllCommunities() {
  return await supabase
    .from("communities")
    .select("id, name, picture, follower_count")
    .order("follower_count", { ascending: false });
}

/* -----------------------------
   Subscribe to follower changes
------------------------------ */
export function subscribeToCommunityFollowers(callback: () => void) {
  const channel = supabase
    .channel("community-followers-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "community_followers",
      },
      callback,
    )
    .subscribe();

  // React cleanup must be synchronous — do NOT return the Promise
  return () => {
    supabase.removeChannel(channel);
  };
}

/* -----------------------------
   Fetch posts for a community
------------------------------ */
export async function getCommunityPosts(id: string) {
  return await supabase
    .from("community_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .eq("community_id", id)
    .order("created_at", { ascending: false });
}

/* -----------------------------
   Follow a community
------------------------------ */
export async function followCommunity(communityId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  return await supabase.from("community_followers").insert({
    user_id: user.id,
    community_id: communityId,
  });
}

/* -----------------------------
   Unfollow a community
------------------------------ */
export async function unfollowCommunity(communityId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  return await supabase
    .from("community_followers")
    .delete()
    .eq("user_id", user.id)
    .eq("community_id", communityId);
}

/* -----------------------------
   Check follow status
------------------------------ */
export async function getFollowStatus(communityId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("community_followers")
    .select("id")
    .eq("user_id", user.id)
    .eq("community_id", communityId)
    .maybeSingle();

  return !!data;
}

/* -----------------------------
   Create a post
------------------------------ */
export async function createCommunityPost(
  communityId: string,
  content: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  return await supabase.from("community_posts").insert({
    user_id: user.id,
    community_id: communityId,
    content,
  });
}
