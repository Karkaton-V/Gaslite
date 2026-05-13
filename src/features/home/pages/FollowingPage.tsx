import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";

import {
  getFeedForUser,
  getPostsLikedBySelf,
} from "@/features/auth/api/posts/postFunctions";

import BottomNav from "@/shared/ui/BottomNav";
import { Post } from "@/shared/ui/post";

export default function FollowingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPostsArray, setLikedPostsArray] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    async function loadFeed() {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const userId = auth.user.id;

      const followedPosts = await getFeedForUser(userId);
      const liked = await getPostsLikedBySelf();

      setLikedPostsArray(liked.map((p) => p.user_post_id));
      setPosts(followedPosts ?? []);
      setLoading(false);
    }

    loadFeed();

    const onPosted = () => loadFeed();
    window.addEventListener("post_created", onPosted);
    return () => window.removeEventListener("post_created", onPosted);
  }, []);

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
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Following</h1>
          <p className="mt-2 text-muted-foreground">
            Posts from users you follow.
          </p>
        </div>

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

        {loading && <p className="text-muted-foreground">Loading feed…</p>}

        {!loading && filteredPosts.length === 0 && (
          <p className="text-muted-foreground">
            No posts from followed users yet.
          </p>
        )}

        <div className="space-y-4">
          {filteredPosts.map((post) => (
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
      </div>

      <BottomNav />
    </>
  );
}
