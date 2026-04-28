
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import  BottomNav  from "@/shared/ui/BottomNav"


{/* TODO:
    add functionality to buttons
    fix styling
    */}

export default function UserSettingsPage() {
    const navigate = useNavigate();


    return (
        <>
        {/* header section*/}
        <div className = "p-6 flex items-center justify-between">
            {/* on the left: page title */}
            <div>
                <h1 className="text-3x1 font-semibold">User Settings</h1>
                <p className = "mt-2 text-muted-foreground">
                    Settings page coming soon.
                </p>
            </div>
        </div>

        {/* "main" section */}
        <div className="min-h-screen bg-muted items-center p-8 pb-24 text-foreground">
            <Button variant="outline">Change User Handle</Button>
            <Button variant="outline">Change Display Name</Button>
            <Button variant="outline">Change Avatar</Button>
            <Button variant="outline">Change Password</Button>
        </div>



        {/* bottom nav bar */}
        <BottomNav />
        </>
    )

}