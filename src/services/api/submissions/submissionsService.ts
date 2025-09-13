import { apiClient } from "../config/apiClient";
import { apiCache, buildUrl, withErrorHandling } from "../utils/apiUtils";
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
    const result = await withErrorHandling(async () => {
      const res = await apiClient.post(`/api/forms/${formId}/submit`, payload);

      // Invalider le cache des soumissions après soumission
      apiCache.delete(`submissions_${formId}_{}`);

      return res.data;
    }, `Erreur lors de la soumission du formulaire ${formId}`);

    return result as SubmissionResponseDto;
  },

  getByFormId: async (
    formId: string,
    query?: SubmissionsQuery
  ): Promise<ISubmissionsListResponse> => {
    const basePath = `/api/forms/${formId}/submissions`;
    const url = buildUrl(
      basePath,
      query as Record<string, string | number | boolean | undefined>
    );
    const cacheKey = `submissions_${formId}_${JSON.stringify(query || {})}`;

    const result = await withErrorHandling(
      () =>
        apiClient.get<ISubmissionsListResponse>(url).then((res) => res.data),
      "Erreur lors de la récupération des soumissions",
      cacheKey,
      2 * 60 * 1000 // Cache 2 minutes
    );

    return result as ISubmissionsListResponse;
  },

  exportCsv: async (formId: string): Promise<Blob> => {
    const result = await withErrorHandling(
      () =>
        apiClient
          .get(`/api/forms/${formId}/submissions/export`, {
            responseType: "blob",
          })
          .then((res) => res.data),
      `Erreur lors de l'export CSV du formulaire ${formId}`
      // Pas de cache pour les exports CSV
    );

    return result as Blob;
  },

  getAnalytics: async (formId: string): Promise<TAnalyticsResponse> => {
    const cacheKey = `analytics_${formId}`;

    const result = await withErrorHandling(
      () =>
        apiClient
          .get(`/api/forms/${formId}/submissions/analytics`)
          .then((res) => res.data),
      `Erreur lors de la récupération des analytics du formulaire ${formId}`,
      cacheKey,
      5 * 60 * 1000 // Cache 5 minutes pour les analytics
    );

    return result as TAnalyticsResponse;
  },
};
