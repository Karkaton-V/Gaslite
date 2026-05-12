import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Toggle } from "@/shared/ui/toggle";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils/index";
import { HeartIcon } from "@phosphor-icons/react";
import {
  likePost,
  unlikePost,
  getLikeCount,
} from "@/features/auth/api/posts/postFunctions";

// initialIsLiked is used to keep track of whether or not you have already liked the post
// in pages that use the post component, this will be passed as a property
type PostProps = {
  username: string;
  postContent: string;
  likeCount: number;
  initialIsLiked?: boolean;
  commentCount: number;
  avatarPicture: string;
  timePosted: string;
  postId: string;
};

export function Post({
  username,
  postContent,
  likeCount,
  initialIsLiked,
  commentCount,
  avatarPicture,
  timePosted,
  postId,
  className,
  ...props
}: PostProps & React.ComponentProps<"div">) {
  // default to false if initialIsLiked doesn't exist
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const likeText = "Like" + (isLiked ? "d" : "");
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffect to load post likes
  // [postId] tells it to load based on the given postId to the object
  useEffect(() => {
    setIsLiked(initialIsLiked);
    // async arrow function allows usage of async functions
    (async () => {
      try {
        const likes = await getLikeCount(postId);
        setDisplayCount(likes);
      } catch {
        setDisplayCount(0);
      }
    })();
  }, [postId, initialIsLiked]);

  async function toggleLike(postId: string, isPressed: boolean) {
    // updates post likes in database
    // this function is triggered upon button toggle

    const nextState = !isLiked;
    setIsLiked(nextState); // update state

    // perform database action(s)
    try {
      if (isPressed) {
        await likePost(postId);
        setDisplayCount(displayCount + 1);
      } else {
        await unlikePost(postId);
        setDisplayCount(displayCount - 1);
      }
    } catch {
      setIsLiked(!isPressed);
    }
  }

  // --- SAFE AVATAR LOGIC ---
  // Ensures no relative paths ever break the UI.
  const safeAvatarSrc =
    avatarPicture?.startsWith("http") || avatarPicture?.startsWith("/")
      ? avatarPicture
      : "/default-avatar.png";

  return (
    <div className="w-1/2 mx-auto">
      <Card
        className={cn("bg-card text-muted-foreground", className)}
        {...props}
      >
        <CardTitle>
          <div className="flex items-center gap-5">
            <Avatar size="lgr" className="ml-5">
              <AvatarImage
                src={safeAvatarSrc}
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
              <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xl">{username}</span>
          </div>

          <br />
          <Separator />
        </CardTitle>

        <CardContent>
          <span className="text-lg">{postContent}</span>
        </CardContent>

        <CardFooter>
          <div className="flex items-center gap-5">
            <Toggle
              variant="outline"
              pressed={isLiked}
              onPressedChange={(pressed) => {
                void toggleLike(postId, pressed);
              }}
            >
              <HeartIcon
                weight={isLiked ? "fill" : "regular"}
                className={isLiked ? "text-muted-foreground" : undefined}
              />
              {likeText} {displayCount}
            </Toggle>

            <Button
              variant="default"
              onClick={() => navigate(`/post/${postId}`)}
            >
              Comment {commentCount}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
