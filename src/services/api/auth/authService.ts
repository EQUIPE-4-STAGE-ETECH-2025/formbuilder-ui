import { apiClient } from "../config/apiClient";
import {
    ILoginRequest,
    ILoginResponse,
    IRegisterRequest,
    IRegisterResponse,
    IMeResponse,
    ILogoutResponse,
    IVerifyEmailResponse,
    IResendVerificationResponse,
    IForgotPasswordResponse,
    IResetPasswordResponse,
    IChangePasswordResponse,
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
        } catch (error: any) {
            console.error("Erreur lors de la connexion:", error);
            return {
                success: false,
                message: error?.response.data.error || "Erreur de connexion",
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
                    (
                        error as { response?: { data?: { message?: string } } }
                    ).response?.data?.message || "Erreur lors de l'inscription",
            };
        }
    },

    me: async (): Promise<IMeResponse> => {
        try {
            const response = await apiClient.get<IMeResponse>(
                `${basePath}/me`
            );
            return response.data;
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
            const response = await apiClient.get<IVerifyEmailResponse>(
                `${basePath}/verify-email?token=${token}`
            );
            return {
                success: response.data.success,
                message: response.data.message || "",
            };
        } catch (error: any) {
            console.error("Erreur lors de la vérification d'email:", error);
            return {
                success: false,
                message:
                error.response?.data?.error ||
                "Lien invalide ou expiré",
            };
        }
    },

    resendVerification: async (email: string): Promise<IResendVerificationResponse> => {
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

    resetPassword: async (token: string, newPassword: string): Promise<IResetPasswordResponse> => {
        try {
            const response = await apiClient.post<IResetPasswordResponse>(
                `${basePath}/reset-password`,
                { token, newPassword }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
            return {
                success: false,
                message: "Erreur lors de la réinitialisation du mot de passe",
            };
        }
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<IChangePasswordResponse> => {
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
    }
};