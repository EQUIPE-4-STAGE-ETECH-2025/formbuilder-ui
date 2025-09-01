import { apiClient } from "../config/apiClient";
import {
  ISubmission,
  SubmitFormDto,
  SubmissionResponseDto,
  SubmissionsQuery,
} from "./submissionsTypes";

// Adaptateur backend → frontend
const adaptSubmission = (apiData: any): ISubmission => ({
  id: apiData.id,
  formId: apiData.formId ?? apiData.form_id,
  data: apiData.data,
  submittedAt: apiData.submittedAt ?? apiData.submitted_at,
  ipAddress: apiData.ipAddress ?? apiData.ip_address,
});

export const submissionsService = {
  submit: async (formId: string, payload: SubmitFormDto): Promise<SubmissionResponseDto> => {
    const res = await apiClient.post(`/api/forms/${formId}/submit`, payload);
    return res.data;
  },

  getByFormId: async (formId: string, query?: SubmissionsQuery): Promise<ISubmission[]> => {
    const res = await apiClient.get(`/api/forms/${formId}/submissions`, { params: query });
    return res.data.map(adaptSubmission);
  },

  exportCsv: async (formId: string): Promise<Blob> => {
    const res = await apiClient.get(`/api/forms/${formId}/submissions/export`, {
      responseType: "blob",
    });
    return res.data;
  },

  getAnalytics: async (formId: string): Promise<any> => {
    const res = await apiClient.get(`/api/forms/${formId}/submissions/analytics`);
    return res.data; // { total, daily, conversion_rate, average_submission_time }
  },
};