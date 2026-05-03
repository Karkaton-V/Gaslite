import { supabase } from "@/shared/lib/supabase/client";
import { Post } from "@/shared/ui/post";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { PostDialog } from "@/shared/ui/post-dialog";
import BottomNav from "@/shared/ui/BottomNav";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl("default/default.png");

  const picture = data.publicUrl || "/default-avatar.png";

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <>
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PostDialog />
          <Button variant="outline" onClick={() => navigate("/messages")}>
            Messages
          </Button>
          <Button variant="outline" onClick={() => navigate("/usersettings")}>
            Settings
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="min-h-screen bg-background p-8 pb-24 text-foreground">
        <Post
          username="alyx"
          avatarPicture={picture}
          postContent="This is a test post component"
          likeCount={0}
          commentCount={0}
        />

        <br />

        <Post
          username="user123"
          avatarPicture="/default-avatar.png"
          postContent="Hello world!"
          likeCount={0}
          commentCount={0}
        />

        <br />

        <Post
          username="Karkaton"
          avatarPicture="/default-avatar.png"
          postContent="Another test post"
          likeCount={0}
          commentCount={0}
        />
      </div>

      <BottomNav />
    </>
  );
}
