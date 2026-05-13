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
   USER POSTS (FollowingPage)
============================================================ */
export async function getUserPost(postId: string) {
  const { data, error } = await supabase
    .from("user_posts")
    .select(
      `
      *,
      profiles:profiles!user_posts_user_id_fkey(display_name, profile_pic)
    `,
    )
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
}
export async function createUserPost(content: string, image?: string | null) {
  const user = await authUser();

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Post content cannot be empty");
  if (trimmed.length > 250)
    throw new Error("Posts are limited to 250 characters");

  const { data, error } = await supabase
    .from("user_posts")
    .insert({
      user_id: user.id,
      content: trimmed,
      image: image ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFeedForUser(userId: string) {
  // 1. Get users the current user follows
  const { data: follows, error: followErr } = await supabase
    .from("following")
    .select(`"isFollowed"`)
    .eq(`"isFollowing"`, userId);

  if (followErr) throw followErr;

  const followedIds = follows?.map((f) => f.isFollowed) ?? [];
  if (followedIds.length === 0) return [];

  // 2. Fetch posts from those users
  const { data: posts, error: postErr } = await supabase
    .from("user_posts")
    .select(
      `
      *,
      profiles:profiles!user_posts_user_id_fkey(display_name, profile_pic)
    `,
    )
    .in("user_id", followedIds)
    .order("created_at", { ascending: false });

  if (postErr) throw postErr;

  return posts;
}

export async function getPostsLikedBySelf() {
  const user = await authUser();

  const { data, error } = await supabase
    .from("post_likes")
    .select("user_post_id")
    .eq("liked_by", user.id);

  if (error) throw error;

  return data as { user_post_id: string }[];
}

/* ============================================================
   COMMUNITY POSTS (DashboardPage)
============================================================ */
export async function getCommunityPost(postId: string) {
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      `
      *,
      profiles:profiles!community_posts_user_id_fkey(display_name, profile_pic),
      communities:communities!community_posts_community_id_fkey(name, picture)
    `,
    )
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
}

export async function createCommunityPost(
  communityId: string,
  content: string,
  image?: string | null,
) {
  const user = await authUser();

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Post content cannot be empty");
  if (trimmed.length > 250)
    throw new Error("Posts are limited to 250 characters");

  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      community_id: communityId,
      user_id: user.id,
      content: trimmed,
      image: image ?? null,
    })
    .select()
    .single();

  // Handle duplicate content inside the same community
  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "Someone beat you to it — this post already exists in the community.\nDrop something original instead.",
      );
    }
    throw error;
  }

  return data;
}

export async function getCommunityFeed(userId: string) {
  const { data: follows, error: followErr } = await supabase
    .from("community_followers")
    .select("community_id")
    .eq("user_id", userId);

  if (followErr) throw followErr;

  const communityIds = follows?.map((f) => f.community_id) ?? [];
  if (communityIds.length === 0) return [];

  const { data: posts, error: postErr } = await supabase
    .from("community_posts")
    .select(
      `
      *,
      profiles:profiles!community_posts_user_id_fkey(display_name, profile_pic),
      communities:communities!community_posts_community_id_fkey(name, picture)
    `,
    )
    .in("community_id", communityIds)
    .order("created_at", { ascending: false });

  if (postErr) throw postErr;

  return posts;
}

/* ============================================================
   UNIFIED LIKE SYSTEM (post_likes)
============================================================ */

export async function toggleLike(postId: string, source: "user" | "community", likeType: 1 | -1) {
  const user = await authUser();
  const column = source === "user" ? "user_post_id" : "community_post_id";

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id, vote_type")
    .eq("liked_by", user.id)
    .eq(column, postId)
    .maybeSingle();

  // If the same vote type exists, remove it (toggle off)
  if (existing && existing.vote_type === likeType) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    return null;
  }

  // If the opposite vote exists, update it
  if (existing && existing.vote_type !== likeType) {
    await supabase
      .from("post_likes")
      .update({ vote_type: likeType })
      .eq("id", existing.id);
    return likeType;
  }

  // No vote exists, insert a new one
  await supabase.from("post_likes").insert({
    liked_by: user.id,
    [column]: postId,
    vote_type: likeType,
  });

  return likeType;
}

export async function hasLiked(postId: string, source: "user" | "community"): Promise<1 | -1 | null> {
  const user = await authUser();
  const column = source === "user" ? "user_post_id" : "community_post_id";

  const { data } = await supabase
    .from("post_likes")
    .select("vote_type")
    .eq(column, postId)
    .eq("liked_by", user.id)
    .maybeSingle();

  return (data?.vote_type as 1 | -1) ?? null;
}

export async function isPostPositive(
  postId: string,
  source: "user" | "community"
): Promise<boolean> {
  const count = await getLikeCount(postId, source);
  return count > 0;
}

export async function getLikeCount(postId: string, source: "user" | "community") {
  const column = source === "user" ? "user_post_id" : "community_post_id";

  const { data } = await supabase
    .from("post_likes")
    .select("vote_type")
    .eq(column, postId);

  if (!data) return 0;

  return data.reduce((acc, row) => acc + (row.vote_type as 1 | -1), 0);
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;

  return `${Math.floor(seconds / 31536000)}y ago`;
}
