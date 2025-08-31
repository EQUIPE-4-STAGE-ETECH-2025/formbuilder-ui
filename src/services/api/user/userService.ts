import { apiClient } from "../config/apiClient";
import { IDeleteResponse, IUpdateProfileRequest, IUpdateProfileResponse } from "./userType";

const basePath = "/api/users";

export const userService = {

  updateProfile: async (
    id: string,
    profileData: IUpdateProfileRequest
  ): Promise<IUpdateProfileResponse> => {
    try {
      const response = await apiClient.put<IUpdateProfileResponse>(
        `${basePath}/${id}/profile`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du profil utilisateur ${id}:`,
        error
      );

      return {
        message:
          (
            error as {
              response?: { data?: { message?: string } };
            }
          ).response?.data?.message || "Erreur lors de la mise à jour du profil",
      };
    }
  },

  deleteUser: async (
    id: string
  ): Promise<IDeleteResponse> => {
    try {
      const response = await apiClient.delete<IDeleteResponse>(
        `${basePath}/${id}`
      );
      return {
        success: true,
        user: response.data?.user,
        message: response.data?.message || "Utilisateur supprimé avec succès",
      };
    } catch (error: any) {
      console.error(
        `Erreur lors de la suppression de l’utilisateur ${id}:`,
        error
      );

      return {
        success: false,
        message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Erreur lors de la suppression du compte",
      };
    }
  }
}
