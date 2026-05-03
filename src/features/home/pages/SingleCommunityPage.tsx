import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  getCommunity,
  getCommunityPosts,
  followCommunity,
  unfollowCommunity,
  createCommunityPost,
  getFollowStatus,
} from "../../auth/api/communities/communityFunctions";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import BottomNav from "@/shared/ui/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { supabase } from "@/shared/lib/supabase/client";

// Types based on your schema
type Community = {
  id: string;
  created_at: string;
  name: string;
  picture: string | null;
  follower_count: number;
};

type CommunityPost = {
  id: string;
  created_at: string;
  user_id: string;
  community_id: string;
  content: string;
  image: string | null;
  like_count: number;
  profiles: {
    display_name: string;
    handle: string;
    profile_pic: string;
  };
};

export default function SingleCommunityPage() {
  const { id } = useParams();

  // Core state for the page
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  // Used to auto-scroll when new posts appear
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /**
   * Loads all community-related data:
   * - Community info (name, picture, follower_count)
   * - Posts inside the community
   * - Whether the current user is following
   */
  async function loadAll() {
    if (!id) return;

    setLoading(true);

    const { data: c } = await getCommunity(id);
    setCommunity(c as Community);

    const { data: p } = await getCommunityPosts(id);
    setPosts((p || []) as CommunityPost[]);

    const following = await getFollowStatus(id);
    setIsFollowing(following);

    setLoading(false);
  }

  /**
   * Initial load + Realtime subscription for new posts.
   * This makes the community feed feel alive.
   */
  useEffect(() => {
    loadAll();

    // Subscribe to realtime INSERT events for posts in this community
    const channel = supabase
      .channel("community-posts-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_posts",
          filter: `community_id=eq.${id}`,
        },
        (payload) => {
          // Prepend new posts to the feed
          setPosts((prev) => [payload.new as CommunityPost, ...prev]);
        },
      )
      .subscribe();

    // Cleanup subscription when leaving the page
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  /**
   * Handles follow/unfollow with optimistic UI.
   * The UI updates instantly while the request finishes in the background.
   */
  async function toggleFollow() {
    if (!id) return;
    console.log("FOLLOWING COMMUNITY ID:", id);
    const next = !isFollowing;
    setIsFollowing(next); // optimistic UI

    // Call correct API based on the new state
    const result = next
      ? await followCommunity(id)
      : await unfollowCommunity(id);

    console.log("FOLLOW RESULT:", result);

    // If DB call failed, revert UI
    if (result?.error) {
      setIsFollowing(!next);
      return;
    }

    // Refresh community with fresh object reference
    const { data: c } = await getCommunity(id);
    setCommunity(c ? { ...c } : null);
  }

  /**
   * Creates a new post inside the community.
   * After posting, the feed refreshes and scrolls smoothly.
   */
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !newPost.trim()) return;

    await createCommunityPost(id, newPost);
    setNewPost("");

    // Smooth scroll to show the new post
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  if (loading || !community) {
    return <p className="p-4">Loading community…</p>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* ===========================
            COMMUNITY HEADER
            Shows picture, name, follower count, follow button
        ============================ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                community.picture?.startsWith("http")
                  ? community.picture
                  : "/default-community.png"
              }
              onError={(e) => (e.currentTarget.src = "/default-community.png")}
              className="w-14 h-14 rounded-md object-cover"
            />

            <div>
              <h1 className="text-2xl font-bold">{community.name}</h1>
              <p className="text-sm text-muted-foreground">
                {community.follower_count} followers
              </p>
            </div>
          </div>

          <Button type="button" onClick={toggleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </div>

        {/* ===========================
            CREATE POST INPUT
            Lets users share text posts inside the community
        ============================ */}
        <Card className="p-4 space-y-2">
          <form onSubmit={handleCreatePost} className="space-y-2">
            <Input
              placeholder="Share something..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Post
            </Button>
          </form>
        </Card>

        {/* ===========================
            POSTS FEED
            Displays all posts with user info + avatar fallback
        ============================ */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-4">
              {/* Post header: avatar + name + handle */}
              <div className="flex items-center gap-2 mb-2">
                <Avatar>
                  <AvatarImage src={post.profiles.profile_pic} />
                  <AvatarFallback>
                    {post.profiles.display_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{post.profiles.display_name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{post.profiles.handle}
                  </p>
                </div>
              </div>

              {/* Post content */}
              <p className="mb-2">{post.content}</p>

              {/* Optional post image */}
              {post.image && (
                <img
                  src={post.image}
                  className="rounded-md mt-2 max-h-80 object-cover"
                />
              )}
            </Card>
          ))}
        </div>

        {/* Used for smooth scrolling after posting */}
        <div ref={bottomRef} />
      </div>

      <BottomNav />
    </>
  );
}
