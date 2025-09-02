import { apiClient } from "../config/apiClient";
import {
  ISubmissionsListResponse,
  SubmissionResponseDto,
  SubmissionsQuery,
  SubmitFormDto,
  TAnalyticsResponse,
} from "./submissionsTypes";

export const submissionsService = {
  submit: async (
    formId: string,
    payload: SubmitFormDto
  ): Promise<SubmissionResponseDto> => {
    const res = await apiClient.post(`/api/forms/${formId}/submit`, payload);
    return res.data;
  },

  getByFormId: async (
    formId: string,
    query?: SubmissionsQuery
  ): Promise<ISubmissionsListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (query?.page) queryParams.append("page", query.page.toString());
      if (query?.limit) queryParams.append("limit", query.limit.toString());
      if (query?.dateFrom) queryParams.append("dateFrom", query.dateFrom);
      if (query?.dateTo) queryParams.append("dateTo", query.dateTo);
      if (query?.status) queryParams.append("status", query.status);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/forms/${formId}/submissions?${queryString}`
        : `/api/forms/${formId}/submissions`;

      const res = await apiClient.get<ISubmissionsListResponse>(url);
      return res.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des soumissions:", error);
      return {
        success: false,
        message:
          (
            error as {
              response?: { status?: number; data?: { message?: string } };
            }
          ).response?.data?.message ||
          "Erreur lors de la récupération des soumissions",
      };
    }
  },

  exportCsv: async (formId: string): Promise<Blob> => {
    const res = await apiClient.get(`/api/forms/${formId}/submissions/export`, {
      responseType: "blob",
    });
    return res.data;
  },

  getAnalytics: async (formId: string): Promise<TAnalyticsResponse> => {
    const res = await apiClient.get(
      `/api/forms/${formId}/submissions/analytics`
    );
    return res.data;
  },
};
