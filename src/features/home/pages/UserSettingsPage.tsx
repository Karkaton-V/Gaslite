import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/shared/ui/BottomNav";
import { supabase } from "@/shared/lib/supabase/client";
// ShadCN AlertDialog components
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
  DialogDescription,
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
  getAvatar,
  updateDisplayName,
  updateHandle,
  updateAvatar,
} from "../../auth/api/user/userFunctions.ts";
{
  /* TODO:
    add functionality to buttons
    fix styling
    */
}

export default function UserSettingsPage() {
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleDeleteProfile() {
    const { data, error } = await supabase.rpc("delete_user");

    console.log("RPC data:", data);
    console.error("RPC error:", error);

    // const { error } = await supabase.rpc("delete_user");

    // if (error) {
    //   console.error("Error deleting profile:", error);
    //   return;
    // }

    navigate("/register");
  }

  // this function is used on form submit
  async function handleProfileChange(event) {
    event.preventDefault();
    // grab form object
    const form = event.currentTarget;
    const formdata = new FormData(form);

    // grab data from objects inside form
    const newDisplayName = String(formdata.get("displayNameInput") ?? "");
    const newHandle = String(formdata.get("userHandleInput") ?? "");

    // use data to update profile
    // error checking
    if (newDisplayName == "" || newHandle == "") {
      setErrorMsg("Inputs cannot be empty");
      return;
    }

    try {
      await updateDisplayName(newDisplayName);
      await updateHandle(newHandle);
      setIsSettingsOpen(false);
    } catch (error: any) {
      setErrorMsg(error.message ?? "Failed to update settings");
    }
  }

  return (
    <>
      {/* header section*/}
      <div className="p-6 flex items-center justify-between">
        {/* on the left: page title */}
        <div>
          <h1 className="text-3xl font-semibold">User Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Settings page coming soon.
          </p>
        </div>
      </div>

      {/* "main" section */}
      <div className="flex flex-col min-h-screen bg-background items-center p-8 pb-24 text-foreground gap-4">
        {/* build dialogs for each of these buttons */}
        {/*}
        <Button variant="outline">Change User Handle</Button>
        <Button variant="outline">Change Display Name</Button>
        <Button variant="outline">Change Avatar</Button>
        <Button variant="outline">Change Password</Button>
        */}

        {/* Change user settings; start by setting vars on dialog open */}
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
                {/* display name field */}
                <Field>
                  <Label>Display Name</Label>
                  <Input id="dn" name="displayNameInput" />
                </Field>

                {/* user handle field */}
                <Field>
                  <Label>User Handle</Label>
                  <Input id="h" name="userHandleInput" />
                </Field>
              </FieldGroup>

              {/* show error if needed */}
              {errorMsg && (
                <p className="mt-2 text-sm text-destructive"> {errorMsg} </p>
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

        {/*Delete Profile With Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className=" bg-red-600  text-foreground "
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
              <AlertDialogCancel className="bg-green-600">
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

      {/* bottom nav bar */}
      <BottomNav />
    </>
  );
}
