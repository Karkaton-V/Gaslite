import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import PasswordResetPage from "@/features/auth/pages/PasswordResetPage";
import DashboardPage from "@/features/home/pages/DashboardPage";
import UserPostsPage from "@/features/home/pages/UserPostsPage";

import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

export default function AppRoutes() {
  const Protected = useProtectedRoute();

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root → /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/passwordreset" element={
            <Protected>
              <PasswordResetPage />
            </Protected>
          } />

        <Route path="/dashboard" element={
            <Protected>
              <DashboardPage />
            </Protected>
          } />

        <Route path="/recommended" element={
          <Protected>
            <UserPostsPage />
          </Protected>
            
        } />
      </Routes>
    </BrowserRouter>
  );
}
