import { useEffect, useState } from "react";
import { formsAPI } from "../services/api.mock";
import { IForm } from "../types";

interface IUseFormsReturn {
  forms: IForm[];
  loading: boolean;
  error: string | null;
  createForm: (formData: Partial<IForm>) => Promise<void>;
  updateForm: (id: string, formData: Partial<IForm>) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
  refreshForms: () => Promise<void>;
}

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
      const response = await formsAPI.getAll();

      if (response.success && response.data) {
        setForms(response.data);
      } else {
        setError(response.error || "Erreur lors du chargement des formulaires");
      }
    } catch {
      setError("Erreur lors du chargement des formulaires");
    } finally {
      setLoading(false);
    }
  };

  const createForm = async (formData: Partial<IForm>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsAPI.create(formData);

      if (response.success && response.data) {
        setForms((prevForms) => [...prevForms, response.data!]);
      } else {
        setError(response.error || "Erreur lors de la création du formulaire");
      }
    } catch {
      setError("Erreur lors de la création du formulaire");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (
    id: string,
    formData: Partial<IForm>
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsAPI.update(id, formData);

      if (response.success && response.data) {
        setForms((prevForms) =>
          prevForms.map((form) => (form.id === id ? response.data! : form))
        );
      } else {
        setError(
          response.error || "Erreur lors de la mise à jour du formulaire"
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
      const response = await formsAPI.delete(id);

      if (response.success) {
        setForms((prevForms) => prevForms.filter((form) => form.id !== id));
      } else {
        setError(
          response.error || "Erreur lors de la suppression du formulaire"
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

  return {
    forms,
    loading,
    error,
    createForm,
    updateForm,
    deleteForm,
    refreshForms,
  };
};
