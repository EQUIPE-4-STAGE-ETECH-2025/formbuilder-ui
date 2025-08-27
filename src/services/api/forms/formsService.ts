import { apiClient } from "../config/apiClient";
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
   * FORMS-001
   */
  async getAll(params?: IFormQueryParams): Promise<IFormListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);

      const queryString = queryParams.toString();
      const url = queryString
        ? `${this.basePath}?${queryString}`
        : this.basePath;

      const response = await apiClient.get<IFormListResponse>(url);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des formulaires:", error);
      return {
        success: false,
        message:
          (
            error as {
              response?: { status?: number; data?: { message?: string } };
            }
          ).response?.data?.message ||
          "Erreur lors de la récupération des formulaires",
      };
    }
  }

  /**
   * Récupère un formulaire spécifique par son ID
   * FORMS-002
   */
  async getById(id: string): Promise<IFormResponse> {
    try {
      const response = await apiClient.get<IFormResponse>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du formulaire ${id}:`,
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
          message: "Accès refusé",
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
          "Erreur lors de la récupération du formulaire",
      };
    }
  }

  /**
   * Récupère un formulaire publié publiquement (sans authentification)
   * FORMS-007a
   */
  async getPublicById(id: string): Promise<IFormResponse> {
    try {
      const response = await apiClient.get<IFormResponse>(
        `/api/public/forms/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération publique du formulaire ${id}:`,
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
          message: "Formulaire non publié ou non disponible publiquement",
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
          "Erreur lors de la récupération du formulaire",
      };
    }
  }

  /**
   * Crée un nouveau formulaire
   * FORMS-003
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

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 422
      ) {
        return {
          success: false,
          message:
            (
              error as {
                response?: { status?: number; data?: { message?: string } };
              }
            ).response?.data?.message || "Données de validation invalides",
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
          "Erreur lors de la création du formulaire",
      };
    }
  }

  /**
   * Met à jour un formulaire existant
   * FORMS-004
   */
  async update(
    id: string,
    formData: IUpdateFormRequest
  ): Promise<IFormResponse> {
    try {
      const response = await apiClient.put<IFormResponse>(
        `${this.basePath}/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du formulaire ${id}:`,
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

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 422
      ) {
        return {
          success: false,
          message:
            (
              error as {
                response?: { status?: number; data?: { message?: string } };
              }
            ).response?.data?.message || "Erreurs de validation",
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
          "Erreur lors de la mise à jour du formulaire",
      };
    }
  }

  /**
   * Supprime un formulaire
   * FORMS-005
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
   * FORMS-006
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
   * FORMS-007
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
