import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";

import { getCommunityFeed } from "@/features/auth/api/posts/postFunctions";
import { Post } from "@/shared/ui/post";
import BottomNav from "@/shared/ui/BottomNav";

export default function DashboardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const feed = await getCommunityFeed(auth.user.id);
      setPosts(feed);
      setLoading(false);
    }

    loadFeed();

    const onPosted = () => loadFeed();
    window.addEventListener("post_created", onPosted);
    return () => window.removeEventListener("post_created", onPosted);
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Posts from communities you follow.
        </p>
      </div>

      <div className="min-h-screen bg-background p-6 pb-24 space-y-6">
        {loading && <p className="text-muted-foreground">Loading feed…</p>}

        {!loading && posts.length === 0 && (
          <p className="text-muted-foreground">
            You’re not following any communities yet.
          </p>
        )}

        {posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            source="community"
            communityId={post.community_id}
            username={post.profiles.display_name}
            avatarPicture={post.profiles.profile_pic}
            postContent={post.content}
            likeCount={post.like_count}
            commentCount={post.comment_count}
            timePosted={post.created_at}
            communityName={post.communities.name}
            communityPicture={post.communities.picture}
          />
        ))}
      </div>

      <BottomNav />
    </>
  );
}
