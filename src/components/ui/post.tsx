import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { HeartIcon } from "@phosphor-icons/react"

// prop block can be used to define "arguments" for the component
// prop/type block lets me define var names as well as types
type PostProps = {
    username: string
    postContent: string
    likeCount: number
    commentCount: number
    avatarPicture: string
    // note: these will be pulled from database in the future, for now, we will be hardcoding test data
}

function Post({ 
    // this block declares the "arguments"
    // the ": PostProps" at the end of the block shows where the definitions for these vars are
    username,
    postContent,
    likeCount,
    commentCount,
    avatarPicture,
    className,
    ...props
    }: PostProps & React.ComponentProps<"div">) {
  return (


    <div className = "w-1/2 mx-auto">
    <Card className={cn("bg-card text-card-foreground", className)} {...props} >
            <CardTitle> 
                <div className = "flex items-center gap-5">
                <Avatar size = "lgr" className = "ml-5">
                     <AvatarImage src = {avatarPicture} /> {/* passes avatarPicture as the avatar image */}
                </Avatar>
                <span className = "text-xl"> {username} </span>
                </div>
                <br />
                <Separator />
            </CardTitle>
            <CardContent>

            <span className = "text-lg"> {postContent} </span>

            </CardContent>
        <CardFooter>
            <div className = "flex items-center gap-5">
            <Toggle variant = "outline">
                <HeartIcon className = "group-data-[state-on]/toggle:weight=fill" />
                Like {likeCount} 
            </Toggle>
            <Button variant = "outline"> Comment {commentCount} </Button>
            </div>
        </CardFooter>
    </Card>
    </div>
  )
}

export { Post }