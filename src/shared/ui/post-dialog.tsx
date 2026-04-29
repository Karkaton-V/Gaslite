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

// using the shadcn dialog page for help

export function PostDialog() {
    return (
        <Dialog>
            <form>
            {/* think this determines what actually opens the dialog
            in this case, it's a button */}
                <DialogTrigger asChild>
                    <Button variant="outline">New Post</Button>
                </DialogTrigger>
                
                <DialogContent className = "sm:max-w-sm">

                    <DialogHeader>
                        <DialogTitle>New Post</DialogTitle>
                    </DialogHeader>

                    <Textarea placeholder="Gaslite us!" />
                    <Button>Send Post</Button>
                </DialogContent>
            </form>
        </Dialog>



    )
}