import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";

import {
  getFeedForUser,
  getPostsLikedBySelf,
} from "@/features/auth/api/posts/postFunctions";
import { Post } from "@/shared/ui/post";
import BottomNav from "@/shared/ui/BottomNav";

export default function UserPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPostsArray, setLikedPostsArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);

      // 1. Get current user
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        setPosts([]);
        setLikedPostsArray([]);
        setLoading(false);
        return;
      }

      const userId = user.id;

      // 2. Get posts from followed users (NEW)
      const followedPosts = await getFeedForUser(userId);

      // 3. Get posts liked by self
      const likedPosts = await getPostsLikedBySelf();
      setLikedPostsArray((likedPosts ?? []).map((p) => p.user_post_id));

      setPosts(followedPosts || []);
      setLoading(false);
    }

    loadPosts();
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-semibold">Recommended</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your recommended user posts.
        </p>
      </div>

      <div className="min-h-screen bg-muted p-8 text-foreground space-y-6 pb-24">
        {loading && <p className="text-muted-foreground">Loading posts…</p>}

        {!loading && posts.length === 0 && (
          <p className="text-muted-foreground">
            No posts from followed users yet.
          </p>
        )}

        {posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            source="user"
            communityId={null}
            username={post.profiles.display_name}
            avatarPicture={post.profiles.profile_pic}
            timePosted={post.created_at}
            postContent={post.content}
            likeCount={post.like_count}
            commentCount={post.comment_count}
            initialIsLiked={likedPostsArray.includes(post.id)}
          />
        ))}
      </div>

      <BottomNav />
    </>
  );
}
