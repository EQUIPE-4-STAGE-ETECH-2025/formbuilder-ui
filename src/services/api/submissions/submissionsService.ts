import { apiClient } from "../config/apiClient";
import {
  SubmissionResponseDto,
  SubmissionsQuery,
  SubmitFormDto,
  TAnalyticsResponse,
  TSubmissionsResponse,
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
  ): Promise<TSubmissionsResponse> => {
    const res = await apiClient.get(`/api/forms/${formId}/submissions`, {
      params: query,
    });
    return res.data;
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
