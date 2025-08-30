import { IUser } from "../../../types";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: IUser;
  };
  message?: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  success: boolean;
  data?: {
    user: IUser;
    token: string;
  };
  message?: string;
}

export interface IMeResponse {
  success: boolean;
  data?: IUser;
  message?: string;
}

export interface ILogoutResponse {
  success: boolean;
  message?: string;
}

export interface IVerifyEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface IResendVerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface IForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface IResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface IChangePasswordResponse {
  success: boolean;
  message?: string;
}
