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
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom";
import { FormHistory } from "../../components/forms/FormHistory";
import { VersionIndicator } from "../../components/forms/VersionIndicator";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../hooks/useToast";
import { formsAPI } from "../../services/api";
import { IForm, IFormField } from "../../types";

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
  const [form, setForm] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "build" | "preview" | "embed" | "history"
  >("build");

  const fetchForm = useCallback(async () => {
    try {
      const response = await formsAPI.getById(id!);
      if (response.success && response.data) {
        setForm(response.data);
      }
    } catch {
      console.error("Error fetching form");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== "new") {
      fetchForm();
    } else {
      // Create new form
      setForm({
        id: "new",
        user_id: "user-1",
        title: "Nouveau formulaire",
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
            primary_color: "#3B82F6",
            background_color: "#FFFFFF",
            text_color: "#1F2937",
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

    setSaving(true);
    try {
      if (form.id === "new") {
        const response = await formsAPI.create(form);
        if (response.success && response.data) {
          setForm(response.data);
          navigate(`/forms/${response.data.id}/edit`);
        }
      } else {
        const response = await formsAPI.update(form.id, form);
        if (response.success && response.data) {
          setForm(response.data);
        }
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
      const updatedForm = { ...form, status: "published" as const };
      const response = await formsAPI.update(form.id, updatedForm);
      if (response.success && response.data) {
        setForm(response.data);
        addToast({
          type: "success",
          title: "Formulaire publié",
          message: "Votre formulaire est maintenant accessible au public",
        });
      }
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

  const addField = (type: string) => {
    if (!form) return;

    const newField: IFormField = {
      id: `field-${Date.now()}`,
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

  const updateField = (fieldId: string, updates: Partial<IFormField>) => {
    if (!form) return;

    setForm({
      ...form,
      fields: form.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  const removeField = (fieldId: string) => {
    if (!form) return;

    setForm({
      ...form,
      fields: form.fields.filter((field) => field.id !== fieldId),
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !form) return;

    const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);
    const items = Array.from(sortedFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedFields = items.map((field, index) => ({
      ...field,
      order: index + 1,
    }));

    setForm({
      ...form,
      fields: updatedFields,
    });
  };

  const getPublishUrl = () => {
    if (!form || form.id === "new") return "";
    return `${window.location.origin}/embed/${form.id}?token=jwt_token_here`;
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

  const renderFieldEditor = (field: IFormField, index: number) => {
    return (
      <Draggable key={field.id} draggableId={field.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-4 ${
              snapshot.isDragging ? "shadow-lg rotate-2" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                  {...provided.dragHandleProps}
                  className="flex-shrink-0 mt-2 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Label du champ"
                      value={field.label}
                      onChange={(e) =>
                        updateField(field.id, { label: e.target.value })
                      }
                    />
                    <Input
                      label="Placeholder"
                      value={field.placeholder || ""}
                      onChange={(e) =>
                        updateField(field.id, { placeholder: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.is_required}
                        onChange={(e) =>
                          updateField(field.id, {
                            is_required: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Champ obligatoire
                      </span>
                    </label>
                    <span className="text-sm text-gray-500">
                      Type: {field.type}
                    </span>
                  </div>
                  {(field.type === "select" || field.type === "radio") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options (une par ligne)
                      </label>
                      <textarea
                        value={field.options?.choices?.join("\n") || ""}
                        onChange={(e) =>
                          updateField(field.id, {
                            options: {
                              ...field.options,
                              choices: e.target.value
                                .split("\n")
                                .filter((o) => o.trim()),
                            },
                          })
                        }
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  };

  const renderFormPreview = () => {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">{form?.title}</h2>
          {form?.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {form?.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.is_required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              )}
              {field.type === "email" && (
                <input
                  type="email"
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              )}
              {field.type === "textarea" && (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              )}
              {field.type === "select" && (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                >
                  <option value="">
                    {field.placeholder || "Sélectionner une option"}
                  </option>
                  {field.options?.choices?.map(
                    (option: string, index: number) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              )}
              {field.type === "checkbox" && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-700">
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
                          className="text-blue-600 focus:ring-blue-500"
                          disabled
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {option}
                        </span>
                      </label>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <Button className="w-full" disabled>
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Intégration du formulaire
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL publique */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL publique
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={publishUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(publishUrl, "Lien")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </Button>
                <Button variant="outline" onClick={openEmbedPreview}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir
                </Button>
              </div>
            </div>

            {/* Code iframe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code d'intégration (iframe)
              </label>
              <div className="space-y-2">
                <textarea
                  value={iframeSnippet}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  rows={3}
                />
                <Button
                  variant="outline"
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
            <h3 className="text-lg font-semibold text-gray-900">
              Prévisualisation intégrée
            </h3>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
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
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Formulaire non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre du formulaire
          </label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="text-2xl font-bold border-none p-0 focus:ring-0"
            placeholder="Titre du formulaire"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">
            Description du formulaire
          </label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="text-gray-600 border-none p-0 focus:ring-0 mt-2"
            placeholder="Description du formulaire"
          />
          {form.id !== "new" && form.history && (
            <div className="mt-3">
              <VersionIndicator
                currentVersion={form.version}
                totalVersions={form.history.versions.length}
                maxVersions={form.history.maxVersions}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("preview")}
            className={
              activeTab === "preview" ? "bg-blue-50 text-blue-600" : ""
            }
          >
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          {form.id !== "new" && (
            <Button
              variant="outline"
              onClick={() => setActiveTab("embed")}
              className={
                activeTab === "embed" ? "bg-blue-50 text-blue-600" : ""
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Intégrer
            </Button>
          )}
          {form.id !== "new" && (
            <Button
              variant="outline"
              onClick={() => setActiveTab("history")}
              className={
                activeTab === "history" ? "bg-blue-50 text-blue-600" : ""
              }
            >
              <Clock className="h-4 w-4 mr-2" />
              Historique
            </Button>
          )}
          <Button variant="outline" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          {form.status === "draft" && (
            <Button onClick={handlePublish} loading={saving}>
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("build")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "build"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Construire
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "preview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Prévisualisation
          </button>
          {form.id !== "new" && (
            <button
              onClick={() => setActiveTab("embed")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "embed"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Intégration
            </button>
          )}
          {form.id !== "new" && (
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Historique
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "build" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Field Types */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Types de champs</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type)}
                    className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
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
                <h3 className="font-semibold text-gray-900">
                  Constructeur de formulaire
                </h3>
              </CardHeader>
              <CardContent>
                {form.fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun champ ajouté</p>
                    <p className="text-sm">
                      Cliquez sur un type de champ pour commencer
                    </p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="fields">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {form.fields
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((field, index) =>
                              renderFieldEditor(field, index)
                            )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Prévisualisation du formulaire
          </h3>
          {renderFormPreview()}
        </div>
      )}

      {activeTab === "embed" && renderEmbedView()}

      {activeTab === "history" && (
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
      )}
    </div>
  );
}
