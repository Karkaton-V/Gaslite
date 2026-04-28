import { useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

export default function PasswordResetPage() {
  // React Router navigation hook
  const navigate = useNavigate();

  // Controlled form state for email and error
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Handles Supabase sign-up flow
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); // Prevents page reload
    setError(""); // Clear previous errors

    // Supabase sends a password-reset link to email
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    // If Supabase returns an error, show it to the user
    if (error) {
      setError(error.message);
      return;
    }

    // On success, redirect to dashboard
    navigate("/dashboard");
  }

  return (
    // Centered full-screen layout
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Card container for the registration form */}
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

        {/* Registration form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label>Email Registered to Account</Label>
            {/* Controlled email input */}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Error message display */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit button */}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        {/* Link to login page */}
        <p className="text-center text-sm">
          Head Back{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
