import { useState, useEffect } from "react"
import { Button } from "@/shared/ui/button"
import { Dialog,
         DialogClose, 
         DialogContent, 
         DialogDescription, 
         DialogFooter, 
         DialogHeader,
         DialogTitle,
         DialogTrigger
       } from "@/shared/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field"
import { Textarea } from "@/shared/ui/textarea"
import { cn } from "@/shared/lib/utils/index"
import { supabase } from "@/shared/lib/supabase/client";
import { createPost } from "@/features/posts/api/createPost";

// using the shadcn dialog page for help

export function PostDialog() {
    // vars to help submit data to db and to close dialog after post is sent
    // var isPosting and errorMsg used to help indicate status to user
    const [postText, setPostText] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    return (

        // set errorsmg to null when dialog box opens
        <Dialog open = {isDialogOpen}
            onOpenChange = {(onNextOpen) => {
                setIsDialogOpen(onNextOpen);
                if (onNextOpen) setErrorMsg(null);
            }}          
        >
            {/* DialogTrigger determines what actually opens the dialog
            in this case, it's a button */}
                <DialogTrigger asChild>
                    <Button variant="outline">New Post</Button>
                </DialogTrigger>
                
                <DialogContent className = "sm:max-w-2xl min-h-[30vh] overflow-y-auto">

                    <form className = "space-y-4"
                        /* marking as form designates that data will be stored/sent
                            onSubmit: triggers when components within form are closed
                            onSubmit will prevent browser refresh and handle sending data to db*/
                        onSubmit = {async (event) => {
                            event.preventDefault();
                            setErrorMsg(null);
                            /*
                            try/catch/finally block to trigger functions properly
                            */
                            try {
                                setIsPosting(true);
                                await createPost({
                                    content: postText,
                                });
                                setPostText("");
                                setIsDialogOpen(false);
                            } catch (error: any) {
                                setErrorMsg(error.message ?? "Failed to post");
                            } finally {
                                setIsPosting(false);
                            }
                        }}
                    >
                        <DialogHeader className = "space-y-1 text-xl text-foreground">
                            <DialogTitle>New Post</DialogTitle>
                        </DialogHeader>

                        <Textarea 
                            /* placeholder: text that shows on empty textbox
                                value: used to store user text input
                                onChange: uses event handling to update value */
                            placeholder = "Gaslite us!"
                            value = {postText}
                            onChange = {(event) => setPostText(event.target.value)}
                            className = "min-h-40"
                        />
                        
                        {/* "wrapping" the errorMsg in the below statement allows for conditional rendering */}
                        
                        {errorMsg && (
                        <p className = "mt-2 text-sm text-destructive"> {errorMsg} </p>
                        )}

                        <DialogFooter>

                            <div className = "flex justify-end pt-1">
                                {/* button type "submit" tells it to submit the form */}
                                <Button type = "submit" disabled = {isPosting} size = "lg">
                                    {isPosting ? "Posting..." : "Send Post"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                    

                </DialogContent>
                
        </Dialog>
    )
}