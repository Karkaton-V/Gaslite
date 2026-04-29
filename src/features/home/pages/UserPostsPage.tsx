import { Post } from "@/shared/ui/post";
import BottomNav from "@/shared/ui/BottomNav";

export default function UserPostsPage() {
  return (
    <>
      <div className="min-h-screen bg-background p-8 pb-24 text-foreground">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Recommended</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your recommended user posts.
          </p>
        </div>

        <Post
          username="Followed User"
          avatarPicture="./assets/kingBoo.png"
          postContent="Hello! You follow me!"
          likeCount={420}
          commentCount={69}
        />
      </div>

      <BottomNav />
    </>
  );
}
