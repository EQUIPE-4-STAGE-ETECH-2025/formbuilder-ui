// Clés de requête pour React Query - Conformes au schéma Supabase
export const QUERY_KEYS = {
  // Utilisateurs
  USERS: "users",
  USER: (id: string) => ["users", id],
  USER_PROFILE: (id: string) => ["users", id, "profile"],

  // Formulaires
  FORMS: "forms",
  FORM: (id: string) => ["forms", id],
  USER_FORMS: (userId: string) => ["users", userId, "forms"],

  // Versions de formulaires
  FORM_VERSIONS: (formId: string) => ["forms", formId, "versions"],
  FORM_VERSION: (formId: string, versionNumber: number) => [
    "forms",
    formId,
    "versions",
    versionNumber,
  ],

  // Champs de formulaires
  FORM_FIELDS: (formVersionId: string) => [
    "form-versions",
    formVersionId,
    "fields",
  ],
  FORM_FIELD: (id: string) => ["form-fields", id],

  // Soumissions
  SUBMISSIONS: "submissions",
  FORM_SUBMISSIONS: (formId: string) => ["forms", formId, "submissions"],
  SUBMISSION: (id: string) => ["submissions", id],

  // Plans et abonnements
  PLANS: "plans",
  PLAN: (id: string) => ["plans", id],
  SUBSCRIPTIONS: "subscriptions",
  USER_SUBSCRIPTIONS: (userId: string) => ["users", userId, "subscriptions"],
  SUBSCRIPTION: (id: string) => ["subscriptions", id],

  // Fonctionnalités
  FEATURES: "features",
  FEATURE: (id: string) => ["features", id],
  PLAN_FEATURES: (planId: string) => ["plans", planId, "features"],

  // Quotas
  QUOTAS: "quotas",
  USER_QUOTAS: (userId: string) => ["users", userId, "quotas"],
  QUOTA_STATUS: (userId: string, month: string) => [
    "users",
    userId,
    "quotas",
    month,
  ],

  // Audit
  AUDIT_LOGS: "audit-logs",
  USER_AUDIT_LOGS: (userId: string) => ["users", userId, "audit-logs"],

  // Jetons de formulaires
  FORM_TOKENS: (formId: string) => ["forms", formId, "tokens"],
  FORM_TOKEN: (id: string) => ["form-tokens", id],

  // Tableau de bord
  DASHBOARD_STATS: "dashboard-stats",
  USER_DASHBOARD_STATS: (userId: string) => [
    "users",
    userId,
    "dashboard-stats",
  ],

  // Statistiques
  STATS: "stats",
  FORM_STATS: (formId: string) => ["forms", formId, "stats"],
  USER_STATS: (userId: string) => ["users", userId, "stats"],
} as const;

// Types pour les clés de requête
export type TQueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
