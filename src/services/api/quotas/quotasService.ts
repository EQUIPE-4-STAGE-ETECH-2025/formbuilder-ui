import apiClient from "../config/apiClient";
import { IGetQuotasResponse } from "./quotaTypes";

const basePath = "/api/users";

export const quotasService = {
  getByUserId: async (userId: string): Promise<IGetQuotasResponse> => {
    try {
      const response = await apiClient.get<IGetQuotasResponse>(
        `${basePath}/${userId}/quotas`
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: unknown) {
      console.error("Erreur lors de la récupération des quotas:", error);

      // Gestion typée des erreurs d'API
      const getErrorMessage = (err: unknown): string => {
        if (err && typeof err === "object" && "response" in err) {
          const response = (
            err as { response?: { data?: { message?: string } } }
          ).response;
          return response?.data?.message || "Impossible de charger les quotas";
        }
        return "Impossible de charger les quotas";
      };

      return {
        success: false,
        message: getErrorMessage(error),
      };
    }
  },
};
