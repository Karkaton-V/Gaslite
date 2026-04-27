import { useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

export default function LoginPage() {
  // React Router navigation hook
  const navigate = useNavigate();

  // Local state for form fields and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handles the login form submission
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // Prevents page reload
    setError(""); // Clear previous errors

    // Supabase password-based login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If Supabase returns an error, show it to the user
    if (error) {
      setError(error.message);
      return;
    }

    // On success, redirect to dashboard
    navigate("/dashboard");
  }

  return (
    // Full-screen centered layout with theme-aware background + text
    <div className="flex items-center justify-center min-h-screen p-4 bg-background text-foreground">
      {/* Card container for the login form */}
      <Card className="w-full max-w-md p-6 space-y-4 bg-card text-card-foreground">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label>Email</Label>
            {/* Controlled input for email */}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            {/* Controlled input for password */}
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
            Sign In
          </Button>
        </form>

        {/* Link to registration page */}
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        {/* Link to forgot password page */}
        <p className="text-center text-sm">
          Forgot Password?{" "}
          <Link to="/reset-password" className="text-blue-600 hover:underline">
            Reset Password
          </Link>
        </p>
      </Card>
    </div>
  );
}
