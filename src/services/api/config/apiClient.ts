import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  setupAuthInterceptors,
  setupErrorInterceptors,
  setupLoggingInterceptors,
} from "./interceptors";

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000");
const API_RETRY_ATTEMPTS = parseInt(
  import.meta.env.VITE_API_RETRY_ATTEMPTS || "3"
);

// Configuration par défaut
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Création de l'instance axios
const apiClient: AxiosInstance = axios.create(defaultConfig);

// Configuration des intercepteurs
setupAuthInterceptors(apiClient);
setupErrorInterceptors(apiClient);
setupLoggingInterceptors(apiClient);

// Fonction utilitaire pour les retry
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = API_RETRY_ATTEMPTS
): Promise<T> => {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Ne pas retry sur les erreurs 4xx (sauf 429)
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500 &&
          axiosError.response.status !== 429
        ) {
          throw error;
        }
      }

      // Attendre avant le retry (backoff exponentiel)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

export { apiClient, retryRequest };
export default apiClient;
