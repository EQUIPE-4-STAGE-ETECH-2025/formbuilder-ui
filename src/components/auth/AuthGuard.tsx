import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface IProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: IProps) {
  const { isAuthenticated, loading } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
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

  // Si l'utilisateur est connecté, le rediriger vers le dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher le contenu de la page d'authentification
  return <>{children}</>;
}
