import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Centralized API functions for communities
import {
  getAllCommunities,
  subscribeToCommunityFollowers,
} from "../../auth/api/communities/communityFunctions";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import BottomNav from "@/shared/ui/BottomNav";

export default function CommunitiesDirectoryPage() {
  const navigate = useNavigate();

  // List of all communities displayed on the page
  const [communities, setCommunities] = useState<any[]>([]);

  // Controls loading state for initial fetch + realtime refresh
  const [loading, setLoading] = useState(true);

  /**
   * Loads all communities from the database.
   * Sorted by follower_count (handled in the API function).
   */
  async function loadCommunities() {
    setLoading(true);

    const { data, error } = await getAllCommunities();
    if (!error && data) setCommunities(data);

    setLoading(false);
  }

  /**
   * Initial load + realtime subscription.
   * Whenever someone follows/unfollows a community,
   * the follower_count changes and we reload the list.
   */
  useEffect(() => {
    loadCommunities();

    // Subscribe to follower changes (INSERT/DELETE on community_followers)
    const unsubscribe = subscribeToCommunityFollowers(() => {
      loadCommunities();
    });

    // Cleanup: remove realtime channel
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Header: title + create button */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Communities</h1>

          <Button onClick={() => navigate("/communities/create")}>
            Create
          </Button>
        </div>

        {/* Loading state */}
        {loading ? (
          <p className="text-muted-foreground">Loading communities…</p>
        ) : communities.length === 0 ? (
          // Empty state
          <p className="text-muted-foreground">No communities yet.</p>
        ) : (
          // Community list
          <div className="space-y-3">
            {communities.map((c) => (
              <Card
                key={c.id}
                className="p-4 flex items-center justify-between hover:bg-accent"
              >
                {/* Left side: picture + name + follower count */}
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/community/${c.id}`)}
                >
                  <img
                    src={c.picture || "/default-community.png"}
                    onError={(e) =>
                      (e.currentTarget.src = "/default-community.png")
                    }
                    className="w-12 h-12 rounded-md object-cover"
                  />

                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.follower_count} followers
                    </p>
                  </div>
                </div>

                {/* Right side: explicit view button */}
                <Button
                  variant="outline"
                  onClick={() => navigate(`/community/${c.id}`)}
                >
                  View
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <BottomNav />
    </>
  );
}
