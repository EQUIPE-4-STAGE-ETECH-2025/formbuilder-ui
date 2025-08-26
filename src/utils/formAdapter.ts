import {
  IForm as IFormAPI,
  IFormField as IFormFieldAPI,
  IFormVersion as IFormVersionAPI,
} from "../services/api/forms/formsTypes";
import { IForm, IFormField, IFormVersion } from "../types";

/**
 * Adaptateur centralisé pour convertir les données de l'API vers le format UI
 * Basé sur le contrat API officiel CONTRAT-API-FORMS.md
 */

/**
 * Adapte un champ de formulaire depuis l'API vers le format UI
 */
const adaptFieldFromAPI = (
  field: IFormFieldAPI,
  formVersionId: string
): IFormField => {
  return {
    id: field.id,
    form_version_id: formVersionId,
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
      | "url"
      | "tel",
    is_required: field.required,
    placeholder: field.placeholder,
    // Correction : les options contiennent les choix pour select/radio/checkbox
    options: field.validation?.options
      ? {
          choices: field.validation.options,
          placeholder: field.placeholder,
        }
      : field.placeholder
      ? {
          placeholder: field.placeholder,
        }
      : {},
    position: 1,
    order: 1,
    validation_rules: field.validation || {},
  };
};

/**
 * Adapte une version de formulaire depuis l'API vers le format UI
 */
const adaptVersionFromAPI = (
  version: IFormVersionAPI,
  formId: string,
  formTitle: string,
  formDescription: string,
  formStatus: string
): IFormVersion => {
  return {
    id: version.id,
    form_id: formId,
    version_number: version.versionNumber,
    schema: {
      title: formTitle,
      description: formDescription,
      fields:
        version.schema?.fields?.map((field) =>
          adaptFieldFromAPI(field, version.id)
        ) || [],
      settings: {
        theme: {
          primary_color:
            version.schema?.settings?.theme?.primaryColor || "#3B82F6",
          background_color:
            version.schema?.settings?.theme?.backgroundColor || "#FFFFFF",
          text_color: "#1F2937",
        },
        success_message:
          version.schema?.settings?.successMessage ||
          "Merci pour votre soumission !",
        notifications: {
          email: !!version.schema?.settings?.notifications?.email,
          webhook: version.schema?.settings?.notifications?.webhook,
        },
      },
      status: formStatus.toLowerCase() as "draft" | "published" | "disabled",
    },
    created_at: version.createdAt,
  };
};

/**
 * Adapte un formulaire depuis l'API vers le format UI
 * Utilise le userId du contexte d'authentification
 */
export const adaptFormFromAPI = (form: IFormAPI, userId?: string): IForm => {
  return {
    id: form.id,
    user_id: userId || "user-unknown", // Utilise le userId du contexte ou valeur par défaut
    title: form.title,
    description: form.description,
    status: form.status.toLowerCase() as "draft" | "published" | "disabled",
    published_at: form.publishedAt || undefined,
    created_at: form.createdAt,
    updated_at: form.updatedAt,
    submissionCount: form.submissionsCount || 0,
    version: form.currentVersion?.versionNumber || 1,
    fields:
      form.schema?.fields?.map((field) =>
        adaptFieldFromAPI(field, form.currentVersion?.id || "")
      ) || [],
    history: {
      versions:
        form.versions?.map((v) =>
          adaptVersionFromAPI(
            v,
            form.id,
            form.title,
            form.description,
            form.status
          )
        ) || [],
      currentVersion: form.currentVersion?.versionNumber || 1,
      maxVersions: 10, // Selon le contrat API
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

/**
 * Adapte une version de formulaire depuis l'API vers le format UI (pour les hooks de versions)
 */
export const adaptVersionFromAPIForHooks = (
  version: IFormVersionAPI
): IFormVersion => {
  return {
    id: version.id,
    form_id: "", // Sera rempli par le hook
    version_number: version.versionNumber,
    schema: {
      title: "", // Sera rempli par le hook
      description: "", // Sera rempli par le hook
      fields:
        version.schema?.fields?.map((field) =>
          adaptFieldFromAPI(field, version.id)
        ) || [],
      settings: {
        theme: {
          primary_color:
            version.schema?.settings?.theme?.primaryColor || "#3B82F6",
          background_color:
            version.schema?.settings?.theme?.backgroundColor || "#FFFFFF",
          text_color: "#1F2937",
        },
        success_message:
          version.schema?.settings?.successMessage ||
          "Merci pour votre soumission !",
        notifications: {
          email: !!version.schema?.settings?.notifications?.email,
          webhook: version.schema?.settings?.notifications?.webhook,
        },
      },
      status: "draft", // Sera rempli par le hook
    },
    created_at: version.createdAt,
  };
};

/**
 * Adapte les données UI vers le format API pour la création/mise à jour
 */
export const adaptFormToAPI = (form: Partial<IForm>) => {
  return {
    title: form.title,
    description: form.description,
    status: form.status?.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    schema:
      form.fields && form.settings
        ? {
            fields: form.fields.map((field) => ({
              id: field.id,
              type: field.type,
              label: field.label,
              required: field.is_required,
              placeholder: field.placeholder,
              validation: {
                ...field.validation_rules,
                // Correction : mettre les choix dans validation.options
                ...(field.options?.choices && {
                  options: field.options.choices,
                }),
              },
            })),
            settings: {
              submitButtonText: "Envoyer",
              successMessage: form.settings.success_message,
              theme: {
                primaryColor: form.settings.theme.primary_color,
                backgroundColor: form.settings.theme.background_color,
              },
              notifications: {
                email: form.settings.notifications.email
                  ? "notification@example.com"
                  : undefined,
                webhook: form.settings.notifications.webhook,
              },
            },
          }
        : undefined,
  };
};
