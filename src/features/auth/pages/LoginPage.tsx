import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

import { loginUser } from "../api/user/userFunctions";

export default function LoginPage() {
  const navigate = useNavigate();

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await loginUser(email, password);

    if (error) {
      setErrorMsg(error.message);
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

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <Button type="submit" className="w-full bg-green-600">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-center text-sm">
          Forgot Password?{" "}
          <Link to="/passwordreset" className="text-blue-600 hover:underline">
            Reset Password
          </Link>
        </p>
      </Card>
    </div>
  );
}
