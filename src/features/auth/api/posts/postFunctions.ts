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

export async function toggleLike(postId: string, source: "user" | "community") {
  const user = await authUser();

  const column = source === "user" ? "user_post_id" : "community_post_id";

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("liked_by", user.id)
    .eq(column, postId)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("post_likes").insert({
    liked_by: user.id,
    [column]: postId,
  });

  return true;
}

export async function hasLiked(postId: string, source: "user" | "community") {
  const user = await authUser();
  const column = source === "user" ? "user_post_id" : "community_post_id";

  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq(column, postId)
    .eq("liked_by", user.id);

  return (count ?? 0) > 0;
}

export async function getLikeCount(
  postId: string,
  source: "user" | "community",
) {
  const column = source === "user" ? "user_post_id" : "community_post_id";

  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq(column, postId);

  return count ?? 0;
}
