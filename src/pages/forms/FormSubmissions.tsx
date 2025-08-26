import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../hooks/useToast";
import { formsService, versionsService } from "../../services/api";
import { submissionsAPI } from "../../services/api.mock";
import { IForm, IFormVersion, ISubmission } from "../../types";

export function FormSubmissions() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [form, setForm] = useState<IForm | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [formVersion, setFormVersion] = useState<IFormVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchForm = useCallback(async () => {
    try {
      const response = await formsService.getById(id!);
      if (response.success && response.data) {
        const formData = response.data;
        // Adapter les données de l'API vers le format UI
        const adaptedForm: IForm = {
          id: formData.id,
          user_id: "user-1",
          title: formData.title,
          description: formData.description,
          status: formData.status.toLowerCase() as
            | "draft"
            | "published"
            | "disabled",
          published_at: formData.publishedAt || undefined,
          created_at: formData.createdAt,
          updated_at: formData.updatedAt,
          submissionCount: formData.submissionsCount || 0,
          version: formData.currentVersion?.versionNumber || 1,
          fields:
            formData.schema?.fields?.map((field) => ({
              id: field.id,
              form_version_id: formData.currentVersion?.id || "",
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
          history: {
            versions: [],
            currentVersion: formData.currentVersion?.versionNumber || 1,
            maxVersions: 10,
          },
          settings: {
            theme: {
              primary_color:
                formData.schema?.settings?.theme?.primaryColor || "#3B82F6",
              background_color:
                formData.schema?.settings?.theme?.backgroundColor || "#FFFFFF",
              text_color: "#1F2937",
            },
            success_message:
              formData.schema?.settings?.successMessage ||
              "Merci pour votre soumission !",
            notifications: {
              email: !!formData.schema?.settings?.notifications?.email,
              webhook: formData.schema?.settings?.notifications?.webhook,
            },
          },
        };
        setForm(adaptedForm);

        // Récupérer la version actuelle du formulaire
        const versionResponse = await versionsService.getByFormId(id!);
        if (versionResponse.success && versionResponse.data) {
          // Prendre la version la plus récente (versionNumber la plus élevée)
          const latestVersion = versionResponse.data.reduce((latest, current) =>
            current.versionNumber > latest.versionNumber ? current : latest
          );
          // Adapter la version vers le format UI
          const adaptedVersion: IFormVersion = {
            id: latestVersion.id,
            form_id: formData.id,
            version_number: latestVersion.versionNumber,
            schema: {
              title: formData.title,
              description: formData.description,
              fields: latestVersion.schema.fields.map((field) => ({
                id: field.id,
                form_version_id: latestVersion.id,
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
              })),
              settings: {
                theme: {
                  primary_color:
                    latestVersion.schema.settings.theme?.primaryColor ||
                    "#3B82F6",
                  background_color:
                    latestVersion.schema.settings.theme?.backgroundColor ||
                    "#FFFFFF",
                  text_color: "#1F2937",
                },
                success_message:
                  latestVersion.schema.settings.successMessage ||
                  "Merci pour votre soumission !",
                notifications: {
                  email: !!latestVersion.schema.settings.notifications?.email,
                  webhook: latestVersion.schema.settings.notifications?.webhook,
                },
              },
              status: formData.status.toLowerCase() as
                | "draft"
                | "published"
                | "disabled",
            },
            created_at: latestVersion.createdAt,
          };
          setFormVersion(adaptedVersion);
        }
      }
    } catch {
      console.error("Error fetching form");
    }
  }, [id]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await submissionsAPI.getByFormId(id!);

      if (response.success && response.data) {
        setSubmissions(response.data);
        setTotalItems(response.data.length);
      }
    } catch {
      console.error("Error fetching submissions");
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les soumissions",
      });
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    if (id) {
      fetchForm();
      fetchSubmissions();
    }
  }, [id, currentPage, itemsPerPage, fetchForm, fetchSubmissions]);

  const handleExport = async () => {
    try {
      // In real app, would trigger CSV export
      addToast({
        type: "success",
        title: "Export en cours",
        message: "Le fichier CSV sera téléchargé dans quelques secondes",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible d'exporter les données",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir le label d'un champ par son ID
  const getFieldLabel = (fieldId: string): string => {
    if (!formVersion?.schema?.fields) return fieldId;
    const field = formVersion.schema.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  // Fonction pour obtenir la valeur d'un champ de soumission
  const getSubmissionValue = (
    submission: ISubmission,
    fieldId: string
  ): string => {
    const value = submission.data[fieldId];
    if (value === undefined || value === null) return "-";
    return String(value);
  };

  // Fonction pour obtenir les clés des champs depuis les soumissions
  const getFieldKeys = (): string[] => {
    if (submissions.length === 0) return [];

    // Extraire toutes les clés uniques des données de soumission
    const allKeys = new Set<string>();
    submissions.forEach((submission) => {
      Object.keys(submission.data).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys).sort();
  };

  // Obtenir les clés des champs (fallback si formVersion n'est pas disponible)
  const fieldKeys = getFieldKeys();

  if (loading && !form) {
    return (
      <div className="space-modern">
        <div>
          <div className="h-8 loading-blur rounded-2xl w-1/3 mb-4"></div>
          <div className="h-64 loading-blur rounded-2xl"></div>
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
            Soumissions du formulaire
          </h1>
          <p className="text-surface-400 mt-2">{form.title}</p>
        </div>
        <Button onClick={handleExport} variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 loading-blur rounded-2xl"></div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-surface-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-100 mb-2">
                Aucune soumission trouvée
              </h3>
              <p className="text-surface-400">
                Aucune soumission pour le moment
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-surface-300 text-sm">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-surface-300 text-sm">
                      IP
                    </th>
                    {/* Colonnes dynamiques pour les champs du formulaire */}
                    {fieldKeys.map((fieldKey) => (
                      <th
                        key={fieldKey}
                        className="text-left py-4 px-6 font-medium text-surface-300 text-sm"
                      >
                        {getFieldLabel(fieldKey)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((submission) => (
                      <tr key={submission.id}>
                        <td className="py-4 px-6 text-sm text-surface-500">
                          {formatDate(submission.submitted_at)}
                        </td>
                        <td className="py-4 px-6 text-sm text-surface-500">
                          {submission.ip_address}
                        </td>
                        {/* Cellules dynamiques pour les valeurs des champs */}
                        {fieldKeys.map((fieldKey) => (
                          <td
                            key={fieldKey}
                            className="py-4 px-6 text-sm text-surface-500"
                          >
                            <div
                              className="max-w-xs truncate"
                              title={getSubmissionValue(submission, fieldKey)}
                            >
                              {getSubmissionValue(submission, fieldKey)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
