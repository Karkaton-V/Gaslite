import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";

import { getPostFromFollowed } from "../../auth/api/posts/postFunctions";
import BottomNav from "@/shared/ui/BottomNav";
import { Post } from "@/shared/ui/post";

export default function FollowingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  /**
   * Load feed:
   * 1. Get current user
   * 2. Get posts from followed users
   */
  useEffect(() => {
    async function loadFeed() {
      setLoading(true);

      // 1. Get current user
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 2. Get posts from followed users
      const followedPosts = await getPostFromFollowed(userId);

      setPosts(followedPosts || []);
      setLoading(false);
    }

    loadFeed();
  }, []);

  /**
   * Apply filtering + sorting
   */
  const filteredPosts = posts
    .filter((post) => {
      if (filterBy === "popular") return post.like_count >= 100;
      if (filterBy === "comments") return post.comment_count > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "likes") return b.like_count - a.like_count;
      if (sortBy === "comments") return b.comment_count - a.comment_count;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  return (
    <>
      <div className="min-h-screen bg-background p-8 pb-24 text-foreground">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Following</h1>
          <p className="mt-2 text-muted-foreground">
            Posts from users you follow.
          </p>
        </div>

        {/* Sort + Filter */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="newest">Sort: Newest</option>
            <option value="likes">Sort: Most liked</option>
            <option value="comments">Sort: Most commented</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="all">Filter: All posts</option>
            <option value="popular">Filter: Popular posts</option>
            <option value="comments">Filter: Has comments</option>
          </select>
        </div>

        {/* Loading */}
        {loading && <p className="text-muted-foreground">Loading feed…</p>}

        {/* Posts */}
        {!loading && filteredPosts.length === 0 && (
          <p className="text-muted-foreground">
            No posts from followed users yet.
          </p>
        )}

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Post
              key={post.id}
              username={post.profiles.display_name}
              avatarPicture={post.profiles.profile_pic}
              postContent={post.content}
              likeCount={post.like_count}
              commentCount={post.comment_count}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
