// Interfaces pour les objets - Conformes au schéma Supabase
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  role: "USER";
  createdAt: string;
  updatedAt: string;
  // Propriétés supplémentaires pour l'interface utilisateur
  subscription?: {
    plan: string;
    currentForms: number;
    maxForms: number;
    currentSubmissions: number;
    maxSubmissionsPerMonth: number;
  };
}

export interface ILoginSuccess {
  token: string;
  refresh_token: string;
  user: IUser;
}

export interface ILoginResult {
  success: boolean;
  data?: ILoginSuccess;
  error?: string;
}

export interface IRegisterResponse {
  success: boolean;
  data?: {
    user: IUser;
    token: string;
  };
  error?: string;
}

export interface IForm {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "disabled";
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Propriétés supplémentaires pour l'interface utilisateur
  submissionCount: number;
  version: number;
  fields: IFormField[];
  history: {
    versions: IFormVersion[];
    currentVersion: number;
    maxVersions: number;
  };
  settings: IFormSettings;
}

// Alias pour compatibilité avec le code existant
export type Form = IForm;

export interface IFormVersion {
  id: string;
  form_id: string;
  version_number: number;
  schema: IFormSchema;
  created_at: string;
}

export interface IFormSchema {
  title: string;
  description: string;
  fields: IFormField[];
  settings: IFormSettings;
  status: "draft" | "published" | "disabled";
}

export interface IFormField {
  id: string;
  form_version_id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "date"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "number"
    | "file"
    | "url"
    | "tel";
  is_required: boolean;
  placeholder?: string;
  options: IFieldOptions;
  position: number;
  order: number;
  validation_rules: IFieldValidation;
}

// Alias pour compatibilité avec le code existant
export type FormField = IFormField;

export interface IFieldOptions {
  placeholder?: string;
  choices?: string[];
  default_value?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface IFieldValidation {
  required?: boolean;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  min_value?: number;
  max_value?: number;
  custom_rules?: string[];
}

export interface IFormSettings {
  theme: IFormTheme;
  success_message: string;
  redirect_url?: string;
  notifications: INotifications;
}

export interface IFormTheme {
  primary_color: string;
  background_color: string;
  text_color: string;
}

export interface INotifications {
  email: boolean;
  webhook?: string;
}

export interface IFormToken {
  id: string;
  form_id: string;
  jwt: string;
  expires_at: string;
  created_at: string;
}

export interface ISubmission {
  id: string;
  form_id: string;
  data: Record<string, unknown>;
  submitted_at: string;
  ip_address: string;
}

// Alias pour compatibilité avec le code existant
export type Submission = ISubmission;

export interface IPlan {
  id: string;
  name: string;
  price_cents: number;
  stripe_product_id: string;
  max_forms: number;
  max_submissions_per_month: number;
  max_storage_mb: number;
  // Propriétés supplémentaires pour l'interface utilisateur
  price?: number;
  popular?: boolean;
  features?: string[];
}

// Alias pour compatibilité avec le code existant
export type Plan = IPlan;

export interface ISubscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id: string;
  start_date: string;
  end_date: string | null; // null pour les plans gratuits illimités
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPlanFeature {
  id: string;
  plan_id: string;
  feature_id: string;
}

export interface IQuotaStatus {
  id: string;
  user_id: string;
  month: string;
  form_count: number;
  submission_count: number;
  storage_used_mb: number;
  notified80: boolean;
  notified100: boolean;
}

// Types pour les fonctions et unions
export type TApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type TUserRole = "USER";
export type TFormStatus = "draft" | "published" | "disabled";
export type TFieldType =
  | "text"
  | "email"
  | "date"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "number"
  | "file"
  | "url";

// Types pour les handlers
export type TUserHandler = (user: IUser) => void;
export type TFormHandler = (form: IForm) => void;
export type TSubmissionHandler = (submission: ISubmission) => void;
export type TFormVersionHandler = (version: IFormVersion) => void;

// Types pour les réponses API avec pagination
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Types pour les statistiques
export interface IDashboardStats {
  total_forms: number;
  total_submissions: number;
  published_forms: number;
  submissions_this_month: number;
  recent_submissions: ISubmission[];
  quota_usage: {
    forms_used: number;
    forms_limit: number;
    submissions_used: number;
    submissions_limit: number;
    storage_used_mb: number;
    storage_limit_mb: number;
  };
}
