import {
  IDashboardStats,
  IFeature,
  IForm,
  IFormVersion,
  IPlan,
  IQuotaStatus,
  ISubmission,
  ISubscription,
  IUser,
  TApiResponse,
} from "../types";

// Types locaux
interface ILoginResponse {
  token: string;
  user: IUser;
}

interface IRegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Constantes
const API_DELAY = {
  FAST: 200,
  MEDIUM: 400,
  SLOW: 800,
  VERY_SLOW: 1000,
};

// Données mockées conformes au schéma Supabase
const mockUsers: IUser[] = [
  {
    id: "user-1",
    first_name: "Anna",
    last_name: "Martin",
    email: "anna@example.com",
    password_hash: "hashed_password",
    is_email_verified: true,
    role: "USER",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "admin-1",
    first_name: "Admin",
    last_name: "System",
    email: "admin@formbuilder.com",
    password_hash: "hashed_password",
    is_email_verified: true,
    role: "ADMIN",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

const mockPlans: IPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    price_cents: 0,
    stripe_product_id: "prod_free",
    max_forms: 3,
    max_submissions_per_month: 500,
    max_storage_mb: 10,
  },
  {
    id: "plan-premium",
    name: "Premium",
    price_cents: 2900,
    stripe_product_id: "prod_premium",
    max_forms: 20,
    max_submissions_per_month: 10000,
    max_storage_mb: 100,
  },
  {
    id: "plan-pro",
    name: "Pro",
    price_cents: 9900,
    stripe_product_id: "prod_pro",
    max_forms: -1,
    max_submissions_per_month: 100000,
    max_storage_mb: 500,
  },
];

const mockSubscriptions: ISubscription[] = [
  {
    id: "sub-1",
    user_id: "user-1",
    plan_id: "plan-premium",
    stripe_subscription_id: "sub_premium_123",
    start_date: "2024-01-15",
    end_date: "2025-01-15",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
];

const mockForms: IForm[] = [
  {
    id: "form-1",
    user_id: "user-1",
    title: "Contact Lead Generation",
    description: "Formulaire de contact pour prospects",
    status: "published",
    published_at: "2024-07-10T15:30:00Z",
    created_at: "2024-06-15T10:00:00Z",
    updated_at: "2024-07-10T15:30:00Z",
    submissionCount: 2,
    version: 2,
    fields: [
      {
        id: "field-1",
        form_version_id: "version-2",
        label: "Nom complet",
        type: "text",
        is_required: true,
        placeholder: "Votre nom",
        options: {
          placeholder: "Votre nom",
        },
        position: 1,
        order: 1,
        validation_rules: {
          required: true,
          min_length: 2,
        },
      },
      {
        id: "field-2",
        form_version_id: "version-2",
        label: "Email",
        type: "email",
        is_required: true,
        placeholder: "votre@email.com",
        options: {
          placeholder: "votre@email.com",
        },
        position: 2,
        order: 2,
        validation_rules: {
          required: true,
          pattern: "^[^@]+@[^@]+\\.[^@]+$",
        },
      },
      {
        id: "field-3",
        form_version_id: "version-2",
        label: "Message",
        type: "textarea",
        is_required: false,
        placeholder: "Votre message",
        options: {
          placeholder: "Votre message",
        },
        position: 3,
        order: 3,
        validation_rules: {
          required: false,
          max_length: 1000,
        },
      },
    ],
    history: {
      versions: [
        {
          id: "version-1",
          form_id: "form-1",
          version_number: 1,
          schema: {
            title: "Contact Lead Generation",
            description: "Formulaire de contact pour prospects",
            status: "draft",
            fields: [
              {
                id: "field-1",
                form_version_id: "version-1",
                label: "Nom complet",
                type: "text",
                is_required: true,
                placeholder: "Votre nom",
                options: {
                  placeholder: "Votre nom",
                },
                position: 1,
                order: 1,
                validation_rules: {
                  required: true,
                  min_length: 2,
                },
              },
              {
                id: "field-2",
                form_version_id: "version-1",
                label: "Email",
                type: "email",
                is_required: true,
                placeholder: "votre@email.com",
                options: {
                  placeholder: "votre@email.com",
                },
                position: 2,
                order: 2,
                validation_rules: {
                  required: true,
                  pattern: "^[^@]+@[^@]+\\.[^@]+$",
                },
              },
            ],
            settings: {
              theme: {
                primary_color: "#3B82F6",
                background_color: "#FFFFFF",
                text_color: "#1F2937",
              },
              success_message: "Merci pour votre message !",
              notifications: {
                email: true,
              },
            },
          },
          created_at: "2024-06-15T10:00:00Z",
        },
        {
          id: "version-2",
          form_id: "form-1",
          version_number: 2,
          schema: {
            title: "Contact Lead Generation",
            description: "Formulaire de contact pour prospects",
            status: "published",
            fields: [
              {
                id: "field-1",
                form_version_id: "version-2",
                label: "Nom complet",
                type: "text",
                is_required: true,
                placeholder: "Votre nom",
                options: {
                  placeholder: "Votre nom",
                },
                position: 1,
                order: 1,
                validation_rules: {
                  required: true,
                  min_length: 2,
                },
              },
              {
                id: "field-2",
                form_version_id: "version-2",
                label: "Email",
                type: "email",
                is_required: true,
                placeholder: "votre@email.com",
                options: {
                  placeholder: "votre@email.com",
                },
                position: 2,
                order: 2,
                validation_rules: {
                  required: true,
                  pattern: "^[^@]+@[^@]+\\.[^@]+$",
                },
              },
              {
                id: "field-3",
                form_version_id: "version-2",
                label: "Message",
                type: "textarea",
                is_required: false,
                placeholder: "Votre message",
                options: {
                  placeholder: "Votre message",
                },
                position: 3,
                order: 3,
                validation_rules: {
                  required: false,
                  max_length: 1000,
                },
              },
            ],
            settings: {
              theme: {
                primary_color: "#3B82F6",
                background_color: "#FFFFFF",
                text_color: "#1F2937",
              },
              success_message: "Merci pour votre message !",
              notifications: {
                email: true,
              },
            },
          },
          created_at: "2024-07-10T15:30:00Z",
        },
      ],
      currentVersion: 2,
      maxVersions: 10,
    },
    settings: {
      theme: {
        primary_color: "#3B82F6",
        background_color: "#FFFFFF",
        text_color: "#1F2937",
      },
      success_message: "Merci pour votre message !",
      notifications: {
        email: true,
      },
    },
  },
  {
    id: "form-2",
    user_id: "user-1",
    title: "Inscription Newsletter",
    description: "Collecte d'emails pour la newsletter",
    status: "published",
    published_at: "2024-05-20T14:00:00Z",
    created_at: "2024-05-20T14:00:00Z",
    updated_at: "2024-07-12T09:15:00Z",
    submissionCount: 0,
    version: 1,
    fields: [
      {
        id: "field-newsletter-1",
        form_version_id: "version-3",
        label: "Prénom",
        type: "text",
        is_required: true,
        placeholder: "Votre prénom",
        options: {
          placeholder: "Votre prénom",
        },
        position: 1,
        order: 1,
        validation_rules: {
          required: true,
          min_length: 2,
        },
      },
      {
        id: "field-newsletter-2",
        form_version_id: "version-3",
        label: "Email",
        type: "email",
        is_required: true,
        placeholder: "votre@email.com",
        options: {
          placeholder: "votre@email.com",
        },
        position: 2,
        order: 2,
        validation_rules: {
          required: true,
          pattern: "^[^@]+@[^@]+\\.[^@]+$",
        },
      },
      {
        id: "field-newsletter-3",
        form_version_id: "version-3",
        label: "Fréquence de réception",
        type: "select",
        is_required: false,
        placeholder: "Choisissez une fréquence",
        options: {
          placeholder: "Choisissez une fréquence",
          choices: ["Quotidienne", "Hebdomadaire", "Mensuelle"],
        },
        position: 3,
        order: 3,
        validation_rules: {},
      },
      {
        id: "field-newsletter-4",
        form_version_id: "version-3",
        label: "J'accepte de recevoir des emails promotionnels",
        type: "checkbox",
        is_required: false,
        options: {},
        position: 4,
        order: 4,
        validation_rules: {},
      },
    ],
    history: {
      versions: [
        {
          id: "version-3",
          form_id: "form-2",
          version_number: 1,
          schema: {
            title: "Inscription Newsletter",
            description: "Collecte d'emails pour la newsletter",
            status: "published",
            fields: [
              {
                id: "field-newsletter-1",
                form_version_id: "version-3",
                label: "Prénom",
                type: "text",
                is_required: true,
                placeholder: "Votre prénom",
                options: {
                  placeholder: "Votre prénom",
                },
                position: 1,
                order: 1,
                validation_rules: {
                  required: true,
                  min_length: 2,
                },
              },
              {
                id: "field-newsletter-2",
                form_version_id: "version-3",
                label: "Email",
                type: "email",
                is_required: true,
                placeholder: "votre@email.com",
                options: {
                  placeholder: "votre@email.com",
                },
                position: 2,
                order: 2,
                validation_rules: {
                  required: true,
                  pattern: "^[^@]+@[^@]+\\.[^@]+$",
                },
              },
              {
                id: "field-newsletter-3",
                form_version_id: "version-3",
                label: "Fréquence de réception",
                type: "select",
                is_required: false,
                placeholder: "Choisissez une fréquence",
                options: {
                  placeholder: "Choisissez une fréquence",
                  choices: ["Quotidienne", "Hebdomadaire", "Mensuelle"],
                },
                position: 3,
                order: 3,
                validation_rules: {},
              },
              {
                id: "field-newsletter-4",
                form_version_id: "version-3",
                label: "J'accepte de recevoir des emails promotionnels",
                type: "checkbox",
                is_required: false,
                options: {},
                position: 4,
                order: 4,
                validation_rules: {},
              },
            ],
            settings: {
              theme: {
                primary_color: "#3B82F6",
                background_color: "#FFFFFF",
                text_color: "#1F2937",
              },
              success_message: "Merci pour votre inscription !",
              notifications: {
                email: true,
              },
            },
          },
          created_at: "2024-05-20T14:00:00Z",
        },
      ],
      currentVersion: 1,
      maxVersions: 10,
    },
    settings: {
      theme: {
        primary_color: "#3B82F6",
        background_color: "#FFFFFF",
        text_color: "#1F2937",
      },
      success_message: "Merci pour votre inscription !",
      notifications: {
        email: true,
      },
    },
  },
];

const mockFormVersions: IFormVersion[] = [
  {
    id: "version-1",
    form_id: "form-1",
    version_number: 1,
    schema: {
      title: "Contact Lead Generation",
      description: "Formulaire de contact pour prospects",
      status: "draft",
      fields: [
        {
          id: "field-1",
          form_version_id: "version-1",
          label: "Nom complet",
          type: "text",
          is_required: true,
          options: {
            placeholder: "Votre nom",
          },
          position: 1,
          order: 1,
          validation_rules: {
            required: true,
            min_length: 2,
          },
        },
        {
          id: "field-2",
          form_version_id: "version-1",
          label: "Email",
          type: "email",
          is_required: true,
          options: {
            placeholder: "votre@email.com",
          },
          position: 2,
          order: 2,
          validation_rules: {
            required: true,
            pattern: "^[^@]+@[^@]+\\.[^@]+$",
          },
        },
      ],
      settings: {
        theme: {
          primary_color: "#3B82F6",
          background_color: "#FFFFFF",
          text_color: "#1F2937",
        },
        success_message: "Merci pour votre message !",
        notifications: {
          email: true,
        },
      },
    },
    created_at: "2024-06-15T10:00:00Z",
  },
  {
    id: "version-2",
    form_id: "form-1",
    version_number: 2,
    schema: {
      title: "Contact Lead Generation",
      description: "Formulaire de contact pour prospects",
      status: "published",
      fields: [
        {
          id: "field-1",
          form_version_id: "version-2",
          label: "Nom complet",
          type: "text",
          is_required: true,
          options: {
            placeholder: "Votre nom",
          },
          position: 1,
          order: 1,
          validation_rules: {
            required: true,
            min_length: 2,
          },
        },
        {
          id: "field-2",
          form_version_id: "version-2",
          label: "Email",
          type: "email",
          is_required: true,
          options: {
            placeholder: "votre@email.com",
          },
          position: 2,
          order: 2,
          validation_rules: {
            required: true,
            pattern: "^[^@]+@[^@]+\\.[^@]+$",
          },
        },
        {
          id: "field-3",
          form_version_id: "version-2",
          label: "Message",
          type: "textarea",
          is_required: false,
          options: {
            placeholder: "Votre message",
          },
          position: 3,
          order: 3,
          validation_rules: {
            required: false,
            max_length: 1000,
          },
        },
      ],
      settings: {
        theme: {
          primary_color: "#3B82F6",
          background_color: "#FFFFFF",
          text_color: "#1F2937",
        },
        success_message: "Merci pour votre message !",
        notifications: {
          email: true,
        },
      },
    },
    created_at: "2024-07-10T15:30:00Z",
  },
];

const mockSubmissions: ISubmission[] = [
  {
    id: "sub-1",
    form_id: "form-1",
    data: {
      "field-1": "Jean Dupont",
      "field-2": "jean@example.com",
      "field-3": "Intéressé par vos services",
    },
    submitted_at: "2024-07-14T10:30:00Z",
    ip_address: "192.168.1.1",
  },
  {
    id: "sub-2",
    form_id: "form-1",
    data: {
      "field-1": "Marie Dubois",
      "field-2": "marie@example.com",
      "field-3": "Demande de devis",
    },
    submitted_at: "2024-07-13T16:45:00Z",
    ip_address: "192.168.1.2",
  },
];

const mockQuotaStatus: IQuotaStatus[] = [
  {
    id: "quota-1",
    user_id: "user-1",
    month: "2024-07",
    form_count: 8,
    submission_count: 2340,
    storage_used_mb: 25,
    notified80: false,
    notified100: false,
  },
];

const mockFeatures: IFeature[] = [
  {
    id: "feature-1",
    code: "unlimited_forms",
    label: "Formulaires illimités",
  },
  {
    id: "feature-2",
    code: "webhooks",
    label: "Webhooks",
  },
  {
    id: "feature-3",
    code: "api_access",
    label: "Accès API",
  },
];

// Fonctions utilitaires
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Service d'authentification
export const authAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<TApiResponse<ILoginResponse>> => {
    try {
      await delay(API_DELAY.SLOW);
      const user = mockUsers.find((u) => u.email === email);

      if (user && password === "password123") {
        return {
          success: true,
          data: {
            token: "mock-jwt-token",
            user,
          },
        };
      }

      return {
        success: false,
        error: "Identifiants invalides",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la connexion",
      };
    }
  },

  register: async (userData: IRegisterData): Promise<TApiResponse<null>> => {
    try {
      await delay(API_DELAY.VERY_SLOW);
      const existingUser = mockUsers.find((u) => u.email === userData.email);

      if (existingUser) {
        return {
          success: false,
          error: "Cet email existe déjà",
        };
      }

      return {
        success: true,
        message: "Inscription réussie. Veuillez vérifier votre email.",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de l'inscription",
      };
    }
  },

  me: async (): Promise<TApiResponse<IUser>> => {
    try {
      await delay(API_DELAY.FAST);
      return {
        success: true,
        data: mockUsers[0],
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération du profil",
      };
    }
  },
};

// Service des formulaires
export const formsAPI = {
  getAll: async (): Promise<TApiResponse<IForm[]>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      return {
        success: true,
        data: mockForms,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des formulaires",
      };
    }
  },

  getById: async (id: string): Promise<TApiResponse<IForm>> => {
    try {
      await delay(API_DELAY.FAST);
      const form = mockForms.find((f) => f.id === id);

      if (form) {
        return {
          success: true,
          data: form,
        };
      }

      return {
        success: false,
        error: "Formulaire non trouvé",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération du formulaire",
      };
    }
  },

  create: async (formData: Partial<IForm>): Promise<TApiResponse<IForm>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const newForm: IForm = {
        id: `form-${Date.now()}`,
        user_id: "user-1",
        title: formData.title || "Nouveau formulaire",
        description: formData.description || "",
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submissionCount: 0,
        version: 1,
        fields: [],
        history: {
          versions: [],
          currentVersion: 1,
          maxVersions: 10,
        },
        settings: {
          theme: {
            primary_color: "#3B82F6",
            background_color: "#FFFFFF",
            text_color: "#1F2937",
          },
          success_message: "Merci pour votre soumission !",
          notifications: {
            email: true,
          },
        },
      };

      mockForms.push(newForm);
      return {
        success: true,
        data: newForm,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la création du formulaire",
      };
    }
  },

  update: async (
    id: string,
    formData: Partial<IForm>
  ): Promise<TApiResponse<IForm>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const index = mockForms.findIndex((f) => f.id === id);

      if (index !== -1) {
        mockForms[index] = {
          ...mockForms[index],
          ...formData,
          updated_at: new Date().toISOString(),
        };

        return {
          success: true,
          data: mockForms[index],
        };
      }

      return {
        success: false,
        error: "Formulaire non trouvé",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la mise à jour du formulaire",
      };
    }
  },

  delete: async (id: string): Promise<TApiResponse<null>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const index = mockForms.findIndex((f) => f.id === id);

      if (index !== -1) {
        mockForms.splice(index, 1);
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: "Formulaire non trouvé",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la suppression du formulaire",
      };
    }
  },
};

// Service des versions de formulaires
export const formVersionsAPI = {
  getByFormId: async (
    formId: string
  ): Promise<TApiResponse<IFormVersion[]>> => {
    try {
      await delay(API_DELAY.FAST);
      const versions = mockFormVersions.filter((v) => v.form_id === formId);
      return {
        success: true,
        data: versions,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des versions",
      };
    }
  },

  getById: async (id: string): Promise<TApiResponse<IFormVersion>> => {
    try {
      await delay(API_DELAY.FAST);
      const version = mockFormVersions.find((v) => v.id === id);

      if (version) {
        return {
          success: true,
          data: version,
        };
      }

      return {
        success: false,
        error: "Version non trouvée",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération de la version",
      };
    }
  },

  create: async (
    formId: string,
    schema: IFormVersion["schema"]
  ): Promise<TApiResponse<IFormVersion>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const existingVersions = mockFormVersions.filter(
        (v) => v.form_id === formId
      );
      const nextVersion = existingVersions.length + 1;

      const newVersion: IFormVersion = {
        id: `version-${Date.now()}`,
        form_id: formId,
        version_number: nextVersion,
        schema,
        created_at: new Date().toISOString(),
      };

      mockFormVersions.push(newVersion);
      return {
        success: true,
        data: newVersion,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la création de la version",
      };
    }
  },

  restore: async (versionId: string): Promise<TApiResponse<IFormVersion>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const version = mockFormVersions.find((v) => v.id === versionId);

      if (!version) {
        return {
          success: false,
          error: "Version non trouvée",
        };
      }

      // Créer une nouvelle version avec le schéma de la version restaurée
      const newVersion: IFormVersion = {
        id: `version-${Date.now()}`,
        form_id: version.form_id,
        version_number: version.version_number + 1,
        schema: version.schema,
        created_at: new Date().toISOString(),
      };

      mockFormVersions.push(newVersion);
      return {
        success: true,
        data: newVersion,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la restauration de la version",
      };
    }
  },

  delete: async (versionId: string): Promise<TApiResponse<null>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const index = mockFormVersions.findIndex((v) => v.id === versionId);

      if (index !== -1) {
        mockFormVersions.splice(index, 1);
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: "Version non trouvée",
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la suppression de la version",
      };
    }
  },
};

// Service des soumissions
export const submissionsAPI = {
  getByFormId: async (formId: string): Promise<TApiResponse<ISubmission[]>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const submissions = mockSubmissions.filter((s) => s.form_id === formId);
      return {
        success: true,
        data: submissions,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des soumissions",
      };
    }
  },

  exportCsv: async (formId: string): Promise<TApiResponse<string>> => {
    try {
      await delay(API_DELAY.VERY_SLOW);
      const submissions = mockSubmissions.filter((s) => s.form_id === formId);
      const versions = mockFormVersions.filter((v) => v.form_id === formId);
      const latestVersion = versions[versions.length - 1];

      if (!latestVersion) {
        return {
          success: false,
          error: "Formulaire non trouvé",
        };
      }

      let csv = "Date;IP;";
      latestVersion.schema.fields.forEach((field) => {
        csv += `${field.label};`;
      });
      csv += "\n";

      submissions.forEach((submission) => {
        csv += `${new Date(submission.submitted_at).toLocaleDateString()};${
          submission.ip_address
        };`;
        latestVersion.schema.fields.forEach((field) => {
          csv += `${submission.data[field.id] || ""};`;
        });
        csv += "\n";
      });

      return {
        success: true,
        data: csv,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de l'export CSV",
      };
    }
  },
};

// Service des plans et abonnements
export const plansAPI = {
  getAll: async (): Promise<TApiResponse<IPlan[]>> => {
    try {
      await delay(API_DELAY.FAST);
      return {
        success: true,
        data: mockPlans,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des plans",
      };
    }
  },
};

export const subscriptionsAPI = {
  getByUserId: async (
    userId: string
  ): Promise<TApiResponse<ISubscription[]>> => {
    try {
      await delay(API_DELAY.FAST);
      const subscriptions = mockSubscriptions.filter(
        (s) => s.user_id === userId
      );
      return {
        success: true,
        data: subscriptions,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des abonnements",
      };
    }
  },
};

// Service des quotas
export const quotaAPI = {
  getByUserId: async (
    userId: string
  ): Promise<TApiResponse<IQuotaStatus[]>> => {
    try {
      await delay(API_DELAY.FAST);
      const quotas = mockQuotaStatus.filter((q) => q.user_id === userId);
      return {
        success: true,
        data: quotas,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des quotas",
      };
    }
  },
};

// Service des fonctionnalités
export const featuresAPI = {
  getAll: async (): Promise<TApiResponse<IFeature[]>> => {
    try {
      await delay(API_DELAY.FAST);
      return {
        success: true,
        data: mockFeatures,
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des fonctionnalités",
      };
    }
  },
};

// Service du tableau de bord
export const dashboardAPI = {
  getStats: async (): Promise<TApiResponse<IDashboardStats>> => {
    try {
      await delay(API_DELAY.MEDIUM);
      const submissionsThisMonth = mockSubmissions.filter((s) => {
        const date = new Date(s.submitted_at);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length;

      const currentQuota = mockQuotaStatus[0];
      const currentSubscription = mockSubscriptions[0];
      const currentPlan = mockPlans.find(
        (p) => p.id === currentSubscription?.plan_id
      );

      return {
        success: true,
        data: {
          total_forms: mockForms.length,
          total_submissions: mockSubmissions.length,
          published_forms: mockForms.filter((f) => f.status === "published")
            .length,
          submissions_this_month: submissionsThisMonth,
          recent_submissions: mockSubmissions.slice(-5).reverse(),
          quota_usage: {
            forms_used: currentQuota?.form_count || 0,
            forms_limit: currentPlan?.max_forms || 0,
            submissions_used: currentQuota?.submission_count || 0,
            submissions_limit: currentPlan?.max_submissions_per_month || 0,
            storage_used_mb: currentQuota?.storage_used_mb || 0,
            storage_limit_mb: currentPlan?.max_storage_mb || 0,
          },
        },
      };
    } catch {
      return {
        success: false,
        error: "Erreur lors de la récupération des statistiques",
      };
    }
  },
};
