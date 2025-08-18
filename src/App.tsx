// Imports
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";

// Pages

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AuditLog } from "./pages/admin/AuditLog";
import { UserManagement } from "./pages/admin/UserManagement";
import { EmailVerification } from "./pages/auth/EmailVerification";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { FormBuilder } from "./pages/forms/FormBuilder";
import { FormEmbed } from "./pages/forms/FormEmbed";
import { FormsList } from "./pages/forms/FormsList";
import { FormSubmissions } from "./pages/forms/FormSubmissions";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Subscription } from "./pages/Subscription";

// Composant principal
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<EmailVerification />} />

              {/* Route d'intégration (publique) */}
              <Route path="/embed/:id" element={<FormEmbed />} />

              {/* Routes protégées */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute userOnly>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-log"
                element={
                  <ProtectedRoute adminOnly>
                    <AuditLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms"
                element={
                  <ProtectedRoute userOnly>
                    <FormsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms/new"
                element={
                  <ProtectedRoute userOnly>
                    <FormBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms/:id/edit"
                element={
                  <ProtectedRoute userOnly>
                    <FormBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms/:id/submissions"
                element={
                  <ProtectedRoute userOnly>
                    <FormSubmissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute userOnly>
                    <Subscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Redirection de la racine vers le tableau de bord */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <RoleBasedRedirect />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

// Composant de redirection basé sur le rôle
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default App;
