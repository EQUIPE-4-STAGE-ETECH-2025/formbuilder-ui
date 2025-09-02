import { AlertCircle, CheckCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { Dropdown } from "../../components/ui/Dropdown";
import { useAuth } from "../../hooks/useAuth";
import { formsService, submissionsService } from "../../services/api";
import { IForm, IFormField } from "../../types";
import { adaptFormFromAPI } from "../../utils/formAdapter";

export function FormEmbed() {
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Record<string, string | boolean | number>
  >({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchForm = useCallback(async () => {
    try {
      // Utiliser l'endpoint public pour récupérer le formulaire
      const response = await formsService.getPublicById(id!);
      if (response.success && response.data) {
        const formData = response.data;
        // L'endpoint public ne retourne que les formulaires PUBLISHED
        const adaptedForm = adaptFormFromAPI(formData, user?.id);
        setForm(adaptedForm);
      } else {
        setError(response.message || "Formulaire non trouvé");
      }
    } catch {
      setError("Erreur lors du chargement du formulaire");
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (id) {
      fetchForm();
    } else {
      setError("ID du formulaire manquant");
      setLoading(false);
    }
  }, [id, fetchForm]);

  const validateField = (
    field: IFormField,
    value: string | boolean | number
  ): string | null => {
    if (field.is_required && !value) {
      return "Ce champ est requis";
    }

    if (typeof value === "string") {
      if (
        field.validation_rules.min_length &&
        value.length < field.validation_rules.min_length
      ) {
        return `Minimum ${field.validation_rules.min_length} caractères`;
      }
      if (
        field.validation_rules.max_length &&
        value.length > field.validation_rules.max_length
      ) {
        return `Maximum ${field.validation_rules.max_length} caractères`;
      }
    }

    return null;
  };

  const handleFieldChange = (
    fieldId: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when field is modified
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Fonction utilitaire pour transformer les données du formulaire
  const transformFormDataForSubmission = (
    formData: Record<string, string | boolean | number>,
    formFields: IFormField[]
  ): Record<string, unknown> => {
    const formattedData: Record<string, unknown> = {};

    Object.entries(formData).forEach(([fieldId, value]) => {
      const field = formFields.find((f) => f.id === fieldId);
      if (field) {
        formattedData[field.label] = value;
      }
    });

    return formattedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validation de tous les champs
    const errors: Record<string, string> = {};
    form.fields.forEach((field) => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const submissionData = transformFormDataForSubmission(
        formData,
        form.fields
      );

      await submissionsService.submit(form.id, submissionData);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);

      // Gestion d'erreurs spécifiques
      let errorMessage = "Erreur lors de la soumission du formulaire.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { detail?: string } };
        };
        const status = axiosError.response?.status;
        const detail = axiosError.response?.data?.detail;

        switch (status) {
          case 400:
            errorMessage = detail || "Données du formulaire invalides.";
            break;
          case 404:
            errorMessage = "Formulaire introuvable.";
            break;
          case 429:
            errorMessage = "Trop de soumissions. Veuillez réessayer plus tard.";
            break;
          case 500:
            errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
            break;
          default:
            errorMessage = "Erreur lors de la soumission. Veuillez réessayer.";
        }
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
            <p className="text-surface-400">Chargement du formulaire...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
            <p className="text-surface-400">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-100 mb-2">
              Merci !
            </h2>
            <p className="text-surface-400">
              {form?.settings?.success_message ||
                "Votre formulaire a été soumis avec succès."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-surface-900 rounded-2xl shadow-large border border-surface-800/50 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-100 mb-2">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-surface-400">{form.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-text-100 mb-2">
                    {field.label}
                    {field.is_required && (
                      <span className="text-yellow-400 ml-1">*</span>
                    )}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    />
                  )}

                  {field.type === "email" && (
                    <input
                      type="email"
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    />
                  )}

                  {field.type === "number" && (
                    <input
                      type="number"
                      value={(formData[field.id] as number) || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    />
                  )}

                  {field.type === "date" && (
                    <input
                      type="date"
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      value={(formData[field.id] as string) || ""}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    />
                  )}

                  {field.type === "select" && (
                    <Dropdown
                      value={(formData[field.id] as string) || ""}
                      options={
                        field.options?.choices?.map((choice: string) => ({
                          value: choice,
                          label: choice,
                        })) || []
                      }
                      placeholder={
                        field.placeholder || "Sélectionner une option"
                      }
                      onChange={(value) => handleFieldChange(field.id, value)}
                      className="w-full"
                    />
                  )}

                  {field.type === "checkbox" && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData[field.id] as boolean) || false}
                        onChange={(e) =>
                          handleFieldChange(field.id, e.target.checked)
                        }
                        className="w-4 h-4 border border-surface-700/50 rounded bg-surface-900 text-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                      />
                      <span className="ml-2 text-sm text-surface-300">
                        {field.placeholder || field.label}
                      </span>
                    </label>
                  )}

                  {field.type === "radio" && (
                    <div className="space-y-2">
                      {field.options?.choices?.map(
                        (option: string, index: number) => (
                          <label key={index} className="flex items-center">
                            <input
                              type="radio"
                              name={field.id}
                              value={option}
                              checked={formData[field.id] === option}
                              onChange={(e) =>
                                handleFieldChange(field.id, e.target.value)
                              }
                              className="w-4 h-4 border border-surface-700/50 bg-surface-900 text-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-950"
                            />
                            <span className="ml-2 text-sm text-surface-300">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  )}

                  {fieldErrors[field.id] && (
                    <p className="mt-1 text-sm text-red-400">
                      {fieldErrors[field.id]}
                    </p>
                  )}
                </div>
              ))}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                variant="accent"
              >
                {submitting ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
