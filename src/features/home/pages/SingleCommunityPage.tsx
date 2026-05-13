import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCommunity,
  getCommunityPosts,
  getFollowStatus,
  followCommunity,
  unfollowCommunity,
} from "@/features/auth/api/communities/communityFunctions";

import { supabase } from "@/shared/lib/supabase/client";
import { Post } from "@/shared/ui/post";
import { PostDialog } from "@/shared/ui/post-dialog";
import { Button } from "@/shared/ui/button";
import BottomNav from "@/shared/ui/BottomNav";

export default function CommunityPage() {
  const { id } = useParams();

  // Prevent rendering if the route param is missing.
  if (!id) {
    return <div className="p-6 text-muted-foreground">Invalid community.</div>;
  }

  // Guaranteed string version of the community ID.
  const communityId: string = id;

  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Load community info, posts, and follow status.
  useEffect(() => {
    async function load() {
      const info = await getCommunity(communityId);
      const feed = await getCommunityPosts(communityId);
      const follow = await getFollowStatus(communityId);

      setCommunity(info);
      setPosts(feed);
      setIsFollowing(follow);
      setLoading(false);
    }

    load();

    // Local event fired when the user creates a new post.
    const onPosted = () => load();
    window.addEventListener("post_created", onPosted);

    // Realtime subscription for posts inside this community.
    const postChannel = supabase
      .channel(`community-posts-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_posts",
          filter: `community_id=eq.${communityId}`,
        },
        () => load(),
      )
      .subscribe();

    // Realtime subscription for follower changes.
    const followerChannel = supabase
      .channel(`community-followers-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_followers",
          filter: `community_id=eq.${communityId}`,
        },
        async () => {
          const updated = await getCommunity(communityId);
          const follow = await getFollowStatus(communityId);

          setCommunity(updated);
          setIsFollowing(follow);
        },
      )
      .subscribe();

    return () => {
      window.removeEventListener("post_created", onPosted);
      supabase.removeChannel(postChannel);
      supabase.removeChannel(followerChannel);
    };
  }, [communityId]);

  // Follow / Unfollow handler with instant UI update.
  async function toggleFollow() {
    if (isFollowing) {
      await unfollowCommunity(communityId);
      setIsFollowing(false);

      setCommunity((prev: any) => ({
        ...prev,
        follower_count: prev.follower_count - 1,
      }));
    } else {
      await followCommunity(communityId);
      setIsFollowing(true);

      setCommunity((prev: any) => ({
        ...prev,
        follower_count: prev.follower_count + 1,
      }));
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading community…</div>;
  }

  if (!community) {
    return (
      <div className="p-6 text-muted-foreground">Community not found.</div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background p-6 pb-24 space-y-6">
        {/* Community header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={community.picture || "/default-community.png"}
              onError={(e) => (e.currentTarget.src = "/default-community.png")}
              className="w-16 h-16 rounded-md object-cover"
            />

            <div>
              <h1 className="text-3xl font-semibold">{community.name}</h1>
              <p className="text-muted-foreground">
                {community.follower_count} followers
              </p>
            </div>
          </div>

          {/* New Post → Follow */}
          <div className="flex items-center gap-3">
            <PostDialog communityId={communityId} />

            <Button
              onClick={toggleFollow}
              variant={isFollowing ? "default" : "outline"}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-4">
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation bar (same placement as DashboardPage) */}
      <BottomNav />
    </>
  );
}
