/**
 * Community API utilities
 * -----------------------
 * Centralized wrapper for all Supabase operations related to:
 * - community metadata
 * - follow/unfollow relationships
 * - community posts
 *
 * Keeping all DB logic here prevents UI components from becoming
 * tightly coupled to Supabase. If the schema changes later,
 * only this file needs to be updated.
 */

import { supabase } from "@/shared/lib/supabase/client";

/* -------------------------------------------------------------
   Fetch a single community by ID
   Includes follower_count (maintained by triggers)
-------------------------------------------------------------- */
export async function getCommunity(id: string) {
  return await supabase
    .from("communities")
    .select("id, name, picture, follower_count, created_at")
    .eq("id", id)
    .single();
}

/* -------------------------------------------------------------
   Fetch all communities
   Sorted by follower_count (descending)
-------------------------------------------------------------- */
export async function getAllCommunities() {
  return await supabase
    .from("communities")
    .select("id, name, picture, follower_count")
    .order("follower_count", { ascending: false });
}

/* -------------------------------------------------------------
   Realtime subscription for follower changes
   Fires callback on INSERT/DELETE in community_followers
   Cleanup must be synchronous (React requirement)
-------------------------------------------------------------- */
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

  // React cleanup must NOT return a Promise
  return () => {
    supabase.removeChannel(channel);
  };
}

/* -------------------------------------------------------------
   Fetch posts for a community
   Includes profile join for author info
-------------------------------------------------------------- */
export async function getCommunityPosts(id: string) {
  return await supabase
    .from("community_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .eq("community_id", id)
    .order("created_at", { ascending: false });
}

/* -------------------------------------------------------------
   Follow a community
   Triggers increment follower_count
-------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   Unfollow a community
   Triggers decrement follower_count
-------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   Check if current user follows a community
   Returns boolean for convenience
-------------------------------------------------------------- */
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

/* -------------------------------------------------------------
   Create a new post inside a community
   Realtime subscription on the page will auto-update the feed
-------------------------------------------------------------- */
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
