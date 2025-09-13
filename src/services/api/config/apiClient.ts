import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  setupAuthInterceptors,
  setupErrorInterceptors,
  setupLoggingInterceptors,
} from "./interceptors";

// Configuration mise en cache pour éviter les lectures répétées
class ApiConfig {
  private static instance: ApiConfig;
  public readonly baseURL: string;
  public readonly timeout: number;
  public readonly retryAttempts: number;
  public readonly defaultConfig: AxiosRequestConfig;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");
    this.retryAttempts = parseInt(
      import.meta.env.VITE_API_RETRY_ATTEMPTS || "3"
    );

    this.defaultConfig = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    };
  }

  public static getInstance(): ApiConfig {
    if (!ApiConfig.instance) {
      ApiConfig.instance = new ApiConfig();
    }
    return ApiConfig.instance;
  }
}

const apiConfig = ApiConfig.getInstance();

// Création de l'instance axios
const apiClient: AxiosInstance = axios.create(apiConfig.defaultConfig);

// Configuration des intercepteurs
setupAuthInterceptors(apiClient);
setupErrorInterceptors(apiClient);
setupLoggingInterceptors(apiClient);

// Cache pour les timeouts actifs pour éviter les fuites mémoire
const activeTimeouts = new Set<number>();

// Fonction utilitaire pour les retry optimisée
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = apiConfig.retryAttempts
): Promise<T> => {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Ne pas retry sur les erreurs 4xx (sauf 429) - optimisation avec early return
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }

      // Attendre avant le retry (backoff exponentiel optimisé)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * (1 << (attempt - 1)), 5000); // Bitwise shift pour performance
        const timeoutId = setTimeout(() => {
          activeTimeouts.delete(timeoutId);
        }, delay);
        activeTimeouts.add(timeoutId);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

// Nettoyage des timeouts au besoin
export const clearActiveTimeouts = (): void => {
  activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  activeTimeouts.clear();
};

export { apiClient, retryRequest };
export default apiClient;
