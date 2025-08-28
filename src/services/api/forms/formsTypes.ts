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
  position: number; // Requis par l'API selon le payload
  // Options pour les champs select et radio selon le format attendu par l'API
  options?: Array<{
    value: string;
    label: string;
  }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditional?: {
    field: string; // ID du champ condition
    value: string | number | boolean; // Valeur qui déclenche l'affichage - selon le contrat API
  };
}

export interface IFormSettings {
  // Structure réelle de l'API (différente du contrat documenté)
  submitButton: {
    text: string;
  };
  successMessage?: string;
  errorMessage?: string;
  theme?: {
    primaryColor?: string;
    fontFamily?: string;
    backgroundColor?: string;
  };
  emailNotification?: {
    enabled: boolean;
    recipients: string[];
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
