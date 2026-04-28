import { supabase } from "@/shared/lib/supabase/client";
import { Post } from "@/shared/ui/post";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import  BottomNav  from "@/shared/ui/BottomNav"

export default function DashboardPage() {
  const navigate = useNavigate();

  // Handles Supabase logout
  async function handleLogout() {
    await supabase.auth.signOut(); // <-- must include parentheses
    navigate("/login");
  }

  return (
    <>
      {/* Header section */}
      <div className="p-6 flex items-center justify-between">
        {/* Left side: title + subtitle */}
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your dashboard.
          </p>
        </div>

        {/* Right side: logout button */}
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Post section */}
      <div className="min-h-screen bg-muted p-8 pb-24 text-foreground">
        <Post
          username="alyx"
          avatarPicture="./assets/druski.png"
          postContent="This is a test post component"
          likeCount={0}
          commentCount={0}
        />
        <br />
        <Post
          username="user123"
          avatarPicture="./assets/default.png"
          postContent="Hello world!"
          likeCount={0}
          commentCount={0}
        />
        <br />
        <Post
          username="Karkaton"
          avatarPicture="./assets/default.png"
          postContent="Another test post"
          likeCount={0}
          commentCount={0}
        />
      </div>

      <BottomNav />
    </>
  );
}
