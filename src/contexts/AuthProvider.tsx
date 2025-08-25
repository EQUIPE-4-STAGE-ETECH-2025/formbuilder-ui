import React, { ReactNode, useEffect, useState } from "react";
import { ILoginResult, IUser } from "../types";
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

  const login = async (email: string, password: string): Promise<ILoginResult> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(email, password);

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem("auth_token", response.data.token);
      } else {
        setError(response.error || "Erreur de connexion");
      }

      return response;
    } catch {
      const err = { success: false, error: "Erreur lors de la connexion" };
      setError(err.error);
      return err;
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
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      if (response.success) {
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

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const result = await authService.changePassword(currentPassword, newPassword);
    return result;
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
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
