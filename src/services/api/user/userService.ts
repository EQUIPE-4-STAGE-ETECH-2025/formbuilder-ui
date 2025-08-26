import { IUser } from "../../../types";

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
    updateProfile: async (
        id: string,
        profileData: { firstName: string; lastName: string }
    ): Promise<{ success: boolean; user?: IUser; error?: string }> => {
        const token = localStorage.getItem("auth_token");
        if (!token) return { success: false, error: "Token manquant" };

        try {
            const response = await fetch(`${API_URL}/api/users/${id}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.errors || data.error || "Erreur lors de la mise à jour du profil" };
            }

            return { success: true, user: data.user };
        } catch {
            return { success: false, error: "Impossible de mettre à jour le profil. Vérifiez votre connexion." };
        }
    },

    deleteUser: async (
        id: string
      ): Promise<{ success: boolean; user?: IUser; error?: string }> => {
        const token = localStorage.getItem("auth_token");
        if (!token) return { success: false, error: "Token manquant" };
    
        try {
          const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            return { success: false, error: data.error || "Erreur lors de la suppression du compte" };
          }
    
          return { success: true, user: data.user };
        } catch {
          return { success: false, error: "Impossible de supprimer le compte. Vérifiez votre connexion." };
        }
      },
}
