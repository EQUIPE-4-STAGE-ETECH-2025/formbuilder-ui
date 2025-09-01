import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  userOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const { user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
            <p className="text-surface-400">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  if (userOnly && user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}
