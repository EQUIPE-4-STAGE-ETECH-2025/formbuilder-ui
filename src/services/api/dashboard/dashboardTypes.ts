export interface ISubmissionsPerMonth {
    [month: string]: number;
  }
  
  export interface ISubmissionsPerForm {
    [formTitle: string]: number;
  }
  
  export interface IFormsStatusCount {
    [status: string]: number;
  }
  
  export interface IRecentForm {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }
  
  export interface IDashboardStats {
    totalForms: number;
    publishedForms: number;
    totalSubmissions: number;
    submissionsPerMonth: ISubmissionsPerMonth;
    submissionsPerForm: ISubmissionsPerForm;
    formsStatusCount: IFormsStatusCount;
    recentForms: IRecentForm[]; 
  }
  
  export interface IGetStatsResponse {
    success: boolean;
    data?: IDashboardStats;
    message?: string;
  }
  