import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import DashboardPage from "@/features/home/pages/DashboardPage";
import UserPostsPage from "@/features/home/pages/UserPostsPage";
import CommunitiesPage from "@/features/home/pages/CommunitiesPage";
import ProfilePage from "@/features/home/pages/ProfilePage";

import { useProtectedRoute } from "@/shared/hooks/useProtectedRoute";

export default function AppRoutes() {
  const Protected = useProtectedRoute();

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root → /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />

        <Route
          path="/recommended"
          element={
            <Protected>
              <UserPostsPage />
            </Protected>
          }
        />

        <Route
          path="/communities"
          element={
            <Protected>
              <CommunitiesPage />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}