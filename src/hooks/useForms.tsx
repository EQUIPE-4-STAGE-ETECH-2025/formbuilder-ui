import { useCallback, useEffect, useState } from "react";
import { formsService } from "../services/api";
import {
  ICreateFormRequest,
  IUpdateFormRequest,
} from "../services/api/forms/formsTypes";
import { IForm } from "../types";
import { adaptFormFromAPI } from "../utils/formAdapter";
import { useAuth } from "./useAuth";

interface IUseFormsReturn {
  forms: IForm[];
  loading: boolean;
  error: string | null;
  createForm: (formData: ICreateFormRequest) => Promise<void>;
  updateForm: (id: string, formData: IUpdateFormRequest) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
  refreshForms: () => Promise<void>;
  publishForm: (id: string) => Promise<void>;
  getEmbedCode: (id: string) => Promise<string | null>;
}

export const useForms = (): IUseFormsReturn => {
  // Hooks
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fonctions utilitaires
  const fetchForms = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsService.getAll();

      if (response.success && response.data) {
        const adaptedForms = response.data.map((form) =>
          adaptFormFromAPI(form, user?.id)
        );
        setForms(adaptedForms);
      } else {
        setError(
          response.message || "Erreur lors du chargement des formulaires"
        );
      }
    } catch {
      setError("Erreur lors du chargement des formulaires");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Effets
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const createForm = async (formData: ICreateFormRequest): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await formsService.create(formData);

      if (!response.success) {
        const errorMessage =
          response.message || "Erreur lors de la création du formulaire";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes("Erreur lors de la création")
      ) {
        setError("Erreur lors de la création du formulaire");
        throw new Error("Erreur lors de la création du formulaire");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (
    id: string,
    formData: IUpdateFormRequest
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsService.update(id, formData);

      if (!response.success) {
        const errorMessage =
          response.message || "Erreur lors de la mise à jour du formulaire";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes("Erreur lors de la mise à jour")
      ) {
        setError("Erreur lors de la mise à jour du formulaire");
        throw new Error("Erreur lors de la mise à jour du formulaire");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsService.delete(id);

      if (response.success) {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
      } else {
        setError(
          response.message || "Erreur lors de la suppression du formulaire"
        );
      }
    } catch {
      setError("Erreur lors de la suppression du formulaire");
    } finally {
      setLoading(false);
    }
  };

  const refreshForms = async (): Promise<void> => {
    await fetchForms();
  };

  const publishForm = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsService.publish(id);

      if (!response.success) {
        const errorMessage =
          response.message || "Erreur lors de la publication du formulaire";
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // Selon le contrat API, la réponse contient les données mises à jour du formulaire
      // On devrait mettre à jour la liste des formulaires si elle est chargée
      if (response.data) {
        const adaptedForm = adaptFormFromAPI(response.data, user?.id);
        setForms((prevForms) =>
          prevForms.map((form) => (form.id === id ? adaptedForm : form))
        );
      }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes("Erreur lors de la publication")
      ) {
        setError("Erreur lors de la publication du formulaire");
        throw new Error("Erreur lors de la publication du formulaire");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEmbedCode = async (id: string): Promise<string | null> => {
    try {
      setError(null);
      const response = await formsService.getEmbedCode(id);

      if (response.success && response.data) {
        return response.data.embedCode;
      } else {
        setError(
          response.message ||
            "Erreur lors de la génération du code d'intégration"
        );
        return null;
      }
    } catch {
      setError("Erreur lors de la génération du code d'intégration");
      return null;
    }
  };

  return {
    forms,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    refreshForms,
    publishForm,
    getEmbedCode,
  };
};
