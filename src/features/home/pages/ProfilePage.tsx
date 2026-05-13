import BottomNav from "@/shared/ui/BottomNav";
import { Button } from "@/shared/ui/button";
import { useEffect, useState } from "react";
import {
  getDisplayName,
  getHandle,
  getAvatar,
} from "@/features/auth/api/user/userFunctions";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSettingsPage() {
    navigate("/usersettings");
  }

  /**
   * Load profile data on mount
   */
  useEffect(() => {
    async function loadProfileData() {
      try {
        const [disp, hand, avat] = await Promise.all([
          getDisplayName(),
          getHandle(),
          getAvatar(),
        ]);

        setDisplayName(disp ?? "");
        setHandle(hand ?? "");
        setAvatar(avat ?? null);
      } catch (err: any) {
        setError(err.message ?? "Profile load failed");
      }
    }

    loadProfileData();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your profile, {displayName}
          </p>
        </div>

        <Button variant="outline" onClick={handleSettingsPage}>
          Settings
        </Button>
      </div>

      {/* Profile Info */}
      <div className="min-h-screen bg-background p-8 pb-24 text-foreground space-y-4">
        <Avatar size="lgr" className="ml-5">
          <AvatarImage src={avatar ?? undefined} />
          <AvatarFallback>
            {displayName ? displayName[0].toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-2xl">Display name: {displayName}</h1>
        <h1 className="text-2xl">Handle: {handle}</h1>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <BottomNav />
    </>
  );
}
