// Utilitaires communs pour optimiser les performances des services API

// Types pour la gestion d'erreurs optimisée
export interface IApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
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
    return apiError.response?.data?.message || defaultMessage;
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
 * Cache simple avec TTL pour les réponses API
 */
class ApiCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiry });

    // Nettoyer le cache périodiquement
    if (this.cache.size > 50) {
      this.cleanExpired();
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanExpired(): void {
    const now = Date.now();

    this.cache.forEach((entry, key) => {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    });
  }
}

// Instance partagée du cache
export const apiCache = new ApiCache();

/**
 * Wrapper pour les appels API avec gestion d'erreurs et cache automatiques
 */
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  defaultError: string,
  cacheKey?: string,
  cacheTTL?: number
): Promise<T | { success: false; message: string }> => {
  // Vérifier le cache en premier
  if (cacheKey) {
    const cachedResult = apiCache.get(cacheKey) as T | null;
    if (cachedResult) {
      return cachedResult;
    }
  }

  try {
    const result = await apiCall();

    // Mettre en cache le résultat si une clé est fournie
    if (cacheKey && result) {
      apiCache.set(cacheKey, result, cacheTTL);
    }

    return result;
  } catch (error) {
    console.error(`Erreur API: ${defaultError}`, error);

    return {
      success: false,
      message: getErrorMessage(error, defaultError),
    };
  }
};

/**
 * Nettoie tous les caches
 */
export const clearAllCaches = (): void => {
  queryCache.clear();
  apiCache.clear();
};
