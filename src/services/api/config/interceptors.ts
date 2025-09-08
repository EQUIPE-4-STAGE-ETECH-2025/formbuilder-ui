import {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { QuotaExceededError } from "../quotas/quotaTypes";

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/verify-email",
];

export const setupAuthInterceptors = (apiClient: AxiosInstance): void => {
  // Intercepteur de requête pour ajouter le token
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Ne pas ajouter le token pour login ou refresh
    if (PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))) {
      delete config.headers?.Authorization;
      return config;
    }

    const token = localStorage.getItem(
      import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token"
    );
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
        !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url))
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem(
            import.meta.env.VITE_JWT_REFRESH_KEY || "formbuilder_refresh_token"
          );

          if (refreshToken) {
            const response = await apiClient.post("/api/auth/refresh", {
              refresh_token: refreshToken,
            });

            const { token } = response.data.data as { token: string };

            localStorage.setItem(
              import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token",
              token
            );

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            return apiClient(originalRequest);
          }
        } catch {
          // Échec du refresh → déconnexion
          localStorage.removeItem(
            import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token"
          );
          localStorage.removeItem(
            import.meta.env.VITE_JWT_REFRESH_KEY || "formbuilder_refresh_token"
          );
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
};

export const setupErrorInterceptors = (apiClient: AxiosInstance): void => {
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 429 && data?.error === "Quota dépassé" && data?.data) {
          const quotaError = new QuotaExceededError(data.data);
          return Promise.reject(quotaError);
        }

        switch (status) {
          case 400:
            console.error("Erreur de validation:", data);
            break;
          case 403:
            console.error("Accès refusé:", data);
            break;
          case 404:
            console.error("Ressource non trouvée:", data);
            break;
          case 500:
            console.error("Erreur serveur:", data);
            break;
          default:
            console.error("Erreur API:", data);
        }
      } else if (error.request) {
        console.error("Erreur de réseau:", error.request);
      } else {
        console.error("Erreur de configuration:", error.message);
      }

      return Promise.reject(error);
    }
  );
};

export const setupLoggingInterceptors = (apiClient: AxiosInstance): void => {
  if (import.meta.env.DEV) {
    apiClient.interceptors.request.use(
      (config) => {
        console.log("Requête API:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
      (response) => {
        console.log("Réponse API:", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("Erreur de réponse:", {
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }
};
