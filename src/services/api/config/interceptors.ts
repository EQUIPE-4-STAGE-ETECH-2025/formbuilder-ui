import {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { QuotaExceededError } from "../quotas/quotaTypes";

const PUBLIC_ENDPOINTS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/verify-email",
]);

// Cache des clés de storage pour éviter les lectures répétées
const STORAGE_KEYS = {
  TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token",
  REFRESH_TOKEN:
    import.meta.env.VITE_JWT_REFRESH_KEY || "formbuilder_refresh_token",
} as const;

// Types pour la gestion des tokens
interface IFailedRequest {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}

// Mutex pour éviter les refresh concurrents
let isRefreshing = false;
let failedQueue: IFailedRequest[] = [];

// Fonction utilitaire pour vérifier si un endpoint est public
const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return Array.from(PUBLIC_ENDPOINTS).some((endpoint) =>
    url.includes(endpoint)
  );
};

// Fonctions pour gérer la queue de refresh
const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAuthInterceptors = (apiClient: AxiosInstance): void => {
  // Intercepteur de requête pour ajouter le token
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Ne pas ajouter le token pour login ou refresh
    if (isPublicEndpoint(config.url)) {
      delete config.headers?.Authorization;
      return config;
    }

    // Vérifier d'abord localStorage, puis sessionStorage
    const token =
      localStorage.getItem(STORAGE_KEYS.TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Intercepteur de réponse pour gérer l'expiration du token
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;

      // Ne pas refresh sur login ou refresh
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isPublicEndpoint(originalRequest.url)
      ) {
        // Si un refresh est déjà en cours, ajouter la requête à la queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(apiClient(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Vérifier d'abord localStorage, puis sessionStorage pour le refresh token
          const refreshToken =
            localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
            sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

          if (refreshToken) {
            const response = await apiClient.post("/api/auth/refresh", {
              refresh_token: refreshToken,
            });

            const { token } = response.data.data as { token: string };

            // Stocker le nouveau token dans le même type de storage que l'ancien
            if (localStorage.getItem(STORAGE_KEYS.TOKEN)) {
              localStorage.setItem(STORAGE_KEYS.TOKEN, token);
            } else {
              sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
            }

            // Traiter la queue des requêtes en attente
            processQueue(null, token);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Échec du refresh → déconnexion
          processQueue(
            refreshError instanceof Error
              ? refreshError
              : new Error("Refresh failed"),
            null
          );
          // Nettoyer les deux types de stockage
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
          sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          window.location.href = "/login";
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

// Cache pour les erreurs déjà loggées pour éviter les doublons
const loggedErrors = new Set<string>();

export const setupErrorInterceptors = (apiClient: AxiosInstance): void => {
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        // Gestion spéciale pour les erreurs de quota
        if (status === 429 && data?.error === "Quota dépassé" && data?.data) {
          return Promise.reject(new QuotaExceededError(data.data));
        }

        // Éviter les logs redondants en mode développement
        const errorKey = `${status}-${error.config?.url}`;
        if (import.meta.env.DEV && !loggedErrors.has(errorKey)) {
          loggedErrors.add(errorKey);

          const errorMessages: Record<number, string> = {
            400: "Erreur de validation",
            403: "Accès refusé",
            404: "Ressource non trouvée",
            500: "Erreur serveur",
          };

          const message = errorMessages[status] || "Erreur API";
          console.error(`${message}:`, {
            status,
            url: error.config?.url,
            data,
          });
        }
      } else if (error.request && import.meta.env.DEV) {
        console.error("Erreur de réseau:", error.request);
      } else if (import.meta.env.DEV) {
        console.error("Erreur de configuration:", error.message);
      }

      return Promise.reject(error);
    }
  );
};

// Throttling pour les logs
const logThrottle = new Map<string, number>();
const LOG_THROTTLE_MS = 1000; // 1 seconde

const shouldLog = (key: string): boolean => {
  const now = Date.now();
  const lastLog = logThrottle.get(key);

  if (!lastLog || now - lastLog > LOG_THROTTLE_MS) {
    logThrottle.set(key, now);
    return true;
  }

  return false;
};

export const setupLoggingInterceptors = (apiClient: AxiosInstance): void => {
  // Ne logger qu'en mode développement avec throttling
  if (import.meta.env.DEV) {
    apiClient.interceptors.request.use(
      (config) => {
        const logKey = `req-${config.method}-${config.url}`;
        if (shouldLog(logKey)) {
          console.log("📤 Requête API:", {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasData: !!config.data,
          });
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
      (response) => {
        const logKey = `res-${response.status}-${response.config.url}`;
        if (shouldLog(logKey)) {
          console.log("📥 Réponse API:", {
            status: response.status,
            url: response.config.url,
            hasData: !!response.data,
          });
        }
        return response;
      },
      (error) => {
        // Les erreurs sont déjà loggées dans setupErrorInterceptors
        return Promise.reject(error);
      }
    );
  }
};

// Fonction pour nettoyer le cache de logs
export const clearLogCache = (): void => {
  logThrottle.clear();
  loggedErrors.clear();
};
