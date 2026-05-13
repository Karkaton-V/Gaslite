import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

import { resetPassword } from "../api/user/userFunctions";

export default function PasswordResetPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await resetPassword(email);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Card className="w-full max-w-md p-6 space-y-4 bg-card text-card-foreground">
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label>Email Registered to Account</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <Button type="submit" className="w-full bg-green-600">
            Reset Password
          </Button>
        </form>

        <p className="text-center text-sm">
          Head Back?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
