import BottomNav from "@/shared/ui/BottomNav";
import { Button } from "@/shared/ui/button";
import { useEffect, useState } from "react";
import {
  getDisplayName,
  getHandle,
  getAvatar,
} from "@/features/auth/api/user/userFunctions";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  async function handleSettingsPage() {
    navigate("/usersettings");
  }

  // user info vars
  const [displayName, setDisplayname] = useState("");
  const [handle, setHandle] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);

  // set up useEffect to call async functions
  useEffect(() => {
    async function loadProfileData() {
      try {
        const [disp, hand, avat] = await Promise.all([
          getDisplayName(),
          getHandle(),
          getAvatar(),
        ]);
        setDisplayname(disp ?? "");
        setHandle(hand ?? "");
        setAvatar(avat ?? "");
      } catch (err: any) {
        setError(err.message ?? "Profile load failed");
      }
    }
    // call loadProfileData()
    loadProfileData();
  }, []);

  return (
    <>
      {/* header */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your profile, {displayName}
          </p>
        </div>

        {/* settings button */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSettingsPage}>
            Settings
          </Button>
        </div>
      </div>

      {/* user info section */}
      <div className="min-h-screen bg-background p-8 pb-24 text-foreground items-center">
        <Avatar size="lgr" className="ml-5">
          <AvatarImage src={avatar} />
        </Avatar>
        <h1 className="text-2xl">Display name: {displayName}</h1>
        <h1 className="text-2xl">Handle: {handle}</h1>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <BottomNav />
    </>
  );
}
