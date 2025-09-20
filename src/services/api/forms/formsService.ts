import { apiClient } from "../config/apiClient";
import { buildUrl, withErrorHandling } from "../utils/apiUtils";
import {
  ICreateFormRequest,
  IEmbedQueryParams,
  IEmbedResponse,
  IFormListResponse,
  IFormQueryParams,
  IFormResponse,
  IUpdateFormRequest,
} from "./formsTypes";

class FormsService {
  private readonly basePath = "/api/forms";

  /**
   * Récupère tous les formulaires avec pagination et filtres
   */
  async getAll(params?: IFormQueryParams): Promise<IFormListResponse> {
    const url = buildUrl(
      this.basePath,
      params as Record<string, string | number | boolean | undefined>
    );

    const result = await withErrorHandling(
      () => apiClient.get<IFormListResponse>(url).then((res) => res.data),
      "Erreur lors de la récupération des formulaires"
    );

    return result as IFormListResponse;
  }

  /**
   * Récupère un formulaire spécifique par son ID
   */
  async getById(id: string): Promise<IFormResponse> {
    const url = `${this.basePath}/${id}`;

    const result = await withErrorHandling(
      () => apiClient.get<IFormResponse>(url).then((res) => res.data),
      `Erreur lors de la récupération du formulaire ${id}`
    );

    return result as IFormResponse;
  }

  /**
   * Récupère un formulaire publié publiquement (sans authentification)
   */
  async getPublicById(id: string): Promise<IFormResponse> {
    const url = `/api/public/forms/${id}`;

    const result = await withErrorHandling(
      () => apiClient.get<IFormResponse>(url).then((res) => res.data),
      `Erreur lors de la récupération publique du formulaire ${id}`
    );

    return result as IFormResponse;
  }

  /**
   * Crée un nouveau formulaire
   */
  async create(formData: ICreateFormRequest): Promise<IFormResponse> {
    try {
      const response = await apiClient.post<IFormResponse>(
        this.basePath,
        formData
      );

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du formulaire:", error);

      // Préserver la logique spéciale pour les quotas
      if (error instanceof Error && error.name === "QuotaExceededError") {
        throw error;
      }

      return {
        success: false,
        message: "Erreur lors de la création du formulaire",
      };
    }
  }

  /**
   * Met à jour un formulaire existant
   */
  async update(
    id: string,
    formData: IUpdateFormRequest
  ): Promise<IFormResponse> {
    const result = await withErrorHandling(async () => {
      const response = await apiClient.put<IFormResponse>(
        `${this.basePath}/${id}`,
        formData
      );

      return response.data;
    }, `Erreur lors de la mise à jour du formulaire ${id}`);

    return result as IFormResponse;
  }

  /**
   * Supprime un formulaire
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(`${this.basePath}/${id}`);

      return {
        success: true,
        message: response.data?.message || "Formulaire supprimé avec succès",
      };
    } catch (error) {
      console.error(
        `Erreur lors de la suppression du formulaire ${id}:`,
        error
      );

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 404
      ) {
        return {
          success: false,
          message: "Formulaire non trouvé",
        };
      }

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 403
      ) {
        return {
          success: false,
          message: "Permissions insuffisantes",
        };
      }

      return {
        success: false,
        message:
          (
            error as {
              response?: { status?: number; data?: { message?: string } };
            }
          ).response?.data?.message ||
          "Erreur lors de la suppression du formulaire",
      };
    }
  }

  /**
   * Publie un formulaire
   */
  async publish(id: string): Promise<IFormResponse> {
    try {
      const response = await apiClient.post<IFormResponse>(
        `${this.basePath}/${id}/publish`
      );

      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la publication du formulaire ${id}:`,
        error
      );

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 404
      ) {
        return {
          success: false,
          message: "Formulaire non trouvé",
        };
      }

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 403
      ) {
        return {
          success: false,
          message: "Permissions insuffisantes",
        };
      }

      return {
        success: false,
        message:
          (
            error as {
              response?: { status?: number; data?: { message?: string } };
            }
          ).response?.data?.message ||
          "Erreur lors de la publication du formulaire",
      };
    }
  }

  /**
   * Génère le code d'intégration iframe
   */
  async getEmbedCode(
    id: string,
    params?: IEmbedQueryParams
  ): Promise<IEmbedResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.width) queryParams.append("width", params.width);
      if (params?.height) queryParams.append("height", params.height);
      if (params?.border) queryParams.append("border", params.border);
      if (params?.borderRadius)
        queryParams.append("borderRadius", params.borderRadius);
      if (params?.boxShadow) queryParams.append("boxShadow", params.boxShadow);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/public/forms/${id}/embed?${queryString}`
        : `/api/public/forms/${id}/embed`;

      const response = await apiClient.get<IEmbedResponse>(url);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la génération du code d'intégration pour ${id}:`,
        error
      );

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 400
      ) {
        return {
          success: false,
          message: "Paramètres de personnalisation invalides",
        };
      }

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 404
      ) {
        return {
          success: false,
          message: "Formulaire non trouvé",
        };
      }

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 403
      ) {
        return {
          success: false,
          message: "Permissions insuffisantes",
        };
      }

      return {
        success: false,
        message:
          (
            error as {
              response?: { status?: number; data?: { message?: string } };
            }
          ).response?.data?.message ||
          "Erreur lors de la génération du code d'intégration",
      };
    }
  }
}

export const formsService = new FormsService();
