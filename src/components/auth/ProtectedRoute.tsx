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
      <div className="min-h-screen bg-background-950 flex items-center justify-center">
        <div className="text-center bg-surface-900/50 backdrop-blur-sm border border-surface-700/50 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
          <p className="mt-4 text-text-100">Chargement...</p>
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
