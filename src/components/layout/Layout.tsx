import { Header } from './Header';
import { useAuth } from '../../hooks/useAuthHook';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show header for embed pages
  const isEmbedPage = location.pathname.startsWith('/embed/');

  if (!isAuthenticated || isEmbedPage) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}