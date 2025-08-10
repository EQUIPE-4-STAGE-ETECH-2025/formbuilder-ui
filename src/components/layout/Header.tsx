import { Bell, LogOut, Menu, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    ...(user?.role === "ADMIN"
      ? [{ name: "Administration", href: "/admin" }]
      : [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Formulaires", href: "/forms" },
          { name: "Abonnement", href: "/subscription" },
        ]),
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header>
      <div className="container-modern">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-accent-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-text-100">
                FormBuilder
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-text-100"
                    : "text-surface-400 hover:text-text-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="p-3 text-surface-400 hover:text-text-100 hover:bg-surface-800/50 hover:backdrop-blur-sm rounded-xl transition-all duration-200 focus-ring">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-surface-800/50 hover:backdrop-blur-sm transition-all duration-200 focus-ring"
              >
                <div className="w-10 h-10 bg-accent-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-text-100">
                  {user?.first_name} {user?.last_name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-surface-900 rounded-2xl shadow-large border border-surface-800 z-50 animate-scale-in">
                  <div className="py-2 px-1.5">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-surface-300 hover:bg-surface-800 rounded-xl transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-surface-300 hover:bg-surface-800 rounded-xl transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Paramètres
                    </Link>
                    <hr className="my-2 border-surface-700" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-surface-400 hover:text-text-100 hover:bg-surface-800/50 hover:backdrop-blur-sm rounded-xl transition-all duration-200 focus-ring"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-surface-800 py-6 animate-slide-up">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-text-100"
                      : "text-surface-400 hover:text-text-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
