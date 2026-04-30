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
{
  /* TODO:
    add functionality to buttons
    fix styling
    */
}

export default function UserSettingsPage() {
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-background items-center p-8 pb-24 text-foreground space-y-4">
        <Button variant="outline">Change User Handle</Button>
        <Button variant="outline">Change Display Name</Button>
        <Button variant="outline">Change Avatar</Button>
        <Button variant="outline">Change Password</Button>

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
