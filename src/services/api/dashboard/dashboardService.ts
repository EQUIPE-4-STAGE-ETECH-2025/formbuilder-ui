import apiClient from "../config/apiClient";
import { withErrorHandling } from "../utils/apiUtils";
import { IDashboardStats, IGetStatsResponse } from "./dashboardTypes";

const basePath = "/api/dashboard";

export const dashboardService = {
  getStats: async (): Promise<IGetStatsResponse> => {
    const result = await withErrorHandling(async () => {
      const response = await apiClient.get<IDashboardStats>(
        `${basePath}/stats`
      );

      return {
        success: true,
        data: response.data,
      } as IGetStatsResponse;
    }, "Impossible de charger les statistiques");

    return result as IGetStatsResponse;
  },
};
