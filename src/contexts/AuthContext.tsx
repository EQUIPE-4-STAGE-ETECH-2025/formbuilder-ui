import { createContext } from "react";
import { ILoginResponse, ILogoutResponse } from "../services/api/auth/authType";
import { IUser } from "../types";

export interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  loginLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{
    success: boolean;
    data?: ILoginResponse["data"];
    error?: string;
  }>;
  logout: () => Promise<ILogoutResponse>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  clearError: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
