import { Post } from "@/shared/ui/post"

export default function DashboardPage() {
  return (
  <>
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to your dashboard.</p>
    </div>

    <div className = "min-h-screen bg-muted p-8 text-foreground">
      <Post
       username = "alyx"
       avatarPicture = "./assets/druski.png"
       postContent = "This is a test post component"
       likeCount = {0}
       commentCount = {0}
      />
      <br />
      <Post
        username = "user123"
        avatarPicture = "./assets/default.png"
        postContent = "Hello world!"
        likeCount = {0}
        commentCount = {0}
      />
      <br />
      <Post
        username = "Karkaton"
        avatarPicture = "./assets/default.png"
        postContent = "Another test post"
        likeCount = {0}
        commentCount = {0}
      />
    </div>
  </>
  );
}
