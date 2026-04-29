import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import PasswordResetPage from "@/features/auth/pages/PasswordResetPage";
import DashboardPage from "@/features/home/pages/DashboardPage";
import UserPostsPage from "@/features/home/pages/UserPostsPage";
import CommunitiesPage from "@/features/home/pages/CommunitiesPage";
import ProfilePage from "@/features/home/pages/ProfilePage";
import UserSettingsPage from "@/features/home/pages/UserSettingsPage";
import Test from "@/features/home/pages/DBTest";
import MessagesPage from "@/features/home/pages/MessagesPage";

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
        <Route path="/passwordreset" element={<PasswordResetPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />

        <Route path="/messages" element={
          <Protected>
            <MessagesPage />
          </Protected>
        } />

        <Route 
          path = "/usersettings"
          element={
            <Protected>
              <UserSettingsPage />
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
