import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllCommunities,
  subscribeToCommunityFollowers,
} from "../../auth/api/communities/communityFunctions";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import BottomNav from "@/shared/ui/BottomNav";

export default function CommunitiesDirectoryPage() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCommunities() {
    setLoading(true);

    const { data, error } = await getAllCommunities();
    if (!error && data) setCommunities(data);

    setLoading(false);
  }

  useEffect(() => {
    loadCommunities();

    const unsubscribe = subscribeToCommunityFollowers(() => {
      loadCommunities();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Communities</h1>

          <Button onClick={() => navigate("/communities/create")}>
            Create
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading communities…</p>
        ) : communities.length === 0 ? (
          <p className="text-muted-foreground">No communities yet.</p>
        ) : (
          <div className="space-y-3">
            {communities.map((c) => (
              <Card
                key={c.id}
                className="p-4 flex items-center justify-between hover:bg-accent"
              >
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

      <BottomNav />
    </>
  );
}
