import React, { ReactNode, useCallback, useEffect, useState } from "react";
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

const STORAGE_KEYS = {
  TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token",
  REFRESH_TOKEN:
    import.meta.env.VITE_JWT_REFRESH_KEY || "formbuilder_refresh_token",
} as const;

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Vérifier d'abord localStorage, puis sessionStorage
      const token =
        localStorage.getItem(STORAGE_KEYS.TOKEN) ||
        sessionStorage.getItem(STORAGE_KEYS.TOKEN);

      if (token) {
        const response: IMeResponse = await authService.me();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Nettoyer les deux types de stockage
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
          sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
      }
    } catch {
      // Nettoyer les deux types de stockage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean = true
    ): Promise<ILoginResult> => {
      setLoginLoading(true);
      setError(null);

      try {
        const credentials: ILoginRequest = { email, password };
        const response: ILoginResponse = await authService.login(credentials);

        if (response.success && response.data) {
          setUser(response.data.user);

          // Stockage conditionnel basé sur rememberMe
          if (rememberMe) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
            localStorage.setItem(
              STORAGE_KEYS.REFRESH_TOKEN,
              response.data.refresh_token
            );
          } else {
            sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
            sessionStorage.setItem(
              STORAGE_KEYS.REFRESH_TOKEN,
              response.data.refresh_token
            );
          }

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
        setLoginLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<ILogoutResponse> => {
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
      // Nettoyer les deux types de stockage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setLoading(false);
    }
  }, []);

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
    loginLoading,
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
