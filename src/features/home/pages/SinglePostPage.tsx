import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase/client";
import {
  getPost,
  getPostsLikedBySelf,
} from "@/features/auth/api/posts/postFunctions";
import { Post } from "@/shared/ui/post";
import BottomNav from "@/shared/ui/BottomNav";

// define post type
type PostType = {
  content: string;
  like_count: number;
  comment_count: number;
  profiles: {
    display_name: string;
    handle: string;
    profile_pic: string | null;
  };
};

export default function SinglePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PostType | null>(null);

  const [likedPostsArray, setLikedPostsArray] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadPosts();
  }, [id]);

  async function loadPosts() {
    if (!id) {
      setPost(null);
      setLoading(false);
      setError("Missing post ID");
      return;
    }

    setLoading(true);
    setError(null);

    // grab liked posts
    const likedPosts = await getPostsLikedBySelf();
    setLikedPostsArray((likedPosts ?? []).map((post) => post.post_id));

    // grab post info

    try {
      const data = await getPost(id);
      setPost(data as PostType);
    } catch {
      setPost(null);
      setError("Could not load post");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {/* header can be removed later if needed */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Single Post View</h1>
          <p className="mt-2 text-muted-foreground">Work In Progress</p>
          <p className="mt-3 text-foreground">Post UUID: {id}</p>
        </div>
      </div>

      <div className="min-h-screen bg-background p-8 pb-24 text-foreground">
        {loading && <p className="text-muted-foreground">Loading Post...</p>}

        {!loading && error && <p className="text-muted-foreground">{error}</p>}

        {!loading && post && id && (
          <Post
            postId={id}
            username={post.profiles.display_name}
            avatarPicture={post.profiles.profile_pic}
            initialIsLiked={likedPostsArray.includes(id)}
            postContent={post.content}
            likeCount={post.like_count}
            commentCount={post.comment_count}
          />
        )}
      </div>
      <BottomNav />
    </>
  );
}
