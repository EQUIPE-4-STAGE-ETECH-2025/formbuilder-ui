import { apiClient } from "../config/apiClient";
import { buildUrl, withErrorHandling } from "../utils/apiUtils";
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
    payload: SubmitFormDto,
    formStartTime?: number
  ): Promise<SubmissionResponseDto> => {
    const result = await withErrorHandling(async () => {
      // Utiliser le timestamp fourni ou générer un nouveau si non fourni (fallback)
      const timestamp = formStartTime
        ? formStartTime.toString()
        : Math.floor(Date.now() / 1000).toString();

      // Ajouter le champ honeypot vide aux données
      const securePayload = {
        ...payload,
        _website_url: "",
      };

      const res = await apiClient.post(
        `/api/forms/${formId}/submit`,
        securePayload,
        {
          headers: {
            "X-Honeypot-Field": timestamp,
          },
        }
      );

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

    const result = await withErrorHandling(
      () =>
        apiClient.get<ISubmissionsListResponse>(url).then((res) => res.data),
      "Erreur lors de la récupération des soumissions"
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
    );

    return result as Blob;
  },

  getAnalytics: async (formId: string): Promise<TAnalyticsResponse> => {
    const result = await withErrorHandling(
      () =>
        apiClient
          .get(`/api/forms/${formId}/submissions/analytics`)
          .then((res) => res.data),
      `Erreur lors de la récupération des analytics du formulaire ${formId}`
    );

    return result as TAnalyticsResponse;
  },
};
