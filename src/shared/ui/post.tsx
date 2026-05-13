import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Toggle } from "@/shared/ui/toggle";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { HeartIcon } from "@phosphor-icons/react";
import { formatTimestamp, isPostPositive } from "@/features/auth/api/posts/postFunctions";

import {
  toggleLike,
  getLikeCount,
  hasLiked,
} from "@/features/auth/api/posts/postFunctions";
import { supabase } from "../lib/supabase/client";

type PostProps = {
  postId: string;
  source: "user" | "community";
  communityId: string | null;

  username: string;
  avatarPicture: string;
  postContent: string;
  timePosted: string;

  likeCount: number;
  commentCount: number;
  initialIsLiked?: boolean;

  communityName?: string;
  communityPicture?: string;
};

export function Post({
  postId,
  source,
  communityId,

  username,
  avatarPicture,
  postContent,
  timePosted,

  likeCount,
  commentCount,
  initialIsLiked = false,

  communityName,
  communityPicture,

  className,
  ...props
}: PostProps & React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const [userLike, setUserLike] = useState<1 | -1 | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(likeCount);

  /* ============================================================
     LOAD LIKE COUNT + STATUS
  ============================================================= */
  useEffect(() => {
    async function load() {
      try {
        const count = await getLikeCount(postId, source);
        const Like = await hasLiked(postId, source);

        setDisplayCount(count);
        setUserLike(Like);
      } catch {
        setDisplayCount(likeCount);
      }
    }

    load();
  }, [postId, source, likeCount]);

  /* ============================================================
     LIKE TOGGLE
  ============================================================= */
  async function handleToggleLike(likeType: 1 | -1) {
    const previousLike = userLike;
    try {
      const newLike = await toggleLike(postId, source, likeType);

      setUserLike(newLike);
      setDisplayCount((prev) => {
        // If toggling off, reverse the previous like
        if (newLike === null) return prev - previousLike!;
        // If switching likes, apply double the change (e.g. -1 to 1 = +2)
        if (previousLike !== null) return prev + likeType * 2;
        // New like
        return prev + likeType;
      });
    } catch {
      setUserLike(previousLike);
    }
  }

  /* ============================================================
     SAFE IMAGE FALLBACKS
  ============================================================= */
  const safeAvatarSrc =
    avatarPicture?.startsWith("http") || avatarPicture?.startsWith("/")
      ? avatarPicture
      : "/default-avatar.png";

  const safeCommunityPic =
    communityPicture?.startsWith("http") || communityPicture?.startsWith("/")
      ? communityPicture
      : "/default-community.png";

  /* ============================================================
     CARD CLICK → NAVIGATE TO POST
  ============================================================= */
  function handleCardClick() {
    navigate(`/post/${postId}`);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card
        className={cn("bg-card text-foreground cursor-pointer", className)}
        onClick={handleCardClick}
        {...props}
      >
        {/* COMMUNITY BADGE */}
        {source === "community" && communityName && (
          <div
            className="flex items-center gap-3 px-5 pt-4 pb-2"
            onClick={(e) => {
              e.stopPropagation();
              if (communityId) navigate(`/community/${communityId}`);
            }}
          >
            <img
              src={safeCommunityPic}
              onError={(e) => (e.currentTarget.src = "/default-community.png")}
              className="w-6 h-6 rounded-md object-cover"
            />
            <span className="text-sm font-medium">{communityName}</span>
          </div>
        )}

        <CardTitle>
          <div className="flex items-center justify-between gap-5 px-5 pt-4">
            <div className="flex items-center gap-5">
              <Avatar
                size="lgr"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile`);
                }}
              >
                <AvatarImage
                  src={safeAvatarSrc}
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
                <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>

              <span className="text-xl">{username}</span>
            </div>

            <span className="text-sm text-muted-foreground">{formatTimestamp(timePosted)}</span>
          </div>

          <Separator className="mt-4" />
        </CardTitle>

        <CardContent>
          <p className="text-lg px-5 py-3">{postContent}</p>
        </CardContent>

        <CardFooter>
          <div className="flex items-center gap-5 px-5 pb-4">
            {/* LIKE BUTTONS */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex items-center gap-1"
            >
              <Toggle
                variant="outline"
                pressed={userLike === 1}
                onPressedChange={() => handleToggleLike(1)}
              >
                <img
                  src={supabase.storage.from("assets").getPublicUrl("voting/upvote.png").data.publicUrl}
                  alt="Upvote"
                  className={`w-4 h-4 ${userLike === 1 ? "opacity-100" : "opacity-50"}`}
                />
              </Toggle>

              <span>{displayCount}</span>

              <Toggle
                variant="outline"
                pressed={userLike === -1}
                onPressedChange={() => handleToggleLike(-1)}
              >
                <img
                  src={supabase.storage.from("assets").getPublicUrl("voting/downvote.png").data.publicUrl}
                  alt="Downvote"
                  className={`w-4 h-4 ${userLike === -1 ? "opacity-100" : "opacity-50"}`}
                />
              </Toggle>
            </div>

            {/* COMMENT BUTTON */}
            <Button
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${postId}`);
              }}
            >
              Comment {commentCount}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
