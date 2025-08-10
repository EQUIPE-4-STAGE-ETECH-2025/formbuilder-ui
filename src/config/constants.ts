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

// Configuration des couleurs pour les graphiques
export const CHART_COLORS = {
  // Couleurs principales pour les graphiques
  primary: "#8b5cf6", // Violet
  secondary: "#10b981", // Vert émeraude
  accent: "#f59e0b", // Orange ambré
  danger: "#ef4444", // Rouge
  warning: "#f97316", // Orange
  info: "#06b6d4", // Cyan
  success: "#22c55e", // Vert
  purple: "#a855f7", // Violet foncé
  pink: "#ec4899", // Rose
  indigo: "#6366f1", // Indigo

  // Couleurs pour les états des formulaires
  published: "#10b981", // Vert émeraude
  draft: "#f59e0b", // Orange ambré
  disabled: "#ef4444", // Rouge

  // Couleurs pour les plans d'abonnement
  free: "#6b7280", // Gris
  premium: "#8b5cf6", // Violet
  pro: "#f59e0b", // Orange ambré

  // Couleurs pour les revenus
  revenue: "#10b981", // Vert émeraude
} as const;

// Configuration des couleurs du thème sombre
export const DARK_THEME_COLORS = {
  background: "#0a0a0a",
  surface: "#262626",
  surfaceHover: "#404040",
  text: "#ffffff",
  textSecondary: "#a3a3a3",
  border: "#525252",
  grid: "#404040",
} as const;

// Configuration des couleurs d'accent
export const ACCENT_COLORS = {
  primary: "#0ea5e9", // Bleu original
  secondary: "#0284c7",
  hover: "#0369a1",
} as const;
