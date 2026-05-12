import { supabase } from "@/shared/lib/supabase/client";

/* ============================================================
   TYPES
============================================================ */

export type CreatePostInfo = {
  content: string;
  image?: string | null;
};

export type LikePostInfo = {
  postId: string;
  userId: string;
};

/* ============================================================
   CREATE POST
============================================================ */

export async function createPost(input: CreatePostInfo) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Must be logged in");

  const postContent = input.content.trim();
  if (!postContent) throw new Error("Post content cannot be empty");
  if (postContent.length > 250)
    throw new Error("Posts are limited to 250 characters");

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from("user_posts")
    .insert({
      user_id: userId,
      content: postContent,
      image: input.image ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ============================================================
   DELETE POST
============================================================ */

export async function deletePost(postId: string) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const userId = authData.user.id;

  // Only delete posts owned by the user
  const { error } = await supabase
    .from("user_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

/* ============================================================
   GRAB POST GIVEN UUID
============================================================ */
export async function getPost(postId: string) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from("user_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
}

/* ============================================================
   LIKE POST
============================================================ */

export async function likePost(postId: string) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const userId = authData.user.id;

  // Insert into likes table (you must have a likes table)
  const { error } = await supabase.from("post_likes").insert({
    post_id: postId,
    liked_by: userId,
  });

  if (error) throw error;

  // Increment like_count
  await supabase.rpc("increment_post_likes", { postid: postId });

  return true;
}

/* ============================================================
   UNLIKE POST
============================================================ */

export async function unlikePost(postId: string) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const userId = authData.user.id;

  // Remove like row
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("liked_by", userId);

  if (error) throw error;

  // Decrement like_count
  await supabase.rpc("decrement_post_likes", { postid: postId });

  return true;
}

/* ============================================================
   GET LIKES ON A POST
============================================================ */
export async function getLikeCount(postId: string) {
  // no auth required!

  const { count, error } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) throw error;

  // potential for count to be null; in that case, return 0
  return count ?? 0;
}

/* ============================================================
   GET POSTS LIKED BY USER
============================================================ */
// can be used in profile page
export async function getPostsLikedByUser(userId: string) {
  const { data, error } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("liked_by", userId);

  if (error) throw error;
  // in this case, "data" is an array of post IDs
  return data;
}

/* ============================================================
   GET POSTS LIKED BY SELF
============================================================ */
export async function getPostsLikedBySelf() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Must be logged in");

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("liked_by", userId);

  if (error) throw error;
  return data;
}

/* ============================================================
   GET POSTS FROM A SPECIFIC USER
============================================================ */

export async function getPostFromUser(userId: string) {
  const { data, error } = await supabase
    .from("user_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/* ============================================================
   GET POSTS FROM FOLLOWED USERS
============================================================ */

export async function getPostFromFollowed(selfUserId: string) {
  // 1. Get list of followed users
  const { data: follows, error: followErr } = await supabase
    .from("following")
    .select("isFollowed")
    .eq("isFollowing", selfUserId);

  if (followErr) throw followErr;

  const followedIds = follows?.map((f) => f.isFollowed) ?? [];

  if (followedIds.length === 0) return [];

  // 2. Get posts from those users
  const { data: posts, error: postErr } = await supabase
    .from("user_posts")
    .select("*, profiles(display_name, handle, profile_pic)")
    .in("user_id", followedIds)
    .order("created_at", { ascending: false });

  if (postErr) throw postErr;

  return posts;
}
