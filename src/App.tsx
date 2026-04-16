import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Post } from "./components/ui/post"

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className = "min-h screen bg-background p-8 text-foreground">
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

  )
}