import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCommunityPost,
  getUserPost,
} from "@/features/auth/api/posts/postFunctions";

import { Post } from "@/shared/ui/post";

export default function SinglePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      // Try community post first
      try {
        const communityPost = await getCommunityPost(id);
        if (communityPost) {
          setPost({ ...communityPost, source: "community" });
          setLoading(false);
          return;
        }
      } catch {}

      // Fallback: user post
      try {
        const userPost = await getUserPost(id);
        if (userPost) {
          setPost({ ...userPost, source: "user" });
        }
      } catch {}

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <p className="p-6">Loading post…</p>;
  if (!post) return <p className="p-6">Post not found.</p>;

  return (
    <div className="min-h-screen bg-background p-6">
      <Post
        postId={post.id}
        source={post.source}
        communityId={post.community_id ?? null}
        username={post.profiles.display_name}
        avatarPicture={post.profiles.profile_pic}
        postContent={post.content}
        likeCount={post.like_count}
        commentCount={post.comment_count}
        timePosted={post.created_at}
        communityName={post.communities?.name}
        communityPicture={post.communities?.picture}
      />
    </div>
  );
}
