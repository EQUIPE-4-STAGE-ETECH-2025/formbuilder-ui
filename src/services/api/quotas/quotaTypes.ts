export interface IQuotaLimits {
  max_forms: number;
  max_submissions_per_month: number;
  max_storage_mb: number;
}

export interface IQuotaUsage {
  form_count: number;
  submission_count: number;
  storage_used_mb: number;
}

export interface IQuotaPercentages {
  forms_used_percent: number;
  submissions_used_percent: number;
  storage_used_percent: number;
}

export interface IQuotaOverLimit {
  forms: boolean;
  submissions: boolean;
  storage: boolean;
}

export interface IQuotaStatus {
  user_id: string;
  month: string;
  limits: IQuotaLimits;
  usage: IQuotaUsage;
  percentages: IQuotaPercentages;
  is_over_limit: IQuotaOverLimit;
}

export interface IGetQuotasResponse {
  success: boolean;
  data?: IQuotaStatus;
  message?: string;
}

export interface IQuotaErrorData {
  action_type: "create_form" | "submit_form" | "upload_file";
  error_code: string;
  current_usage: number;
  max_limit: number;
  percentage_used: number;
  message: string;
}

export class QuotaExceededError extends Error {
  public readonly quotaData: IQuotaErrorData;

  constructor(quotaData: IQuotaErrorData) {
    super(quotaData.message);
    this.name = "QuotaExceededError";
    this.quotaData = quotaData;
  }

  getActionType(): IQuotaErrorData["action_type"] {
    return this.quotaData.action_type;
  }

  getErrorCode(): string {
    return this.quotaData.error_code;
  }

  getCurrentUsage(): number {
    return this.quotaData.current_usage;
  }

  getMaxLimit(): number {
    return this.quotaData.max_limit;
  }

  getPercentageUsed(): number {
    return this.quotaData.percentage_used;
  }

  getMessage(): string {
    return this.quotaData.message;
  }
}
