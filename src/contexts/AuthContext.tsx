import { createContext } from "react";
import { IUser } from "../types";

interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  clearError: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
