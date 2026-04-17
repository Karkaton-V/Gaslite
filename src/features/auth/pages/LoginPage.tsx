import { useState } from "react";
import { supabase } from "@/shared/lib/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Card className="w-full max-w-md p-6 space-y-4 bg-card text-card-foreground">
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
