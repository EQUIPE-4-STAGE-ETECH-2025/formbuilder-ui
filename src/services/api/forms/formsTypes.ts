// Types pour les formulaires et versions
export interface IFormField {
  id: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"
    | "file"
    | "url"
    | "tel";
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[]; // Pour select, checkbox, radio
  };
  conditional?: {
    field: string; // ID du champ condition
    value: string | number | boolean; // Valeur qui déclenche l'affichage
  };
}

export interface IFormSettings {
  submitButtonText: string;
  successMessage?: string;
  errorMessage?: string;
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    backgroundColor?: string;
  };
  notifications?: {
    email?: string; // Email de notification
    webhook?: string; // URL de webhook
  };
}

export interface IFormSchema {
  fields: IFormField[];
  settings: IFormSettings;
}

export interface IFormVersion {
  id: string;
  versionNumber: number;
  schema: IFormSchema;
  createdAt: string;
  fields: IFormField[];
}

export interface IForm {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  schema: IFormSchema;
  submissionsCount?: number;
  currentVersion?: IFormVersion;
  versions?: IFormVersion[];
}

// Types pour les requêtes
export interface ICreateFormRequest {
  title: string;
  description: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  schema?: IFormSchema;
}

export interface IUpdateFormRequest {
  title?: string;
  description?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  schema?: IFormSchema;
}

export interface ICreateVersionRequest {
  schema: IFormSchema;
}

// Types pour les réponses paginées
export interface IFormListResponse {
  success: boolean;
  data?: IForm[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

export interface IFormResponse {
  success: boolean;
  data?: IForm;
  message?: string;
}

export interface IVersionListResponse {
  success: boolean;
  data?: IFormVersion[];
  message?: string;
}

export interface IVersionResponse {
  success: boolean;
  data?: IFormVersion;
  message?: string;
}

export interface IEmbedResponse {
  success: boolean;
  data?: {
    embedCode: string;
    embedUrl: string;
    token: string;
    customization: {
      width: string;
      height: string;
      border?: string;
      borderRadius?: string;
      boxShadow?: string;
    };
  };
  message?: string;
}

// Paramètres de requête
export interface IFormQueryParams {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  search?: string;
}

export interface IEmbedQueryParams {
  width?: string;
  height?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
}
