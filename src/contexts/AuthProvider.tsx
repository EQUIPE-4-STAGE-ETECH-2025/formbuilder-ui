import React, { ReactNode, useEffect, useState } from "react";
import { authAPI } from "../services/api.mock";
import { IUser } from "../types";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/api/auth/authService";

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      if (token) {
        const response = await authService.me();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem("auth_token");
        }
      }
    } catch {
      console.error("Erreur lors de la vérification de l'authentification");
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(email, password);

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem("auth_token", response.data.token);
        return true;
      } else {
        setError(response.error || "Erreur de connexion");
        return false;
      }
    } catch {
      setError("Erreur lors de la connexion");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem("auth_token");
      setLoading(false);
    }
  };

  const register = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register({
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        password: userData.password,
      });

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem("auth_token", response.data.token);
        return true;
      } else {
        setError(response.error || "Erreur lors de l'inscription");
        return false;
      }
    } catch {
      setError("Erreur lors de l'inscription");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
