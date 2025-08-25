import { ILoginResult, IRegisterResponse, IUser } from "../../../types";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
    login: async (email: string, password: string): Promise<ILoginResult> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || "Erreur lors de la connexion",
                };
            }

            return {
                success: true,
                data: {
                    token: data.data.token,
                    user: data.data.user,
                },
            };
        } catch (err) {
            return {
                success: false,
                error: "Impossible de se connecter. Vérifiez votre connexion.",
            };
        }
    },

    register: async (userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<IRegisterResponse> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) return { success: false, error: data.error || "Erreur lors de l'inscription" };

            return { success: true, data: { user: data.user, token: data.token } };
        } catch {
            return { success: false, error: "Impossible de s'inscrire. Vérifiez votre connexion." };
        }
    },

    me: async (): Promise<{ success: boolean; data?: IUser }> => {
        const token = localStorage.getItem("auth_token");
        if (!token) return { success: false };

        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) return { success: false };
            return { success: true, data };
        } catch {
            return { success: false };
        }
    },

    logout: async (): Promise<{ success: boolean; error?: string }> => {
        const token = localStorage.getItem("auth_token");
        if (!token) return { success: false, error: "Token manquant" };

        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) return { success: false, error: data.error || "Erreur lors de la déconnexion" };
            return { success: true };
        } catch {
            return { success: false, error: "Impossible de se déconnecter. Vérifiez votre connexion." };
        }
    },

    verifyEmail: async (token: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
            const data = await response.json();
            if (!response.ok) return { success: false, error: data.error || "Lien invalide ou expiré" };
            return { success: true };
        } catch {
            return { success: false, error: "Impossible de vérifier l'email. Vérifiez votre connexion." };
        }
    },

    resendVerification: async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) return { success: false, error: data.error || "Erreur lors de l'envoi de l'email" };
            return { success: true };
        } catch {
            return { success: false, error: "Impossible d'envoyer l'email. Vérifiez votre connexion." };
        }
    },

    forgotPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error || "Erreur lors de la demande de réinitialisation" };
            }

            return { success: true };
        } catch {
            return { success: false, error: "Impossible d'envoyer la demande. Vérifiez votre connexion." };
        }
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error || "Erreur lors de la réinitialisation du mot de passe" };
            }

            return { success: true };
        } catch {
            return { success: false, error: "Impossible de réinitialiser le mot de passe. Vérifiez votre connexion." };
        }
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
        const token = localStorage.getItem("auth_token");
        if (!token) return { success: false, error: "Token manquant" };
    
        try {
            const response = await fetch(`${API_URL}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
    
            const data = await response.json();
            if (!response.ok) return { success: false, error: data.error || "Erreur lors de la modification du mot de passe" };
    
            return { success: true };
        } catch {
            return { success: false, error: "Impossible de modifier le mot de passe. Vérifiez votre connexion." };
        }
    },    
};