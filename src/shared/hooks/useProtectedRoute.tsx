import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useProtectedRoute() {
  const { user } = useAuth();

  return function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };
}
