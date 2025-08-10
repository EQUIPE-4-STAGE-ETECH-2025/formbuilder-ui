import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show header for embed pages
  const isEmbedPage = location.pathname.startsWith("/embed/");

  if (!isAuthenticated || isEmbedPage) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-modern py-8 sm:py-12 lg:py-16">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
