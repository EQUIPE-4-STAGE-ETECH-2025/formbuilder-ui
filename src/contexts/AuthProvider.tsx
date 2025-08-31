import React, { ReactNode, useEffect, useState } from "react";
import { authService } from "../services/api/auth/authService";
import {
  IChangePasswordResponse,
  ILoginRequest,
  ILoginResponse,
  ILogoutResponse,
  IMeResponse,
  IRegisterRequest,
  IRegisterResponse,
} from "../services/api/auth/authType";
import { ILoginResult, IUser } from "../types";
import { AuthContext, IAuthContext } from "./AuthContext";

interface IAuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token";

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const response: IMeResponse = await authService.me();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<ILoginResult> => {
    setLoading(true);
    setError(null);

    try {
      const credentials: ILoginRequest = { email, password };
      const response: ILoginResponse = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem(TOKEN_KEY, response.data.token);
        return { success: true, data: response.data };
      } else {
        const err = response.message || "Erreur lors de la connexion";
        setError(err);
        return { success: false, error: err };
      }
    } catch {
      const err = "Erreur lors de la connexion";
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<ILogoutResponse> => {
    setLoading(true);
    try {
      const response: ILogoutResponse = await authService.logout();
      return response;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la déconnexion",
      };
    } finally {
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      setLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const request: IRegisterRequest = { ...userData };
      const response: IRegisterResponse = await authService.register(request);
      if (response.message) return true;

      setError(response.message || "Erreur lors de l'inscription");
      return false;
    } catch {
      setError("Erreur lors de l'inscription");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      const response: IChangePasswordResponse =
        await authService.changePassword(currentPassword, newPassword);
      if (!response.success)
        setError(
          response.message || "Erreur lors du changement de mot de passe"
        );
      return { success: response.success, message: response.message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: IAuthContext = {
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