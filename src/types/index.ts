export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    maxForms: number;
    maxSubmissionsPerMonth: number;
    currentForms: number;
    currentSubmissions: number;
  };
  createdAt: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'disabled';
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
  fields: FormField[];
  settings: FormSettings;
  userId: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  order: number;
}

export interface FormSettings {
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  successMessage: string;
  redirectUrl?: string;
  notifications: {
    email: boolean;
    webhook?: string;
  };
}

export interface Submission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: string;
  ipAddress: string;
  userAgent?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxForms: number;
  maxSubmissions: number;
  popular?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}