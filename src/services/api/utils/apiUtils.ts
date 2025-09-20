// Utilitaires communs pour optimiser les performances des services API

// Types pour la gestion d'erreurs optimisée
export interface IApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

// Cache pour les query parameters construits
const queryCache = new Map<string, URLSearchParams>();

/**
 * Construit des paramètres de requête de manière optimisée avec cache
 */
export const buildQueryParams = (
  params: Record<string, string | number | boolean | undefined | null>
): URLSearchParams => {
  // Créer une clé de cache basée sur les paramètres
  const cacheKey = JSON.stringify(params);

  if (queryCache.has(cacheKey)) {
    return new URLSearchParams(queryCache.get(cacheKey)!);
  }

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  // Cache le résultat (limite la taille du cache)
  if (queryCache.size > 100) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) {
      queryCache.delete(firstKey);
    }
  }

  queryCache.set(cacheKey, new URLSearchParams(queryParams));
  return queryParams;
};

/**
 * Extrait le message d'erreur de manière optimisée
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = "Une erreur est survenue"
): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as IApiError;
    return (
      apiError.response?.data?.error ||
      apiError.response?.data?.message ||
      defaultMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Construit une URL avec paramètres de requête de manière optimisée
 */
export const buildUrl = (
  basePath: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string => {
  if (!params || Object.keys(params).length === 0) {
    return basePath;
  }

  const queryParams = buildQueryParams(params);
  const queryString = queryParams.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
};

/**
 * Debounce pour les fonctions de recherche
 */
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Wrapper pour les appels API avec gestion d'erreurs
 */
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  defaultError: string
): Promise<T | { success: false; message: string }> => {
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    console.error(`Erreur API: ${defaultError}`, error);

    return {
      success: false,
      message: getErrorMessage(error, defaultError),
    };
  }
};
