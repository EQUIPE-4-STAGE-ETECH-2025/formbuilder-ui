import apiClient from "../config/apiClient";
import { IGetQuotasResponse } from "./quotaTypes";

const basePath = "/api/users";

export const quotasService = {
  getByUserId: async (userId: string): Promise<IGetQuotasResponse> => {
    try {
      const response = await apiClient.get<IGetQuotasResponse>(`${basePath}/${userId}/quotas`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("Erreur lors de la récupération des quotas:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Impossible de charger les quotas",
      };
    }
  },
};
