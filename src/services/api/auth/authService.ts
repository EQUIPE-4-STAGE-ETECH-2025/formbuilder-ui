import { IUser } from "../../../types";
import { apiClient } from "../config/apiClient";
import {
  IChangePasswordResponse,
  IForgotPasswordResponse,
  ILoginRequest,
  ILoginResponse,
  ILogoutResponse,
  IMeResponse,
  IRefreshResponse,
  IRegisterRequest,
  IRegisterResponse,
  IResendVerificationResponse,
  IResetPasswordResponse,
  IVerifyEmailResponse,
} from "./authType";

const basePath = "/api/auth";

export const authService = {
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    try {
      const response = await apiClient.post<ILoginResponse>(
        `${basePath}/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return {
        success: false,
        message:
          (error as { response?: { data?: { error?: string } } })?.response
            ?.data?.error || "Erreur de connexion",
      };
    }
  },

  register: async (userData: IRegisterRequest): Promise<IRegisterResponse> => {
    try {
      const response = await apiClient.post<IRegisterResponse>(
        `${basePath}/register`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return {
        success: false,
        message:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Erreur lors de l'inscription",
      };
    }
  },

  me: async (): Promise<IMeResponse> => {
    try {
      const response = await apiClient.get<IUser>(`${basePath}/me`);
      return {
        success: true,
        data: response.data,
        message: "Utilisateur récupéré avec succès",
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return {
        success: false,
        message: "Impossible de récupérer l'utilisateur connecté",
      };
    }
  },

  logout: async (): Promise<ILogoutResponse> => {
    try {
      const response = await apiClient.post<ILogoutResponse>(
        `${basePath}/logout`
      );
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return {
        success: false,
        message: "Erreur lors de la déconnexion",
      };
    }
  },

  verifyEmail: async (token: string): Promise<IVerifyEmailResponse> => {
    try {
      // Encoder le token pour éviter les problèmes avec les caractères spéciaux
      const encodedToken = encodeURIComponent(token);
      const response = await apiClient.get<IVerifyEmailResponse>(
        `${basePath}/verify-email?token=${encodedToken}`
      );
      return {
        success: response.data.success,
        message: response.data.message || "",
      };
    } catch (error) {
      console.error("Erreur lors de la vérification d'email:", error);

      const axiosError = error as {
        response?: { status?: number; data?: { error?: string } };
      };
      const status = axiosError.response?.status;
      const errorMessage = axiosError.response?.data?.error;

      // Gestion spécifique des codes d'erreur améliorés
      switch (status) {
        case 409:
          return {
            success: false,
            message: errorMessage || "Email déjà vérifié.",
            error: "already_verified",
          };
        case 410:
          return {
            success: false,
            message: errorMessage || "Token révoqué.",
            error: "token_revoked",
          };
        case 404:
          return {
            success: false,
            message: errorMessage || "Utilisateur introuvable.",
            error: "user_not_found",
          };
        case 400:
        default:
          return {
            success: false,
            message: errorMessage || "Lien invalide ou expiré.",
            error: "invalid_token",
          };
      }
    }
  },

  resendVerification: async (
    email: string
  ): Promise<IResendVerificationResponse> => {
    try {
      const response = await apiClient.post<IResendVerificationResponse>(
        `${basePath}/resend-verification`,
        { email }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du renvoi de l'email:", error);
      return {
        success: false,
        message: "Erreur lors de l'envoi de l'email",
      };
    }
  },

  forgotPassword: async (email: string): Promise<IForgotPasswordResponse> => {
    try {
      const response = await apiClient.post<IForgotPasswordResponse>(
        `${basePath}/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la demande de reset password:", error);
      return {
        success: false,
        message: "Erreur lors de la demande de réinitialisation",
      };
    }
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<IResetPasswordResponse> => {
    try {
      const response = await apiClient.post<IResetPasswordResponse>(
        `${basePath}/reset-password`,
        { token, newPassword }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      return {
        success: false,
        message: "Erreur lors de la réinitialisation du mot de passe",
      };
    }
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<IChangePasswordResponse> => {
    try {
      const response = await apiClient.post<IChangePasswordResponse>(
        `${basePath}/change-password`,
        { currentPassword, newPassword }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      return {
        success: false,
        message: "Erreur lors du changement de mot de passe",
      };
    }
  },

  refreshToken: async (refreshToken: string): Promise<IRefreshResponse> => {
    try {
      const response = await apiClient.post<IRefreshResponse>(
        `${basePath}/refresh`,
        { refresh_token: refreshToken }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du refresh du token:", error);
      return {
        success: false,
        message: "Impossible de renouveler le token",
      };
    }
  },
};