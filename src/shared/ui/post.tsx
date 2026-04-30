import { useState } from "react"
import { Card, CardTitle, CardContent, CardFooter } from "@/shared/ui/card"
import { Avatar, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Toggle } from "@/shared/ui/toggle"
import { Separator } from "@/shared/ui/separator"
import { cn } from "@/shared/lib/utils/index"
import { HeartIcon } from "@phosphor-icons/react"
// import { Comment } from "@wherever/it/gets/put"


{/*
  TODO:
  1. make posts get properly pulled/displayed from db
  2. implement proper like functionality
  3. implement proper comment functionality
*/}


// prop block can be used to define "arguments" for the component
// prop/type block lets me define var names as well as types
// props are supposed to be used for data that doesn't change throughout the lifetime of the object/component

type PostProps = {
    username: string
    postContent: string
    likeCount: number
    commentCount: number
    avatarPicture: string
    // note: these will be pulled from database in the future, for now, we will be hardcoding test data
}


export function Post({ 
    // this block declares the "arguments"
    // the ": PostProps" at the end of the block shows where the definitions for these vars are
    username,
    postContent,
    likeCount,
    commentCount,
    avatarPicture,
    className,
    // commentData,
    ...props
    }: PostProps & React.ComponentProps<"div">) {

    // use states for data that is changed during the lifespan of an object
    const [isLiked, setIsLiked] = useState(false)

    // this line sets likeCount based on the state of "isLiked"
    // if "isLiked" is true, add 1, otherwise add 0
    const displayCount = likeCount + (isLiked ? 1 : 0)

    // this line does the same, but for the button text
    const likeText = "Like" + (isLiked ? "d" : "")

    // inside the return statement is where all the component code goes
    return (

    // className can be used to define properties of the object
    // className "variables" can be found in tailwindCSS docs
    <div className = "w-1/2 mx-auto"> 
    <Card className = {cn("bg-card text-muted-foreground", className)} {...props} >
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
            <Toggle variant = "outline" pressed = {isLiked} onPressedChange = {setIsLiked} >
                <HeartIcon 
                    weight = {isLiked ? "fill" : "regular"}
                    className = {isLiked ? "text-muted-foreground" : undefined} 
                    />
                {likeText} {displayCount} 
            </Toggle>
            <Button variant = "default"> Comment {commentCount} </Button>
            </div>
        </CardFooter>
    </Card>
    </div>
  )
}
