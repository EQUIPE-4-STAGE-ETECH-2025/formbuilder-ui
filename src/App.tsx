// Imports
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AuthGuard } from "./components/auth/AuthGuard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./contexts/AuthProvider";

// Pages
import { EmailVerification } from "./pages/auth/EmailVerification";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ResetPassword } from "./pages/auth/ResetPassword";
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
              {/* Routes publiques avec redirection si connecté */}
              <Route
                path="/login"
                element={
                  <AuthGuard>
                    <Login />
                  </AuthGuard>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthGuard>
                    <Register />
                  </AuthGuard>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthGuard>
                    <ForgotPassword />
                  </AuthGuard>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <AuthGuard>
                    <EmailVerification />
                  </AuthGuard>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <AuthGuard>
                    <ResetPassword />
                  </AuthGuard>
                }
              />

              {/* Route d'intégration (publique) */}
              <Route path="/embed/:id" element={<FormEmbed />} />

              {/* Routes protégées */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms"
                element={
                  <ProtectedRoute>
                    <FormsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms/new"
                element={
                  <ProtectedRoute>
                    <FormBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms/:id/edit"
                element={
                  <ProtectedRoute>
                    <FormBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forms/:id/submissions"
                element={
                  <ProtectedRoute>
                    <FormSubmissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
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
                    <Navigate to="/dashboard" replace />
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

export default App;
