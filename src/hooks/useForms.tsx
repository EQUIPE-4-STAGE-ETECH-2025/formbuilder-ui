import { useEffect, useState } from "react";
import { formsService } from "../services/api";
import {
  ICreateFormRequest,
  IForm as IFormAPI,
  IUpdateFormRequest,
} from "../services/api/forms/formsTypes";
import { IForm } from "../types";

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

// Fonction d'adaptation entre l'API et l'UI
const adaptFormFromAPI = (form: IFormAPI): IForm => {
  return {
    id: form.id,
    user_id: "user-1", // Sera remplacé par l'ID utilisateur réel depuis le contexte
    title: form.title,
    description: form.description,
    status: form.status.toLowerCase() as "draft" | "published" | "disabled",
    published_at: form.publishedAt || undefined,
    created_at: form.createdAt,
    updated_at: form.updatedAt,
    submissionCount: form.submissionsCount || 0,
    version: form.currentVersion?.versionNumber || 1,
    fields:
      form.schema?.fields?.map((field) => ({
        id: field.id,
        form_version_id: form.currentVersion?.id || "",
        label: field.label,
        type: field.type as
          | "text"
          | "email"
          | "date"
          | "select"
          | "checkbox"
          | "radio"
          | "textarea"
          | "number"
          | "file"
          | "url",
        is_required: field.required,
        placeholder: field.placeholder,
        options: field.placeholder ? { placeholder: field.placeholder } : {},
        position: 1,
        order: 1,
        validation_rules: field.validation || {},
      })) || [],
    history: {
      versions:
        form.versions?.map((v) => ({
          id: v.id,
          form_id: form.id,
          version_number: v.versionNumber,
          schema: {
            title: form.title,
            description: form.description,
            fields:
              v.schema?.fields?.map((field) => ({
                id: field.id,
                form_version_id: v.id,
                label: field.label,
                type: field.type as
                  | "text"
                  | "email"
                  | "date"
                  | "select"
                  | "checkbox"
                  | "radio"
                  | "textarea"
                  | "number"
                  | "file"
                  | "url",
                is_required: field.required,
                placeholder: field.placeholder,
                options: field.placeholder
                  ? { placeholder: field.placeholder }
                  : {},
                position: 1,
                order: 1,
                validation_rules: field.validation || {},
              })) || [],
            settings: {
              theme: {
                primary_color:
                  v.schema?.settings?.theme?.primaryColor || "#3B82F6",
                background_color:
                  v.schema?.settings?.theme?.backgroundColor || "#FFFFFF",
                text_color: "#1F2937",
              },
              success_message:
                v.schema?.settings?.successMessage ||
                "Merci pour votre soumission !",
              notifications: {
                email: !!v.schema?.settings?.notifications?.email,
                webhook: v.schema?.settings?.notifications?.webhook,
              },
            },
            status: form.status.toLowerCase() as
              | "draft"
              | "published"
              | "disabled",
          },
          created_at: v.createdAt,
        })) || [],
      currentVersion: form.currentVersion?.versionNumber || 1,
      maxVersions: 10,
    },
    settings: {
      theme: {
        primary_color: form.schema?.settings?.theme?.primaryColor || "#3B82F6",
        background_color:
          form.schema?.settings?.theme?.backgroundColor || "#FFFFFF",
        text_color: "#1F2937",
      },
      success_message:
        form.schema?.settings?.successMessage ||
        "Merci pour votre soumission !",
      notifications: {
        email: !!form.schema?.settings?.notifications?.email,
        webhook: form.schema?.settings?.notifications?.webhook,
      },
    },
  };
};

export const useForms = (): IUseFormsReturn => {
  // Hooks
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effets
  useEffect(() => {
    fetchForms();
  }, []);

  // Fonctions utilitaires
  const fetchForms = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsService.getAll();

      if (response.success && response.data) {
        const adaptedForms = response.data.map(adaptFormFromAPI);
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
  };

  const createForm = async (formData: ICreateFormRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsService.create(formData);

      if (response.success && response.data) {
        await fetchForms(); // Rafraîchir la liste complète
      } else {
        setError(
          response.message || "Erreur lors de la création du formulaire"
        );
      }
    } catch {
      setError("Erreur lors de la création du formulaire");
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

      if (response.success && response.data) {
        await fetchForms(); // Rafraîchir la liste complète
      } else {
        setError(
          response.message || "Erreur lors de la mise à jour du formulaire"
        );
      }
    } catch {
      setError("Erreur lors de la mise à jour du formulaire");
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

      if (response.success && response.data) {
        await fetchForms(); // Rafraîchir la liste complète
      } else {
        setError(
          response.message || "Erreur lors de la publication du formulaire"
        );
      }
    } catch {
      setError("Erreur lors de la publication du formulaire");
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
