// Configuration de l'application
export const APP_CONFIG = {
  NAME: "FormBuilder",
  VERSION: "1.0.0",
  DESCRIPTION: "Plateforme de création de formulaires en ligne",
} as const;

// Configuration des délais API
export const API_CONFIG = {
  DELAYS: {
    FAST: 200,
    MEDIUM: 400,
    SLOW: 800,
    VERY_SLOW: 1000,
  },
  TIMEOUT: 10000,
} as const;

// Configuration des messages d'erreur
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Identifiants invalides",
    EMAIL_EXISTS: "Cet email existe déjà",
    LOGIN_FAILED: "Erreur lors de la connexion",
    REGISTER_FAILED: "Erreur lors de l'inscription",
    PROFILE_FETCH_FAILED: "Erreur lors de la récupération du profil",
  },
  FORMS: {
    FETCH_FAILED: "Erreur lors du chargement des formulaires",
    CREATE_FAILED: "Erreur lors de la création du formulaire",
    UPDATE_FAILED: "Erreur lors de la mise à jour du formulaire",
    DELETE_FAILED: "Erreur lors de la suppression du formulaire",
    NOT_FOUND: "Formulaire non trouvé",
  },
  SUBMISSIONS: {
    FETCH_FAILED: "Erreur lors de la récupération des soumissions",
    EXPORT_FAILED: "Erreur lors de l'export CSV",
  },
  DASHBOARD: {
    STATS_FETCH_FAILED: "Erreur lors de la récupération des statistiques",
  },
  PLANS: {
    FETCH_FAILED: "Erreur lors de la récupération des plans",
  },
} as const;

// Configuration des statuts
export const STATUS_CONFIG = {
  FORM_STATUS: {
    DRAFT: "draft",
    PUBLISHED: "published",
    DISABLED: "disabled",
  },
  USER_ROLES: {
    USER: "USER",
    ADMIN: "ADMIN",
  },
  SUBSCRIPTION_PLANS: {
    FREE: "free",
    PREMIUM: "premium",
    PRO: "pro",
  },
} as const;

// Configuration des thèmes par défaut
export const THEME_CONFIG = {
  DEFAULT: {
    primaryColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  },
  SUCCESS: {
    primaryColor: "#10B981",
    backgroundColor: "#F9FAFB",
    textColor: "#374151",
  },
  WARNING: {
    primaryColor: "#F59E0B",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  },
  ERROR: {
    primaryColor: "#EF4444",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  },
} as const;

// Configuration des limites
export const LIMITS_CONFIG = {
  FORMS: {
    FREE: 3,
    PREMIUM: 20,
    PRO: -1, // Illimité
  },
  SUBMISSIONS: {
    FREE: 500,
    PREMIUM: 10000,
    PRO: 100000,
  },
  STORAGE: {
    FREE: 10, // MB
    PREMIUM: 100, // MB
    PRO: 500, // MB
  },
} as const;
