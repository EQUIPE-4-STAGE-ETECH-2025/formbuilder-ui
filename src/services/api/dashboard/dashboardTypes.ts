export interface ISubmissionsPerMonth {
    [month: string]: number; // ex: "2024-07": 4
  }
  
  export interface ISubmissionsPerForm {
    [formTitle: string]: number; // ex: "Contact Lead Generation": 2
  }
  
  export interface IFormsStatusCount {
    [status: string]: number; // ex: "PUBLISHED": 2
  }
  
  export interface IRecentSubmission {
    id: string;
    submittedAt: string;
    formTitle: string;
  }
  
  export interface IDashboardStats {
    totalForms: number;
    publishedForms: number;
    totalSubmissions: number;
    submissionsPerMonth: ISubmissionsPerMonth;
    submissionsPerForm: ISubmissionsPerForm;
    formsStatusCount: IFormsStatusCount;
    recentSubmissions: IRecentSubmission[];
  }
  
  export interface IGetStatsResponse {
    success: boolean;
    data?: IDashboardStats;
    message?: string;
  }
  