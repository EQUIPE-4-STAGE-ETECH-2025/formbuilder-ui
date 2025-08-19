import { IUser } from "../../../types";

const API_URL = import.meta.env.VITE_API_URL;

interface ILoginResponse {
    success: boolean;
    data?: {
        user: IUser;
        token: string;
    };
    error?: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<ILoginResponse> => {
        try {
            const response = await fetch(`${API_URL}api/auth/login`, {
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
                    user: data.user,
                    token: data.token,
                },
            };
        } catch (err) {
            return {
                success: false,
                error: "Impossible de se connecter. Vérifiez votre connexion.",
            };
        }
    },

    me: async (): Promise<{ success: boolean; data?: IUser }> => {
        const token = localStorage.getItem("auth_token");
        if (!token) return { success: false };

        try {
            const response = await fetch(`${API_URL}api/auth/me`, {
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
};