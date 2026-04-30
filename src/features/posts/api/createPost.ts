import { supabase } from "@/shared/lib/supabase/client";


// type block to help with data 
// image is a string, because ideally it would point towards a storage location for the image
type createPostInfo = {
    content: string;
    image?: string | null;
}


// helper function to add posts to database
export async function createPost(input: createPostInfo) {

    // grab auth data from supabase and check if logged in
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || authData.user == null) throw new Error("Must be logged in");

    // trim content and check for null to avoid shenanigans
    const postContent = input.content.trim();
    if (postContent == null || postContent == "") throw new Error("Post content cannot be empty!");

    // check post length
    if (postContent.length > 250) throw new Error("Posts are limited to 250 characters");

    // grab user id
    const userId = authData.user.id;

    // insert into db
    const { data, error } = await supabase
        .from('user_posts')
        .insert({
            user_id: userId,
            content: postContent,
            image: input.image ?? null,
        })
        .select()
        .single();
    
    if (error) throw error;
    return data;
}