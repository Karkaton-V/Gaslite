import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import PasswordResetPage from "@/features/auth/pages/PasswordResetPage";

import DashboardPage from "@/features/home/pages/DashboardPage";
import FollowingPage from "@/features/home/pages/FollowingPage";
import CommunitiesDirectoryPage from "@/features/home/pages/CommunitiesDirectoryPage";
import CreateCommunityPage from "@/features/home/pages/CreateCommunityPage";
import SingleCommunityPage from "@/features/home/pages/SingleCommunityPage";
import ProfilePage from "@/features/home/pages/ProfilePage";
import UserSettingsPage from "@/features/home/pages/UserSettingsPage";
import ConversationsPage from "@/features/home/pages/ConversationsPage";
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

        <Route
          path="/conversations"
          element={
            <Protected>
              <ConversationsPage />
            </Protected>
          }
        />

        <Route
          path="/conversation/:id"
          element={
            <Protected>
              <MessagesPage />
            </Protected>
          }
        />

        <Route
          path="/usersettings"
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
              <FollowingPage />
            </Protected>
          }
        />

        {/* Communities Directory */}
        <Route
          path="/communities"
          element={
            <Protected>
              <CommunitiesDirectoryPage />
            </Protected>
          }
        />

        {/* Create Community */}
        <Route
          path="/communities/create"
          element={
            <Protected>
              <CreateCommunityPage />
            </Protected>
          }
        />

        {/* Single Community */}
        <Route
          path="/community/:id"
          element={
            <Protected>
              <SingleCommunityPage />
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
