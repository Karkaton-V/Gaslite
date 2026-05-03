import { useState } from "react";
import { Card, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Toggle } from "@/shared/ui/toggle";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils/index";
import { HeartIcon } from "@phosphor-icons/react";

type PostProps = {
  username: string;
  postContent: string;
  likeCount: number;
  commentCount: number;
  avatarPicture: string;
};

export function Post({
  username,
  postContent,
  likeCount,
  commentCount,
  avatarPicture,
  className,
  ...props
}: PostProps & React.ComponentProps<"div">) {
  const [isLiked, setIsLiked] = useState(false);

  const displayCount = likeCount + (isLiked ? 1 : 0);
  const likeText = "Like" + (isLiked ? "d" : "");

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
              onPressedChange={setIsLiked}
            >
              <HeartIcon
                weight={isLiked ? "fill" : "regular"}
                className={isLiked ? "text-muted-foreground" : undefined}
              />
              {likeText} {displayCount}
            </Toggle>

            <Button variant="default">Comment {commentCount}</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
