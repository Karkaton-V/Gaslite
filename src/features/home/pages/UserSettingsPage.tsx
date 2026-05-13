import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "@/shared/ui/BottomNav";
import { Button } from "@/shared/ui/button";
import { supabase } from "@/shared/lib/supabase/client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui/alert-dialog";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { Field, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import {
  getDisplayName,
  getHandle,
  updateDisplayName,
  updateHandle,
} from "@/features/auth/api/user/userFunctions";

export default function UserSettingsPage() {
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [disp, hand] = await Promise.all([getDisplayName(), getHandle()]);
        setDisplayName(disp ?? "");
        setHandle(hand ?? "");
      } catch (err: any) {
        setErrorMsg(err.message ?? "Failed to load profile");
      }
    }

    loadProfile();
  }, []);

  async function handleDeleteProfile() {
    const { error } = await supabase.rpc("delete_user");

    if (error) {
      console.error("Error deleting profile:", error);
      setErrorMsg("Failed to delete profile. Please try again.");
      return;
    }

    navigate("/register");
  }

  async function handleProfileChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    const form = event.currentTarget;
    const formdata = new FormData(form);

    const newDisplayName = String(
      formdata.get("displayNameInput") ?? "",
    ).trim();
    const newHandle = String(formdata.get("userHandleInput") ?? "").trim();

    if (!newDisplayName || !newHandle) {
      setErrorMsg("Inputs cannot be empty");
      return;
    }

    try {
      await updateDisplayName(newDisplayName);
      await updateHandle(newHandle);
      setDisplayName(newDisplayName);
      setHandle(newHandle);
      setIsSettingsOpen(false);
    } catch (error: any) {
      setErrorMsg(error.message ?? "Failed to update settings");
    }
  }

  return (
    <>
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">User Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile and account.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col min-h-screen bg-background items-center p-8 pb-24 text-foreground gap-4">
        {/* Edit profile dialog */}
        <Dialog
          open={isSettingsOpen}
          onOpenChange={(onNextOpen) => {
            setIsSettingsOpen(onNextOpen);
            if (onNextOpen) setErrorMsg(null);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Change User Settings</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleProfileChange}
            >
              <DialogHeader className="space-y-1 text-xl text-foreground">
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="displayNameInput">Display Name</Label>
                  <Input
                    id="displayNameInput"
                    name="displayNameInput"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Field>

                <Field>
                  <Label htmlFor="userHandleInput">User Handle</Label>
                  <Input
                    id="userHandleInput"
                    name="userHandleInput"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                  />
                </Field>
              </FieldGroup>

              {errorMsg && (
                <p className="mt-2 text-sm text-destructive">{errorMsg}</p>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete profile with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 text-foreground hover:bg-red-700"
            >
              DELETE PROFILE
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent. All your data will be deleted and
                cannot be recovered.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-green-600 hover:bg-green-700">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteProfile}
              >
                Yes, delete my profile
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <BottomNav />
    </>
  );
}
