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
  