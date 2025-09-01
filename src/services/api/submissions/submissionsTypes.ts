/**
 * Types pour les soumissions de formulaires
 * ✅ Validés avec le développeur backend
 */
export interface ISubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: string;
  ipAddress: string;
}

export interface IFormAnalytics {
  total: number;
  daily: Record<string, number>;
  conversion_rate: number;
  average_submission_time: number | null;
}

export type TSubmissionsResponse = ISubmission[];
export type TAnalyticsResponse = IFormAnalytics;

export interface SubmitFormDto {
  data: Record<string, unknown>;
}

export interface SubmissionResponseDto {
  id: string;
  success: boolean;
  submittedAt: string;
}

export interface SubmissionsQuery {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

export interface IApiError {
  error: string;
}

export type TFormFieldValue = string | number | boolean | string[] | null;
export const isFormFieldValue = (value: unknown): value is TFormFieldValue => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
};

export const getSubmissionValue = (
  data: Record<string, unknown>,
  fieldId: string
): string => {
  const value = data[fieldId];
  if (isFormFieldValue(value)) {
    if (value === null) return "-";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  }
  return "-";
};
