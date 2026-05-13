import { supabase } from "@/shared/lib/supabase/client";

/* ============================================================
   INTERNAL AUTH HELPER
============================================================ */

async function authUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Must be logged in");
  return data.user;
}

/* ============================================================
   FETCH A SINGLE COMMUNITY
============================================================ */

export async function getCommunity(id: string) {
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, picture, follower_count, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/* ============================================================
   FETCH ALL COMMUNITIES
============================================================ */

export async function getAllCommunities() {
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, picture, follower_count")
    .order("follower_count", { ascending: false });

  if (error) throw error;
  return data;
}

/* ============================================================
   REALTIME FOLLOWER SUBSCRIPTION
============================================================ */

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

  return () => {
    supabase.removeChannel(channel);
  };
}

/* ============================================================
   FOLLOW / UNFOLLOW COMMUNITY
============================================================ */

export async function followCommunity(communityId: string) {
  const user = await authUser();

  const { error } = await supabase
    .from("community_followers")
    .insert({ user_id: user.id, community_id: communityId });

  if (error) throw error;
  return true;
}

export async function unfollowCommunity(communityId: string) {
  const user = await authUser();

  const { error } = await supabase
    .from("community_followers")
    .delete()
    .eq("user_id", user.id)
    .eq("community_id", communityId);

  if (error) throw error;
  return true;
}

export async function getFollowStatus(communityId: string) {
  const user = await authUser();

  const { data, error } = await supabase
    .from("community_followers")
    .select("id")
    .eq("user_id", user.id)
    .eq("community_id", communityId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/* ============================================================
   GET FOLLOWED COMMUNITY IDS
============================================================ */

export async function getFollowedCommunities(userId: string) {
  const { data, error } = await supabase
    .from("community_followers")
    .select("community_id")
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((row) => row.community_id);
}
/* ============================================================
   FETCH ALL POSTS INSIDE A COMMUNITY
============================================================ */

export async function getCommunityPosts(communityId: string) {
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      `
      *,
      profiles:profiles!community_posts_user_id_fkey(display_name, profile_pic),
      communities:communities!community_posts_community_id_fkey(name, picture)
    `,
    )
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
