import {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Types pour les intercepteurs
interface IRefreshResponse {
  token: string;
  refresh_token?: string;
}

// Configuration des intercepteurs pour l'authentification
export const setupAuthInterceptors = (apiClient: AxiosInstance): void => {
  // Intercepteur de requête pour ajouter le token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(
        import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token"
      );
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse pour gérer l'expiration du token
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Gestion de l'expiration du token (401)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem(
            import.meta.env.VITE_JWT_REFRESH_KEY || "formbuilder_refresh_token"
          );
          if (refreshToken) {
            const response = await apiClient.post("/auth/refresh", {
              refresh_token: refreshToken,
            });

            const { token, refresh_token } = response.data as IRefreshResponse;

            // Mettre à jour les tokens
            localStorage.setItem(
              import.meta.env.VITE_JWT_STORAGE_KEY || "formbuilder_token",
              token
            );
            if (refresh_token) {
              localStorage.setItem(
                import.meta.env.VITE_JWT_REFRESH_KEY ||
                  "formbuilder_refresh_token",
                refresh_token
              );
            }

            // Retry de la requête originale
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          }
        } catch {
          // Échec du refresh, déconnexion
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

// Configuration des intercepteurs pour les erreurs
export const setupErrorInterceptors = (apiClient: AxiosInstance): void => {
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // Gestion des erreurs communes
      if (error.response) {
        const { status, data } = error.response;

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

// Configuration des intercepteurs pour le logging (en développement)
export const setupLoggingInterceptors = (apiClient: AxiosInstance): void => {
  if (import.meta.env.DEV) {
    apiClient.interceptors.request.use(
      (config) => {
        console.log("🚀 Requête API:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        console.error("❌ Erreur de requête:", error);
        return Promise.reject(error);
      }
    );

    apiClient.interceptors.response.use(
      (response) => {
        console.log("✅ Réponse API:", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("❌ Erreur de réponse:", {
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }
};
