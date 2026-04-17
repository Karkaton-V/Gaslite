import { useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

export default function RegisterPage() {
  // React Router navigation hook
  const navigate = useNavigate();

  // Controlled form state for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handles Supabase sign-up flow
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); // Prevents page reload
    setError(""); // Clear previous errors

    // Supabase sign-up request
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    // If Supabase returns an error, show it to the user
    if (error) {
      setError(error.message);
      return;
    }

    // On success, redirect to dashboard
    // (Note: Supabase may require email confirmation depending on project settings)
    navigate("/dashboard");
  }

  return (
    // Centered full-screen layout
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Card container for the registration form */}
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        {/* Registration form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label>Email</Label>
            {/* Controlled email input */}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            {/* Controlled password input */}
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          Already have an account{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
