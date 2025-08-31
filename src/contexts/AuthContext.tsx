import { createContext } from "react";
import { IUser } from "../types";
import { ILoginResponse, ILogoutResponse } from "../services/api/auth/authType";

export interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; data?: ILoginResponse["data"]; error?: string }>;
  logout: () => Promise<ILogoutResponse>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<boolean>;
  clearError: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);