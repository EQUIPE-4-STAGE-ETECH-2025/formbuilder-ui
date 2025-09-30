import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Circle,
  Clock,
  Code,
  Copy,
  ExternalLink,
  Eye,
  GripVertical,
  Hash,
  List,
  Mail,
  MessageSquare,
  Plus,
  Save,
  Send,
  Trash2,
  Type,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHistory } from "../../components/forms/FormHistory";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../../hooks/useAuth";
import { useForms } from "../../hooks/useForms";
import { useQuotas } from "../../hooks/useQuotas";
import { useToast } from "../../hooks/useToast";
import { formsService } from "../../services/api";
import {
  ICreateFormRequest,
  IUpdateFormRequest,
} from "../../services/api/forms/formsTypes";
import { QuotaExceededError } from "../../services/api/quotas/quotaTypes";
import { IForm, IFormField } from "../../types";
import { adaptFormFromAPI } from "../../utils/formAdapter";

// Composant DraggableField extrait pour éviter les re-rendus
interface IDraggableFieldProps {
  field: IFormField;
  onUpdate: (fieldId: string, updates: Partial<IFormField>) => void;
  onRemove: (fieldId: string) => void;
}

// Fonction utilitaire pour gérer les événements clavier du textarea des options
const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const textarea = e.target as HTMLTextAreaElement;
    const value = textarea.value;
    const newValue = value + "\n";

    textarea.value = newValue;
    textarea.selectionStart = textarea.selectionEnd = newValue.length;
    textarea.scrollTop = textarea.scrollHeight;

    // Déclencher l'onChange pour mettre à jour l'état
    const event = new Event("input", { bubbles: true });
    textarea.dispatchEvent(event);
  }
};

const DraggableField = ({
  field,
  onUpdate,
  onRemove,
  disabled = false,
}: IDraggableFieldProps & { disabled?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: field.id, disabled });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: "none",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-4 field-card ${
        isDragging
          ? "dragging shadow-2xl rotate-1 scale-105 z-50"
          : "hover:shadow-lg"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <Card
        className={
          isDragging
            ? "bg-surface-800/80 backdrop-blur-sm border-accent-500/30"
            : ""
        }
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 mt-2 p-2 cursor-grab active:cursor-grabbing hover:bg-surface-700 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              tabIndex={0}
              role="button"
              aria-label="Déplacer ce champ"
            >
              <GripVertical className="h-5 w-5 text-surface-400 hover:text-surface-300 transition-colors duration-200" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Label du champ"
                  value={field.label}
                  onChange={(e) =>
                    onUpdate(field.id, { label: e.target.value })
                  }
                  disabled={disabled}
                />
                <Input
                  label="Placeholder"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    onUpdate(field.id, { placeholder: e.target.value })
                  }
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) =>
                      onUpdate(field.id, {
                        is_required: e.target.checked,
                      })
                    }
                    disabled={disabled}
                    className="w-4 h-4 border border-surface-700/50 rounded bg-surface-900 text-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200 checked:bg-accent-500 checked:border-accent-500 [&:checked]:bg-accent-500 [&:checked]:border-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage: field.is_required
                        ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11.207 5.793a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 8.586l3.293-3.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
                        : "none",
                      backgroundSize: "12px",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <span className="ml-2 text-sm text-surface-300">
                    Champ obligatoire
                  </span>
                </label>
                <span className="text-sm text-surface-500">
                  Type: {field.type}
                </span>
              </div>
              {(field.type === "select" || field.type === "radio") && (
                <div>
                  <label className="block text-sm font-medium text-text-100 mb-2">
                    Options (une par ligne)
                  </label>
                  <textarea
                    value={field.options?.choices?.join("\n") || ""}
                    onChange={(e) =>
                      onUpdate(field.id, {
                        options: {
                          ...field.options,
                          choices: e.target.value
                            .split("\n")
                            .filter((o) => o.trim()),
                        },
                      })
                    }
                    onKeyDown={handleTextareaKeyDown}
                    placeholder={`Option 1\nOption 2\nOption 3`}
                    className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={3}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>

            {/* Bouton de suppression */}
            <button
              onClick={() => onRemove(field.id)}
              disabled={disabled}
              className="flex-shrink-0 p-2 text-yellow-400 hover:bg-yellow-900/20 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const fieldTypes = [
  { type: "text", label: "Texte", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "number", label: "Nombre", icon: Hash },
  { type: "date", label: "Date", icon: Calendar },
  { type: "textarea", label: "Texte long", icon: MessageSquare },
  { type: "select", label: "Liste déroulante", icon: List },
  { type: "checkbox", label: "Case à cocher", icon: CheckSquare },
  { type: "radio", label: "Bouton radio", icon: Circle },
];

export function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { createForm, updateForm, publishForm, deleteForm } = useForms();
  const { handleQuotaError } = useQuotas();
  const [form, setForm] = useState<IForm | null>(null);
  const [originalForm, setOriginalForm] = useState<IForm | null>(null); // Formulaire original pour comparaison
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "build" | "preview" | "embed" | "history"
  >("build");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  // État pour la gestion de l'intégration
  const [embedData, setEmbedData] = useState<{
    embedCode: string;
    embedUrl: string;
    token: string;
  } | null>(null);
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);

  // Configuration des capteurs pour @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchForm = useCallback(async () => {
    // Ne pas charger si le formulaire a été supprimé ou n'existe pas
    if (isDeleted || notFound) return;

    try {
      const response = await formsService.getById(id!);
      if (response.success && response.data) {
        const adaptedForm = adaptFormFromAPI(response.data, user?.id);
        setForm(adaptedForm);
        setOriginalForm(JSON.parse(JSON.stringify(adaptedForm))); // Copie profonde pour comparaison
        setNotFound(false); // Reset si le formulaire est trouvé
      } else {
        // Formulaire non trouvé, marquer comme tel et rediriger
        setNotFound(true);
        addToast({
          type: "error",
          title: "Formulaire non trouvé",
          message: "Ce formulaire n'existe pas ou a été supprimé",
        });
        // Rediriger vers la liste des formulaires après un délai
        setTimeout(() => {
          navigate("/forms", { replace: true });
        }, 2000);
      }
    } catch (error: unknown) {
      // Vérifier si c'est une erreur 404
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) {
        setNotFound(true);
        addToast({
          type: "error",
          title: "Formulaire non trouvé",
          message: "Ce formulaire n'existe pas ou a été supprimé",
        });
        // Rediriger vers la liste des formulaires après un délai
        setTimeout(() => {
          navigate("/forms", { replace: true });
        }, 2000);
      } else {
        // Autres erreurs
        addToast({
          type: "error",
          title: "Erreur",
          message: "Impossible de charger le formulaire",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, addToast, isDeleted, notFound, navigate]);

  useEffect(() => {
    if (id && id !== "new") {
      fetchForm();
    } else {
      // Create new form
      const newForm: IForm = {
        id: "new",
        user_id: "user-1",
        title: "",
        description: "",
        status: "draft" as const,
        submissionCount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        history: {
          versions: [],
          currentVersion: 1,
          maxVersions: 10,
        },
        fields: [],
        settings: {
          theme: {
            primary_color: "#FACC15",
            background_color: "#020617",
            text_color: "#ffffff",
          },
          success_message: "Merci pour votre soumission !",
          notifications: {
            email: true,
          },
        },
      };
      setForm(newForm);
      setOriginalForm(JSON.parse(JSON.stringify(newForm))); // Copie profonde pour comparaison
      setLoading(false);
    }
  }, [id, fetchForm]);

  // Fonction pour récupérer et mettre à jour le formulaire après sauvegarde
  const refreshFormAfterSave = useCallback(async () => {
    if (!form || form.id === "new") return;

    try {
      const response = await formsService.getById(form.id);
      if (response.success && response.data) {
        const updatedForm = adaptFormFromAPI(response.data, user?.id);
        setForm(updatedForm);
        setOriginalForm(JSON.parse(JSON.stringify(updatedForm)));
      }
    } catch (fetchError) {
      console.error(
        "Impossible de récupérer la version mise à jour:",
        fetchError
      );
      setOriginalForm(JSON.parse(JSON.stringify(form)));
    }
  }, [form, user?.id]);

  // Fonction pour détecter les changements dans le formulaire
  const hasFormChanged = useCallback(
    (currentForm: IForm, originalFormData: IForm | null): boolean => {
      if (!originalFormData) return true; // Si pas d'original, considérer comme changé

      // Comparer les propriétés principales
      if (
        currentForm.title !== originalFormData.title ||
        currentForm.description !== originalFormData.description ||
        currentForm.status !== originalFormData.status
      ) {
        return true;
      }

      // Comparer les champs
      if (currentForm.fields.length !== originalFormData.fields.length) {
        return true;
      }

      // Comparer chaque champ
      for (let i = 0; i < currentForm.fields.length; i++) {
        const currentField = currentForm.fields[i];
        const originalField = originalFormData.fields[i];

        if (
          currentField.type !== originalField.type ||
          currentField.label !== originalField.label ||
          currentField.placeholder !== originalField.placeholder ||
          currentField.is_required !== originalField.is_required ||
          currentField.position !== originalField.position
        ) {
          return true;
        }

        // Comparer les options pour les champs select/radio
        if (currentField.type === "select" || currentField.type === "radio") {
          const currentChoices = currentField.options?.choices || [];
          const originalChoices = originalField.options?.choices || [];

          if (currentChoices.length !== originalChoices.length) {
            return true;
          }

          for (let j = 0; j < currentChoices.length; j++) {
            if (currentChoices[j] !== originalChoices[j]) {
              return true;
            }
          }
        }
      }

      // Comparer les paramètres
      const currentSettings = currentForm.settings;
      const originalSettings = originalFormData.settings;

      if (
        currentSettings.success_message !== originalSettings.success_message ||
        currentSettings.theme.primary_color !==
          originalSettings.theme.primary_color ||
        currentSettings.theme.background_color !==
          originalSettings.theme.background_color ||
        currentSettings.theme.text_color !==
          originalSettings.theme.text_color ||
        currentSettings.notifications.email !==
          originalSettings.notifications.email
      ) {
        return true;
      }

      return false;
    },
    []
  );

  // Validation commune pour les formulaires
  const validateForm = (formToValidate: IForm): boolean => {
    if (
      !formToValidate.title ||
      formToValidate.title.trim().length < 3 ||
      formToValidate.title.trim().length > 255
    ) {
      addToast({
        type: "error",
        title: "Erreur de validation",
        message: "Le titre doit contenir entre 3 et 255 caractères",
      });
      return false;
    }

    if (
      !formToValidate.description ||
      formToValidate.description.trim().length < 10 ||
      formToValidate.description.trim().length > 1000
    ) {
      addToast({
        type: "error",
        title: "Erreur de validation",
        message: "La description doit contenir entre 10 et 1000 caractères",
      });
      return false;
    }

    // Validation des champs
    for (const field of formToValidate.fields) {
      // Validation des labels des champs
      if (
        !field.label ||
        field.label.trim().length < 3 ||
        field.label.trim().length > 255
      ) {
        addToast({
          type: "error",
          title: "Erreur de validation",
          message: `Le label du champ ${
            field.label || "sans nom"
          } doit contenir entre 3 et 255 caractères`,
        });
        return false;
      }

      // Validation des champs avec options (select et radio)
      if (field.type === "select" || field.type === "radio") {
        const choices = field.options?.choices || [];
        const validChoices = choices.filter(
          (choice) => choice && choice.trim().length > 0
        );

        if (validChoices.length < 2) {
          addToast({
            type: "error",
            title: "Erreur de validation",
            message: `Le champ ${field.label} de type ${
              field.type === "select" ? "liste déroulante" : "bouton radio"
            } doit avoir au moins 2 options non vides`,
          });
          return false;
        }
      }
    }

    return true;
  };

  // Fonction utilitaire pour préparer les données du formulaire
  const prepareFormData = (
    formToPrepare: IForm,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  ): ICreateFormRequest => {
    return {
      title: formToPrepare.title,
      description: formToPrepare.description,
      status,
      schema: {
        fields: formToPrepare.fields.map((field, index) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.is_required,
          // Inclure placeholder même si vide (requis par l'API)
          placeholder: field.placeholder || "",
          // Ajouter le champ position requis par l'API
          position: index + 1,
          // Convertir les options pour les champs select/radio selon le format attendu
          ...(field.type === "select" || field.type === "radio"
            ? {
                options:
                  field.options?.choices?.map((choice: string) => ({
                    value: choice.toLowerCase().replace(/\s+/g, "_"),
                    label: choice,
                  })) || [],
              }
            : {}),
          validation: {
            // Mapper les propriétés frontend vers API selon le contrat
            required: field.is_required,
            minLength: field.validation_rules.min_length,
            maxLength: field.validation_rules.max_length,
            min: field.validation_rules.min_value,
            max: field.validation_rules.max_value,
            pattern: field.validation_rules.pattern,
          },
        })),
        settings: {
          // Structure réelle attendue par l'API (différente du contrat documenté)
          submitButton: {
            text: "Envoyer",
          },
          successMessage: formToPrepare.settings.success_message,
          theme: {
            primaryColor: formToPrepare.settings.theme.primary_color,
          },
          emailNotification: {
            enabled: formToPrepare.settings.notifications.email ? true : false,
            recipients: formToPrepare.settings.notifications.email
              ? [user?.email || ""]
              : [user?.email || ""], // L'API exige toujours un tableau non vide
          },
        },
      },
    };
  };

  const handleSave = async () => {
    if (!form) return;

    if (!validateForm(form)) return;

    // Vérifier s'il y a des changements avant de sauvegarder
    if (form.id !== "new" && !hasFormChanged(form, originalForm)) {
      addToast({
        type: "info",
        title: "Aucune modification détectée",
        message:
          "Le formulaire n'a pas été modifié depuis la dernière sauvegarde",
      });
      return;
    }

    setSaving(true);
    try {
      if (form.id === "new") {
        // Créer un nouveau formulaire
        const createData = prepareFormData(
          form,
          form.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED"
        );
        await createForm(createData);
        navigate("/forms");
      } else {
        // Mettre à jour un formulaire existant
        const updateData: IUpdateFormRequest = prepareFormData(
          form,
          form.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED"
        );
        await updateForm(form.id, updateData);
        await refreshFormAfterSave();
      }
      addToast({
        type: "success",
        title: "Formulaire sauvegardé",
        message: "Vos modifications ont été enregistrées",
      });
    } catch (error) {
      if (error instanceof QuotaExceededError) {
        handleQuotaError(error);
        return;
      }

      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de sauvegarder le formulaire",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!form) return;

    if (!validateForm(form)) return;

    setPublishing(true);
    try {
      // Si c'est un nouveau formulaire, le créer directement avec le statut PUBLISHED
      if (form.id === "new") {
        const createData = prepareFormData(form, "PUBLISHED");
        await createForm(createData);
        addToast({
          type: "success",
          title: "Formulaire créé et publié",
          message: "Votre formulaire a été créé et publié avec succès",
        });
        navigate("/forms");
        return;
      } else {
        // Pour un formulaire existant, le publier directement
        await publishForm(form.id);
        await refreshFormAfterSave();

        // Recharger les données d'intégration si on est sur l'onglet embed
        if (activeTab === "embed") {
          loadEmbedData();
        }
        addToast({
          type: "success",
          title: "Formulaire publié",
          message: "Votre formulaire est maintenant accessible au public",
        });
      }
    } catch (error) {
      if (error instanceof QuotaExceededError) {
        handleQuotaError(error);
        return;
      }

      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de publier le formulaire",
      });
    } finally {
      setPublishing(false);
    }
  };

  // Rediriger vers l'onglet "build" si l'onglet actif n'est plus disponible
  useEffect(() => {
    if (form && form.status === "draft" && activeTab === "embed") {
      setActiveTab("build");
    }
  }, [form, form?.status, activeTab]);

  const handleDelete = () => {
    if (!form || form.id === "new") return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!form || form.id === "new") return;

    try {
      setDeleting(true);
      setIsDeleted(true); // Marquer comme supprimé avant l'appel API
      await deleteForm(form.id);
      addToast({
        type: "success",
        title: "Formulaire supprimé",
        message: "Le formulaire a été supprimé avec succès",
      });
      setShowDeleteModal(false);
      navigate("/forms");
    } catch {
      setIsDeleted(false); // Remettre à false en cas d'erreur
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer le formulaire",
      });
    } finally {
      setDeleting(false);
    }
  };

  const addField = (type: string) => {
    if (!form) return;

    const newField: IFormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      form_version_id: "temp",
      type: type as IFormField["type"],
      label: `Nouveau champ ${type}`,
      is_required: false,
      options: {
        choices: [],
      },
      position: form.fields.length + 1,
      order: form.fields.length + 1,
      validation_rules: {},
    };

    setForm({
      ...form,
      fields: [...form.fields, newField],
    });
  };

  const updateField = useCallback(
    (fieldId: string, updates: Partial<IFormField>) => {
      if (!form) return;

      setForm({
        ...form,
        fields: form.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        ),
      });
    },
    [form]
  );

  const removeField = useCallback(
    (fieldId: string) => {
      if (!form) return;

      setForm({
        ...form,
        fields: form.fields.filter((field) => field.id !== fieldId),
      });
    },
    [form]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !form) return;

    if (active.id === over.id) return;

    try {
      // Utiliser directement l'index dans le tableau form.fields
      const oldIndex = form.fields.findIndex((field) => field.id === active.id);
      const newIndex = form.fields.findIndex((field) => field.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedFields = arrayMove(form.fields, oldIndex, newIndex);

      // Mettre à jour les propriétés order et position
      const updatedFields = reorderedFields.map((field, index) => ({
        ...field,
        order: index + 1,
        position: index + 1,
      }));

      setForm({
        ...form,
        fields: updatedFields,
      });
    } catch (error) {
      console.error("Erreur lors du réordonnancement:", error);
    }
  };

  // Fonction pour charger les données d'intégration via le service
  const loadEmbedData = useCallback(async () => {
    if (!form || form.id === "new" || form.status === "draft") return;

    setLoadingEmbed(true);
    setEmbedError(null);

    try {
      const response = await formsService.getEmbedCode(form.id, {
        width: "100%",
        height: "600",
      });

      if (response.success && response.data) {
        setEmbedData({
          embedCode: response.data.embedCode,
          embedUrl: response.data.embedUrl,
          token: response.data.token,
        });
      } else {
        setEmbedError(
          response.message || "Erreur lors du chargement du code d'intégration"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données d'intégration:",
        error
      );
      setEmbedError("Erreur lors du chargement du code d'intégration");
    } finally {
      setLoadingEmbed(false);
    }
  }, [form]);

  // Charger les données d'intégration quand on passe à l'onglet embed
  useEffect(() => {
    if (
      activeTab === "embed" &&
      form &&
      form.id !== "new" &&
      form.status !== "draft"
    ) {
      loadEmbedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, form?.id, form?.status]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: "success",
      title: `${type} copié`,
      message: `Le ${type.toLowerCase()} a été copié dans le presse-papiers`,
    });
  };

  const openEmbedPreview = () => {
    if (embedData?.embedUrl) {
      window.open(embedData.embedUrl, "_blank");
    } else {
      addToast({
        type: "error",
        title: "Erreur",
        message: "URL d'intégration non disponible",
      });
    }
  };

  // Callback memorisé pour la restauration de version
  const handleVersionRestored = useMemo(() => {
    return () => {
      // Recharger le formulaire après restauration
      if (form && form.id !== "new") {
        fetchForm(); // Ceci va automatiquement mettre à jour originalForm aussi
      }
    };
  }, [form, fetchForm]);

  const renderFormPreview = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-bold text-text-100">{form?.title}</h2>
          {form?.description && (
            <p className="text-surface-400">{form.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {form?.fields.map((field) => (
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
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                  disabled
                />
              )}
              {field.type === "email" && (
                <input
                  type="email"
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                  disabled
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                  disabled
                />
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                  disabled
                />
              )}
              {field.type === "textarea" && (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                  disabled
                />
              )}
              {field.type === "select" && (
                <Dropdown
                  value=""
                  options={
                    field.options?.choices?.map((choice: string) => ({
                      value: choice.toLowerCase().replace(/\s+/g, "_"),
                      label: choice,
                    })) || []
                  }
                  placeholder={field.placeholder || "Sélectionner une option"}
                  disabled
                  className="w-full"
                  onChange={() => {}} // No-op function since this is a preview
                />
              )}
              {field.type === "checkbox" && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled
                    className="w-4 h-4 border border-surface-700/50 rounded bg-surface-900 text-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200 checked:bg-accent-500 checked:border-accent-500 [&:checked]:bg-accent-500 [&:checked]:border-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11.207 5.793a1 1 0 010 1.414l-4 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l3.293-3.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")",
                      backgroundSize: "12px",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <span className="ml-2 text-sm text-surface-300">
                    {field.label}
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
                          className="text-accent-600 focus:ring-accent-500"
                          disabled
                        />
                        <span className="ml-2 text-sm text-surface-300">
                          {option}
                        </span>
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <Button className="w-full" variant="accent" disabled>
            Envoyer
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderEmbedView = () => {
    // Gestion des états de chargement et d'erreur
    if (loadingEmbed) {
      return (
        <div className="space-modern">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-surface-400">
                  Chargement des données d'intégration...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (embedError) {
      return (
        <div className="space-modern">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-400 mb-4">
                  <ExternalLink className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-red-400 font-medium mb-2">
                  Erreur de chargement
                </p>
                <p className="text-surface-400 text-sm mb-4">{embedError}</p>
                <Button
                  variant="secondary"
                  onClick={loadEmbedData}
                  className="mx-auto"
                >
                  Réessayer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!embedData) {
      return (
        <div className="space-modern">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-surface-500 mb-4">
                  <ExternalLink className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-surface-500 font-medium">
                  Données d'intégration non disponibles
                </p>
                <p className="text-surface-400 text-sm mt-1">
                  Veuillez d'abord publier le formulaire
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-modern">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-text-100">
              Intégration du formulaire
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL publique */}
            <div>
              <label className="block text-sm font-medium text-text-100 mb-2">
                URL publique
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={embedData.embedUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-sm font-mono text-surface-400"
                />
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(embedData.embedUrl, "Lien")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </Button>
                <Button variant="secondary" onClick={openEmbedPreview}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir
                </Button>
              </div>
            </div>

            {/* Code iframe */}
            <div>
              <label className="block text-sm font-medium text-text-100 mb-2">
                Code d'intégration (iframe)
              </label>
              <div className="space-y-2">
                <textarea
                  value={embedData.embedCode}
                  readOnly
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-sm font-mono text-surface-400"
                  rows={3}
                />
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(embedData.embedCode, "Code")}
                  className="w-full"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Copier le code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prévisualisation */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-text-100">
              Prévisualisation intégrée
            </h3>
          </CardHeader>
          <CardContent>
            <div className="border border-surface-700 rounded-xl overflow-hidden">
              <iframe
                src={embedData.embedUrl}
                width="100%"
                height="600"
                frameBorder="0"
                className="w-full"
                title="Prévisualisation du formulaire"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-modern">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-3">
            <div className="h-9 loading-blur rounded-xl w-80"></div>
            <div className="h-5 loading-blur rounded-lg w-96"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-11 loading-blur rounded-xl w-32"></div>
            <div className="h-11 loading-blur rounded-xl w-32"></div>
          </div>
        </div>

        {/* Form info skeleton */}
        <div className="loading-blur rounded-2xl p-6">
          <div className="h-6 loading-blur rounded-lg w-48 mb-6"></div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 loading-blur rounded w-32"></div>
              <div className="h-12 loading-blur rounded-xl w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 loading-blur rounded w-36"></div>
              <div className="h-12 loading-blur rounded-xl w-full"></div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="loading-blur rounded-2xl p-3 mb-6">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 loading-blur rounded-xl w-24"></div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Field types skeleton */}
          <div className="loading-blur rounded-2xl p-6">
            <div className="h-6 loading-blur rounded-lg w-32 mb-6"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 loading-blur rounded-xl w-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Form builder skeleton */}
          <div className="lg:col-span-3">
            <div className="loading-blur rounded-2xl p-6">
              <div className="h-6 loading-blur rounded-lg w-48 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="loading-blur rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 loading-blur rounded-lg w-10"></div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-12 loading-blur rounded-xl"></div>
                          <div className="h-12 loading-blur rounded-xl"></div>
                        </div>
                        <div className="h-4 loading-blur rounded w-32"></div>
                      </div>
                      <div className="h-10 loading-blur rounded-xl w-10"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!form && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-500">
          {notFound
            ? "Formulaire non trouvé ou supprimé"
            : "Formulaire non trouvé"}
        </p>
        {notFound && (
          <p className="text-surface-400 text-sm mt-2">
            Redirection vers la liste des formulaires...
          </p>
        )}
      </div>
    );
  }

  if (!form) {
    return null; // Ne devrait pas arriver avec les conditions ci-dessus
  }

  return (
    <div className="space-modern">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/forms")}
            className="mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Retour à la liste des formulaires
          </Button>
          <h1 className="text-3xl font-bold text-text-100">
            {form.id === "new"
              ? "Nouveau formulaire"
              : "Modifier le formulaire"}
          </h1>
          <p className="text-surface-400 mt-2">
            {form.id === "new"
              ? "Créez un nouveau formulaire personnalisé pour collecter des données"
              : "Modifiez votre formulaire et personnalisez ses champs"}
          </p>
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          <Button variant="secondary" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          {form.id !== "new" && form.status !== "draft" && (
            <Button variant="accent" onClick={handleDelete} loading={deleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
          {form.status === "draft" && (
            <Button
              variant="accent"
              onClick={handlePublish}
              loading={publishing}
            >
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-text-100">
            Informations du formulaire
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-text-100 mb-2"
              >
                Titre du formulaire
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="block w-full px-3 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                placeholder="Ex: Formulaire de contact, Sondage client..."
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-100 mb-2"
              >
                Description du formulaire
              </label>
              <input
                id="description"
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="block w-full px-3 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                placeholder="Ex: Collectez les informations de vos visiteurs..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <div className="bg-surface-900 border border-surface-700/50 rounded-2xl p-3 mb-6">
        <nav className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("build")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out ${
              activeTab === "build"
                ? "bg-accent-500/10 text-accent-400 shadow-md shadow-accent-500/10 border border-accent-500/20"
                : "text-surface-400 hover:text-surface-300 hover:bg-surface-800 border border-transparent"
            }`}
          >
            <Wrench className="h-4 w-4" />
            Construire
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out ${
              activeTab === "preview"
                ? "bg-accent-500/10 text-accent-400 shadow-md shadow-accent-500/10 border border-accent-500/20"
                : "text-surface-400 hover:text-surface-300 hover:bg-surface-800 border border-transparent"
            }`}
          >
            <Eye className="h-4 w-4" />
            Prévisualisation
          </button>
          {form.id !== "new" && form.status !== "draft" && (
            <button
              onClick={() => setActiveTab("embed")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out ${
                activeTab === "embed"
                  ? "bg-accent-500/10 text-accent-400 shadow-md shadow-accent-500/10 border border-accent-500/20"
                  : "text-surface-400 hover:text-surface-300 hover:bg-surface-800 border border-transparent"
              }`}
            >
              <ExternalLink className="h-4 w-4" />
              Intégration
            </button>
          )}
          {form.id !== "new" && (
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-out ${
                activeTab === "history"
                  ? "bg-accent-500/10 text-accent-400 shadow-md shadow-accent-500/10 border border-accent-500/20"
                  : "text-surface-400 hover:text-surface-300 hover:bg-surface-800 border border-transparent"
              }`}
            >
              <Clock className="h-4 w-4" />
              Historique
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "build" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {/* Loading overlay during save */}
          {(saving || publishing) && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  {publishing
                    ? "Publication en cours..."
                    : "Sauvegarde en cours..."}
                </p>
                <p className="text-surface-400 text-sm mt-1">
                  Veuillez patienter
                </p>
              </div>
            </div>
          )}

          {/* Field Types */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-text-100">
                Types de champs
              </h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type)}
                    disabled={saving || publishing}
                    className="w-full flex items-center gap-3 p-3 text-left text-surface-300 hover:bg-surface-800 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{fieldType.label}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Form Builder */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-text-100">
                  Constructeur de formulaire
                </h3>
              </CardHeader>
              <CardContent>
                {form.fields.length === 0 ? (
                  <div className="text-center py-12 text-surface-500">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-surface-600" />
                    <p>Aucun champ ajouté</p>
                    <p className="text-sm">
                      Cliquez sur un type de champ pour commencer
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={form.fields.map((field) => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {form.fields.map((field) => (
                        <DraggableField
                          key={field.id}
                          field={field}
                          onUpdate={updateField}
                          onRemove={removeField}
                          disabled={saving || publishing}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="relative">
          {/* Loading overlay during save */}
          {(saving || publishing) && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  {publishing
                    ? "Publication en cours..."
                    : "Sauvegarde en cours..."}
                </p>
                <p className="text-surface-400 text-sm mt-1">
                  Veuillez patienter
                </p>
              </div>
            </div>
          )}

          <h3 className="text-xl font-semibold text-text-100 mb-8 text-center">
            Prévisualisation du formulaire
          </h3>
          {renderFormPreview()}
        </div>
      )}

      {activeTab === "embed" && (
        <div className="relative">
          {/* Loading overlay during save */}
          {(saving || publishing) && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  {publishing
                    ? "Publication en cours..."
                    : "Sauvegarde en cours..."}
                </p>
                <p className="text-surface-400 text-sm mt-1">
                  Veuillez patienter
                </p>
              </div>
            </div>
          )}

          {renderEmbedView()}
        </div>
      )}

      {activeTab === "history" && (
        <div className="relative">
          {/* Loading overlay during save */}
          {(saving || publishing) && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  {publishing
                    ? "Publication en cours..."
                    : "Sauvegarde en cours..."}
                </p>
                <p className="text-surface-400 text-sm mt-1">
                  Veuillez patienter
                </p>
              </div>
            </div>
          )}

          <FormHistory
            formId={form.id}
            currentVersion={form.version}
            onVersionRestored={handleVersionRestored}
          />
        </div>
      )}

      {/* Modal de confirmation pour supprimer */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="lg"
        title={
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-accent-400" />
            <span>Supprimer le formulaire</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-base text-surface-300">
              Êtes-vous sûr de vouloir supprimer ce formulaire ? Cette action
              est irréversible et supprimera complètement ce formulaire ainsi
              que toutes les données associées.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              variant="accent"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
