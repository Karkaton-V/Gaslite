import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";

import { registerUser } from "../api/user/userFunctions";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const { error } = await registerUser(email, password, username);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Card className="w-full max-w-md p-6 space-y-4 bg-card text-card-foreground">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {confirmPassword.length > 0 && (
              <p
                className={`text-sm mt-1 ${
                  passwordsMatch ? "text-green-500" : "text-red-500"
                }`}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <Button type="submit" className="w-full bg-blue-600">
            Register
          </Button>
        </form>

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
