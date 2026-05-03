import { useState } from "react";
import { Post } from "@/shared/ui/post";
import BottomNav from "@/shared/ui/BottomNav";

const posts = [
  {
    id: 1,
    username: "Followed User",
    avatarPicture: "/kingBoo.png",
    postContent: "Hello! You follow me!",
    likeCount: 420,
    commentCount: 69,
  },
  {
    id: 2,
    username: "Tech official",
    avatarPicture: "/default-avatar.png",
    postContent: "Welcome to LA Tech tweddit!",
    likeCount: 35,
    commentCount: 8,
  },
  {
    id: 3,
    username: "Kyle Prather",
    avatarPicture: "/druski.png",
    postContent: "Look who finally got work done!",
    likeCount: 67,
    commentCount: 0,
  },
];

export default function FollowingPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const filteredPosts = posts
    .filter((post) => {
      if (filterBy === "popular") return post.likeCount >= 100;
      if (filterBy === "comments") return post.commentCount > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "likes") return b.likeCount - a.likeCount;
      if (sortBy === "comments") return b.commentCount - a.commentCount;
      return b.id - a.id;
    });

  return (
    <>
      <div className="min-h-screen bg-background p-8 pb-24 text-foreground">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Recommended</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your recommended user posts.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="newest">Sort: Newest</option>
            <option value="likes">Sort: Most liked</option>
            <option value="comments">Sort: Most commented</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="all">Filter: All posts</option>
            <option value="popular">Filter: Popular posts</option>
            <option value="comments">Filter: Has comments</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Post
              key={post.id}
              username={post.username}
              avatarPicture={post.avatarPicture}
              postContent={post.postContent}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
