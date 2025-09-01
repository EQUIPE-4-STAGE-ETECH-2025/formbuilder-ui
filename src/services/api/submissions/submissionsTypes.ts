export interface ISubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ipAddress: string;
}

export interface SubmitFormDto {
  data: Record<string, any>;
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