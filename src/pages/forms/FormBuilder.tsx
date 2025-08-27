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
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormHistory } from "../../components/forms/FormHistory";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { useForms } from "../../hooks/useForms";
import { useToast } from "../../hooks/useToast";
import { formsService } from "../../services/api";
import {
  ICreateFormRequest,
  IUpdateFormRequest,
} from "../../services/api/forms/formsTypes";
import { IForm, IFormField } from "../../types";
import { adaptFormFromAPI } from "../../utils/formAdapter";

// Composant DraggableField extrait pour éviter les re-rendus
interface IDraggableFieldProps {
  field: IFormField;
  onUpdate: (fieldId: string, updates: Partial<IFormField>) => void;
  onRemove: (fieldId: string) => void;
}

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
  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "build" | "preview" | "embed" | "history"
  >("build");

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
    try {
      const response = await formsService.getById(id!);
      if (response.success && response.data) {
        const adaptedForm = adaptFormFromAPI(response.data, user?.id);
        setForm(adaptedForm);
      }
    } catch {
      console.error("Error fetching form");
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (id && id !== "new") {
      fetchForm();
    } else {
      // Create new form
      setForm({
        id: "new",
        user_id: "user-1",
        title: "",
        description: "",
        status: "draft",
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
      });
      setLoading(false);
    }
  }, [id, fetchForm]);

  const handleSave = async () => {
    if (!form) return;

    // Validation côté client selon le contrat API
    if (
      !form.title ||
      form.title.trim().length < 3 ||
      form.title.trim().length > 255
    ) {
      addToast({
        type: "error",
        title: "Erreur de validation",
        message: "Le titre doit contenir entre 3 et 255 caractères",
      });
      return;
    }

    if (
      !form.description ||
      form.description.trim().length < 10 ||
      form.description.trim().length > 1000
    ) {
      addToast({
        type: "error",
        title: "Erreur de validation",
        message: "La description doit contenir entre 10 et 1000 caractères",
      });
      return;
    }

    setSaving(true);
    try {
      if (form.id === "new") {
        // Créer un nouveau formulaire
        const createData: ICreateFormRequest = {
          title: form.title,
          description: form.description,
          status: form.status.toUpperCase() as
            | "DRAFT"
            | "PUBLISHED"
            | "ARCHIVED",
          schema: {
            fields: form.fields.map((field) => ({
              id: field.id,
              type: field.type,
              label: field.label,
              required: field.is_required,
              placeholder: field.placeholder,
              validation: {
                ...field.validation_rules,
                // Convertir les options pour les champs select/radio
                options:
                  field.type === "select" || field.type === "radio"
                    ? field.options?.choices
                    : undefined,
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
                  ? "admin@example.com"
                  : undefined,
                webhook: form.settings.notifications.webhook,
              },
            },
          },
        };
        await createForm(createData);
        // Le hook createForm va gérer la navigation et les toasts
      } else {
        // Mettre à jour un formulaire existant
        const updateData: IUpdateFormRequest = {
          title: form.title,
          description: form.description,
          status: form.status.toUpperCase() as
            | "DRAFT"
            | "PUBLISHED"
            | "ARCHIVED",
          schema: {
            fields: form.fields.map((field) => ({
              id: field.id,
              type: field.type,
              label: field.label,
              required: field.is_required,
              placeholder: field.placeholder,
              validation: {
                ...field.validation_rules,
                // Convertir les options pour les champs select/radio
                options:
                  field.type === "select" || field.type === "radio"
                    ? field.options?.choices
                    : undefined,
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
                  ? "admin@example.com"
                  : undefined,
                webhook: form.settings.notifications.webhook,
              },
            },
          },
        };
        await updateForm(form.id, updateData);
      }
      addToast({
        type: "success",
        title: "Formulaire sauvegardé",
        message: "Vos modifications ont été enregistrées",
      });
    } catch {
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

    setSaving(true);
    try {
      await publishForm(form.id);
      setForm({ ...form, status: "published" });
      addToast({
        type: "success",
        title: "Formulaire publié",
        message: "Votre formulaire est maintenant accessible au public",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de publier le formulaire",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form || form.id === "new") return;

    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce formulaire ? Cette action est irréversible."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      await deleteForm(form.id);
      addToast({
        type: "success",
        title: "Formulaire supprimé",
        message: "Le formulaire a été supprimé avec succès",
      });
      navigate("/forms");
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer le formulaire",
      });
    } finally {
      setSaving(false);
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

  const getPublishUrl = () => {
    if (!form || form.id === "new") return "";
    // Générer un token mockée pour le développement
    const mockToken = btoa(
      JSON.stringify({ formId: form.id, exp: Date.now() + 86400000 })
    );
    return `${window.location.origin}/embed/${form.id}?token=${mockToken}`;
  };

  const getIframeSnippet = () => {
    const publishUrl = getPublishUrl();
    if (!publishUrl) return "";
    return `<iframe src="${publishUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: "success",
      title: `${type} copié`,
      message: `Le ${type.toLowerCase()} a été copié dans le presse-papiers`,
    });
  };

  const openEmbedPreview = () => {
    const publishUrl = getPublishUrl();
    if (publishUrl) {
      window.open(publishUrl, "_blank");
    }
  };

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
                      value: choice,
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
    const publishUrl = getPublishUrl();
    const iframeSnippet = getIframeSnippet();

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
                  value={publishUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-sm font-mono text-surface-400"
                />
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(publishUrl, "Lien")}
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
                  value={iframeSnippet}
                  readOnly
                  className="w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-sm font-mono text-surface-400"
                  rows={3}
                />
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(iframeSnippet, "Code")}
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
                src={publishUrl}
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

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-500">Formulaire non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-modern">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
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
          {form.id !== "new" && (
            <Button variant="accent" onClick={handleDelete} loading={saving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
          {form.status === "draft" && (
            <Button variant="accent" onClick={handlePublish} loading={saving}>
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
          {form.id !== "new" && (
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
          {saving && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  Sauvegarde en cours...
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
                    disabled={saving}
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
                          disabled={saving}
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
          {saving && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  Sauvegarde en cours...
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
          {saving && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  Sauvegarde en cours...
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
          {saving && (
            <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-accent-400 font-medium">
                  Sauvegarde en cours...
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
            onVersionRestored={() => {
              // Recharger le formulaire après restauration
              if (form.id !== "new") {
                fetchForm();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
