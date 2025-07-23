import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/useAuthHook';
import { ToastProvider } from './components/ui/Toast';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { FormsList } from './pages/forms/FormsList';
import { FormBuilder } from './pages/forms/FormBuilder';
import { FormSubmissions } from './pages/forms/FormSubmissions';
import { FormEmbed } from './pages/forms/FormEmbed';
import { Subscription } from './pages/Subscription';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { EmailVerification } from './pages/auth/EmailVerification';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              
              {/* Embed route (public) */}
              <Route path="/embed/:id" element={<FormEmbed />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute userOnly>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/forms" element={
                <ProtectedRoute userOnly>
                  <FormsList />
                </ProtectedRoute>
              } />
              <Route path="/forms/new" element={
                <ProtectedRoute userOnly>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              <Route path="/forms/:id/edit" element={
                <ProtectedRoute userOnly>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              <Route path="/forms/:id/submissions" element={
                <ProtectedRoute userOnly>
                  <FormSubmissions />
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute userOnly>
                  <Subscription />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

function RoleBasedRedirect() {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
}
export default App;