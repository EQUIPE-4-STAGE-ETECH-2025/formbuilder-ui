import apiClient from "../config/apiClient";
import { IDashboardStats, IGetStatsResponse } from "./dashboardTypes";

const basePath = "/api/dashboard";

export const dashboardService = {
  getStats: async (): Promise<IGetStatsResponse> => {
    try {
      const response = await apiClient.get<IDashboardStats>(
        `${basePath}/stats`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Erreur lors de la récupération des stats:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Impossible de charger les statistiques",
      };
    }
  },
};
