import { supabase } from "@/shared/lib/supabase/client"

// type block might be deleted in the future if unused
type likePostInfo = {
    postId: string,
    userId: string
}

export async function likePost() {

    /*
        TODO:
        This function should grab auth data from supabase and verify
        Then it grabs the user id and post id
        Then it updates the liked posts table using the post ID and user ID
        See createPost.ts for examples
    */
}


export async function unlikePost() {

    /*
        TODO:
        This function should behave similarly to likePost()
        The difference is instead of adding a row to the table, it deletes the row
        Must be very careful to delete only the correct row!
    */
}