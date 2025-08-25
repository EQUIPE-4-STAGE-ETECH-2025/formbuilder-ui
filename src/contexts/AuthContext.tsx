import { createContext } from "react";
import { ILoginResult, IUser } from "../types";

interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ILoginResult>;
  logout: () => void;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  clearError: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
