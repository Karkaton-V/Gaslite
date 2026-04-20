import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import BottomNav, { type NavTab } from "@/components/ui/BottomNav"

const posts = [
  {
    id: 1,
    author: "Niko K",
    community: "webdev",
    time: "2h ago",
    content:
      "Test 1",
  },
  {
    id: 2,
    author: "User 2",
    community: "gaming",
    time: "4h ago",
    content:
      "Test 2",
  },
  {
    id: 3,
    author: "USer 3",
    community: "campus",
    time: "6h ago",
    content:
      "Test 3",
  },
]

function FeedView() {
  return (
    <section className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="border-border/70">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{post.author}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  c/{post.community}
                </p>
              </div>

              <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                {post.time}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm leading-7 sm:text-base">{post.content}</p>

            <div className="flex flex-wrap gap-2">
              <Button size="sm">Like</Button>
              <Button size="sm">Comment</Button>
              <Button size="sm">Share</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

function CommunitiesView() {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Communities</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <Input placeholder="Search communities..." />

        <p className="text-sm text-muted-foreground">
          Joined communities will appear here.
        </p>
      </CardContent>
    </Card>
  )
}

function ProfileView() {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          User profile page placeholder.
        </p>

        <Button>Edit Profile</Button>
      </CardContent>
    </Card>
  )
}

function HomeView() {
  return (
    <Card className ="border-border/70">
      <CardHeader>
        <CardTitle>Home Dashboard</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Welcome to Gaslite.
        </p>

        <Button onClick={() => alert("This will work later")}>
          Quick Action
        </Button>
      </CardContent>
    </Card>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("home")

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 text-foreground">
      <main className="mx-auto max-w-3xl pb-24">
        <header className="mb-6 flex items center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("home")}
          >
            Home
          </Button>

          <h1 className="text-3xl font-bold">Gaslite</h1>

          <div className="w-16"></div>
        </header>

        {activeTab === "home" && <HomeView />}
        {activeTab === "feed" && <FeedView />}
        {activeTab === "communities" && <CommunitiesView />}
        {activeTab === "profile" && <ProfileView />}
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}