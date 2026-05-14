import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";

import {
  createCommunityPost,
  createUserPost,
} from "@/features/auth/api/posts/postFunctions";

export function PostDialog({ communityId }: { communityId?: string }) {
  const [postText, setPostText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      setIsPosting(true);

      if (communityId) {
        await createCommunityPost(communityId, postText);
      } else {
        await createUserPost(postText);
      }
      // Notify feed pages
      window.dispatchEvent(new CustomEvent("post_created"));

      setPostText("");
      setIsDialogOpen(false);
    } catch (error: any) {
      setErrorMsg(error.message ?? "Failed to post");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (open) setErrorMsg(null);
      }}
    >
      <DialogTrigger asChild>
        <Button>New Post</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl min-h-[30vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-1 text-xl text-foreground">
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Share something with the community…"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="min-h-40"
          />

          {errorMsg && (
            <p className="mt-2 text-sm text-destructive">{errorMsg}</p>
          )}

          <DialogFooter>
            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={isPosting} size="lg">
                {isPosting ? "Posting..." : "Send Post"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
