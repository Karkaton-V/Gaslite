import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase/client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import BottomNav from "@/shared/ui/BottomNav";

export default function CreateCommunityPage() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [picture, setPicture] = useState<File | null>(null);

  // UX state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * Handles community creation:
   * 1. Validates input
   * 2. Uploads picture (optional)
   * 3. Inserts new community row
   * 4. Redirects to the new community page
   */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Community name is required.");
      return;
    }

    setLoading(true);

    let pictureUrl: string | null = null;

    /**
     * Upload picture to Supabase Storage.
     * Stored under: community-pictures/public/<timestamp>
     */
    if (picture) {
      const fileName = `community-${Date.now()}`;

      const { error: uploadErr } = await supabase.storage
        .from("community-pictures")
        .upload(`public/${fileName}`, picture);

      if (uploadErr) {
        setErrorMsg("Failed to upload picture.");
        setLoading(false);
        return;
      }

      // Convert storage path → public URL
      const { data: publicUrl } = supabase.storage
        .from("community-pictures")
        .getPublicUrl(`public/${fileName}`);

      pictureUrl = publicUrl.publicUrl;
    }

    /**
     * Insert the new community.
     * follower_count starts at 0 — triggers will update it later.
     */
    const { data, error } = await supabase
      .from("communities")
      .insert({
        name,
        picture: pictureUrl,
        follower_count: 0,
      })
      .select()
      .single();

    if (error) {
      setErrorMsg("Failed to create community.");
      setLoading(false);
      return;
    }

    // Navigate to the new community page
    navigate(`/community/${data.id}`);
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        <h1 className="text-3xl font-bold">Create a Community</h1>

        <Card className="p-4 space-y-4">
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Error message */}
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            {/* Community name input */}
            <div>
              <label className="text-sm font-medium">Community Name</label>
              <Input
                placeholder="e.g. Gaming, Fitness, Cooking"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Optional picture upload */}
            <div>
              <label className="text-sm font-medium">Community Picture</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files?.[0] || null)}
              />
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Community"}
            </Button>
          </form>
        </Card>
      </div>

      <BottomNav />
    </>
  );
}
