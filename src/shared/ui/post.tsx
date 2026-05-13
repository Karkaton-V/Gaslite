import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Toggle } from "@/shared/ui/toggle";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { HeartIcon } from "@phosphor-icons/react";

import {
  toggleLike,
  getLikeCount,
  hasLiked,
} from "@/features/auth/api/posts/postFunctions";

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

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [displayCount, setDisplayCount] = useState<number>(likeCount);

  /* ============================================================
     LOAD LIKE COUNT + STATUS
  ============================================================= */
  useEffect(() => {
    async function load() {
      try {
        const count = await getLikeCount(postId, source);
        const liked = await hasLiked(postId, source);

        setDisplayCount(count);
        setIsLiked(liked);
      } catch {
        setDisplayCount(likeCount);
      }
    }

    load();
  }, [postId, source, likeCount]);

  /* ============================================================
     LIKE TOGGLE
  ============================================================= */
  async function handleToggleLike(pressed: boolean) {
    try {
      const nowLiked = await toggleLike(postId, source);

      setIsLiked(nowLiked);
      setDisplayCount((prev) => (nowLiked ? prev + 1 : prev - 1));
    } catch {
      setIsLiked(!pressed);
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
          <div className="flex items-center gap-5 px-5 pt-4">
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

          <Separator className="mt-4" />
        </CardTitle>

        <CardContent>
          <p className="text-lg px-5 py-3">{postContent}</p>
        </CardContent>

        <CardFooter>
          <div className="flex items-center gap-5 px-5 pb-4">
            {/* LIKE BUTTON */}
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Toggle
                variant="outline"
                pressed={isLiked}
                onPressedChange={handleToggleLike}
              >
                <HeartIcon
                  weight={isLiked ? "fill" : "regular"}
                  className={isLiked ? "text-red-500" : undefined}
                />
                {displayCount}
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
