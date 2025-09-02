import apiClient from "../config/apiClient";
import { IDashboardStats, IGetStatsResponse } from "./dashboardTypes";

interface IApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

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
    } catch (error: unknown) {
      console.error("Erreur lors de la récupération des stats:", error);
      return {
        success: false,
        message:
          (error as IApiError)?.response?.data?.message ||
          "Impossible de charger les statistiques",
      };
    }
  },
};
