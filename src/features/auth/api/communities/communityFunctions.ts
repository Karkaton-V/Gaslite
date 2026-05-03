/**
 * Community API utilities
 * -----------------------
 * Centralized wrapper around all Supabase operations related to:
 * - community metadata (name, picture, follower_count)
 * - follow/unfollow relationships
 * - community posts and profile joins
 *
 * Keeping this logic isolated prevents page components from
 * becoming tightly coupled to Supabase queries. If the schema
 * changes or we move to RPC/Edge Functions later, only this file
 * needs to be updated.
 */

import { supabase } from "@/shared/lib/supabase/client";

/**
 * getCommunity
 * ------------
 * Fetches a single community by ID.
 *
 * IMPORTANT:
 * Supabase does NOT automatically return computed columns
 * (like follower_count) when using `select("*")`.
 *
 * follower_count is maintained by database triggers, so we must
 * explicitly select it here or the UI will always receive stale data.
 */
export async function getCommunity(id: string) {
  return await supabase
    .from("communities")
    .select("id, name, picture, follower_count, created_at")
    .eq("id", id)
    .single();
}

/**
 * getCommunityPosts
 * -----------------
 * Retrieves all posts for a community, sorted newest → oldest.
 *
 * Includes a join on the profiles table so each post already
 * contains the author's:
 * - display_name
 * - handle
 * - profile_pic
 *
 * This avoids extra client-side fetches and keeps the UI fast.
 */
export async function getCommunityPosts(id: string) {
  return await supabase
    .from("community_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .eq("community_id", id)
    .order("created_at", { ascending: false });
}

/**
 * followCommunity
 * ---------------
 * Creates a follower relationship between the current user
 * and the specified community.
 *
 * The database trigger automatically increments follower_count,
 * which keeps the logic consistent even if multiple clients
 * follow/unfollow simultaneously.
 *
 * Requires authentication.
 */
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

/**
 * unfollowCommunity
 * -----------------
 * Removes the follower relationship for the current user.
 *
 * The trigger on community_followers automatically decrements
 * follower_count, so the UI only needs to re-fetch the community
 * to stay in sync.
 */
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

/**
 * getFollowStatus
 * ---------------
 * Determines whether the current user is following a community.
 *
 * Used to initialize the follow button state on page load.
 * Returns a boolean instead of raw DB data for convenience.
 */
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

/**
 * createCommunityPost
 * -------------------
 * Inserts a new text post into the community.
 *
 * The page subscribes to realtime INSERT events, so new posts
 * appear instantly without requiring a manual refresh.
 *
 * This function only handles the DB write — the UI handles
 * scrolling, clearing input, and optimistic updates.
 */
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
