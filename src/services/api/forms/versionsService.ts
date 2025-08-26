import { apiClient } from "../config/apiClient";
import {
  ICreateVersionRequest,
  IVersionListResponse,
  IVersionResponse,
} from "./formsTypes";

class VersionsService {
  private readonly basePath = "/api/forms";

  /**
   * Récupère toutes les versions d'un formulaire
   * VERSIONS-001
   */
  async getByFormId(formId: string): Promise<IVersionListResponse> {
    try {
      const response = await apiClient.get<IVersionListResponse>(
        `${this.basePath}/${formId}/versions`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des versions du formulaire ${formId}:`,
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
          "Erreur lors de la récupération des versions",
      };
    }
  }

  /**
   * Crée une nouvelle version d'un formulaire
   * VERSIONS-002
   */
  async create(
    formId: string,
    versionData: ICreateVersionRequest
  ): Promise<IVersionResponse> {
    try {
      const response = await apiClient.post<IVersionResponse>(
        `${this.basePath}/${formId}/versions`,
        versionData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la création de version pour le formulaire ${formId}:`,
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
          message: "Schéma manquant ou invalide",
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

      if (
        (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response?.status === 422
      ) {
        return {
          success: false,
          message: "Schéma de formulaire invalide",
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
          "Erreur lors de la création de la version",
      };
    }
  }

  /**
   * Restaure une version spécifique d'un formulaire
   * VERSIONS-003
   */
  async restore(
    formId: string,
    versionNumber: number
  ): Promise<IVersionResponse> {
    try {
      const response = await apiClient.post<IVersionResponse>(
        `${this.basePath}/${formId}/versions/${versionNumber}/restore`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la restauration de la version ${versionNumber} du formulaire ${formId}:`,
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
          message: "Formulaire ou version non trouvé(e)",
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
          "Erreur lors de la restauration de la version",
      };
    }
  }

  /**
   * Supprime une version spécifique d'un formulaire
   * VERSIONS-004
   */
  async delete(
    formId: string,
    versionNumber: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(
        `${this.basePath}/${formId}/versions/${versionNumber}`
      );
      return {
        success: true,
        message:
          response.data?.message ||
          `Version ${versionNumber} supprimée avec succès`,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la version ${versionNumber} du formulaire ${formId}:`,
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
          message: "Impossible de supprimer la version active",
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
          message: "Formulaire ou version non trouvé(e)",
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
          "Erreur lors de la suppression de la version",
      };
    }
  }
}

export const versionsService = new VersionsService();
