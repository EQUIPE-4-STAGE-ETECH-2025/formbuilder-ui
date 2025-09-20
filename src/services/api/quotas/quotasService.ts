import apiClient from "../config/apiClient";
import { withErrorHandling } from "../utils/apiUtils";
import { IGetQuotasResponse } from "./quotaTypes";

const basePath = "/api/users";

export const quotasService = {
  getByUserId: async (userId: string): Promise<IGetQuotasResponse> => {
    const url = `${basePath}/${userId}/quotas`;

    const result = await withErrorHandling(async () => {
      const response = await apiClient.get<IGetQuotasResponse>(url);

      return {
        success: true,
        data: response.data.data,
      } as IGetQuotasResponse;
    }, "Impossible de charger les quotas");

    return result as IGetQuotasResponse;
  },
};
