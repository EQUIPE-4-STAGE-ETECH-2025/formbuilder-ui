import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import formbuilderLogo from "../../assets/images/logo/formbuilder-logo.png";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  // Détection du scroll pour l'effet sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    ...(user?.role === "ADMIN"
      ? [
          { name: "Dashboard", href: "/admin" },
          { name: "Utilisateurs", href: "/admin/users" },
          { name: "Journal d'audit", href: "/admin/audit-log" },
        ]
      : [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Formulaires", href: "/forms" },
          { name: "Abonnement", href: "/subscription" },
        ]),
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      addToast({
        type: "success",
        title: "Déconnexion",
        message: response.message || "Vous avez été déconnecté",
      });
    } else {
      addToast({
        type: "error",
        title: "Erreur",
        message: response.message || "Erreur lors de la déconnexion",
      });
    }

    setIsUserMenuOpen(false);
  };
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-surface-900 border-b border-surface-700/50 shadow-lg"
          : "bg-surface-900/0 backdrop-blur-none border-b border-transparent"
      }`}
    >
      <div className="container-modern">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-200">
                <img
                  src={formbuilderLogo}
                  alt="FormBuilder"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-text-100">
                FormBuilder
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex space-x-2 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
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
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button className="p-2 text-surface-400 hover:text-text-100 hover:bg-surface-800 rounded-xl transition-all duration-200 focus-ring">
              <Search className="h-5 w-5" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLanguageMenuOpen(!isLanguageMenuOpen);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-surface-400 hover:text-text-100 hover:bg-surface-800 rounded-xl transition-all duration-200 focus-ring"
              >
                <span className="fi fi-fr w-5 h-4"></span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isLanguageMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-surface-900 border border-surface-700/50 rounded-xl shadow-large z-50 animate-scale-in">
                  <div className="py-1 px-1">
                    <button
                      onClick={() => {
                        // TODO: Implémenter le changement de langue vers le français
                        setIsLanguageMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-surface-300 hover:bg-surface-800 rounded-lg transition-colors duration-200"
                    >
                      <span className="fi fi-fr w-5 h-4 mr-2"></span>
                      <span>Français</span>
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implémenter le changement de langue vers l'anglais
                        setIsLanguageMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-surface-300 hover:bg-surface-800 rounded-lg transition-colors duration-200"
                    >
                      <span className="fi fi-us w-5 h-4 mr-2"></span>
                      <span>English</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 lg:space-x-3 p-2 rounded-xl hover:bg-surface-800 transition-all duration-200 focus-ring"
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-text-100 truncate max-w-28 lg:max-w-32">
                  {user?.firstName} {user?.lastName}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 lg:w-56 bg-surface-900 border border-surface-700/50 rounded-2xl shadow-large z-50 animate-scale-in">
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
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-yellow-400 hover:bg-yellow-900/20 rounded-xl transition-colors duration-200"
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
              className="md:hidden p-3 text-surface-400 hover:text-text-100 hover:bg-surface-800 rounded-xl transition-all duration-200 focus-ring"
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
