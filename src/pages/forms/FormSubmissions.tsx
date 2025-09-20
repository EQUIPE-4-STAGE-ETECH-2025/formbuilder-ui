import { ArrowLeft, Download } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { formsService, versionsService } from "../../services/api";
import { submissionsService } from "../../services/api/submissions/submissionsService";
import {
  ISubmission,
  getSubmissionValue,
} from "../../services/api/submissions/submissionsTypes";
import { IForm, IFormVersion } from "../../types";
import {
  adaptFormFromAPI,
  adaptVersionFromAPIForHooks,
} from "../../utils/formAdapter";

// Composant mémorisé pour les lignes du tableau
const SubmissionRow = memo(
  ({
    submission,
    fieldKeys,
    getSubmissionValueForDisplay,
    formatDate,
  }: {
    submission: ISubmission;
    fieldKeys: string[];
    getSubmissionValueForDisplay: (
      submission: ISubmission,
      fieldId: string
    ) => string;
    formatDate: (dateString: string) => string;
  }) => (
    <tr>
      <td className="py-4 px-6 text-sm text-surface-500">
        {formatDate(submission.submittedAt)}
      </td>
      <td className="py-4 px-6 text-sm text-surface-500">
        {submission.ipAddress || "-"}
      </td>
      {fieldKeys.map((fieldKey) => (
        <td key={fieldKey} className="py-4 px-6 text-sm text-surface-500">
          <div
            className="max-w-xs truncate"
            title={getSubmissionValueForDisplay(submission, fieldKey)}
          >
            {getSubmissionValueForDisplay(submission, fieldKey)}
          </div>
        </td>
      ))}
    </tr>
  )
);

SubmissionRow.displayName = "SubmissionRow";

export function FormSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  // Utilisation d'une ref pour éviter le re-render cascade avec addToast
  const addToastRef = useRef(addToast);
  addToastRef.current = addToast;

  const [form, setForm] = useState<IForm | null>(null);
  const [formVersion, setFormVersion] = useState<IFormVersion | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [formLoading, setFormLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchForm = useCallback(async () => {
    if (!id) return;
    setFormLoading(true);
    try {
      // Paralléliser les appels API pour améliorer les performances
      const [formResponse, versionResponse] = await Promise.all([
        formsService.getById(id),
        versionsService.getByFormId(id),
      ]);

      if (formResponse?.success && formResponse.data) {
        const adaptedForm = adaptFormFromAPI(formResponse.data, user?.id);
        setForm(adaptedForm);

        if (versionResponse?.success && versionResponse.data?.length) {
          const latestVersion = versionResponse.data.reduce((latest, current) =>
            current.versionNumber > latest.versionNumber ? current : latest
          );
          const adaptedVersion = adaptVersionFromAPIForHooks(latestVersion);
          adaptedVersion.form_id = adaptedForm.id;
          adaptedVersion.schema.title = adaptedForm.title;
          adaptedVersion.schema.description = adaptedForm.description;
          adaptedVersion.schema.status = adaptedForm.status;
          setFormVersion(adaptedVersion);
        }
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      addToastRef.current({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger le formulaire",
      });
    } finally {
      setFormLoading(false);
    }
  }, [id, user?.id]);

  const fetchSubmissions = useCallback(async () => {
    if (!id) return;
    setSubmissionsLoading(true);
    try {
      const response = await submissionsService.getByFormId(id, {
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response?.success && response.data) {
        setSubmissions(response.data);
        setTotalItems(response.meta?.total || response.data.length);
      } else {
        setSubmissions([]);
        setTotalItems(0);
        if (response?.message) {
          addToastRef.current({
            type: "error",
            title: "Erreur",
            message: response.message,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      addToastRef.current({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les soumissions",
      });
    } finally {
      setSubmissionsLoading(false);
    }
  }, [id, currentPage, itemsPerPage]);

  // Effet séparé pour charger les données du formulaire (une seule fois)
  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id, fetchForm]);

  // Effet séparé pour charger les soumissions (dépend de la pagination)
  useEffect(() => {
    if (id && form) {
      fetchSubmissions();
    }
  }, [id, form, currentPage, itemsPerPage, fetchSubmissions]);

  const sanitizeFilename = (name: string) =>
    name.replace(/[^\p{L}\p{N}\-_. ]/gu, "_").trim() || "soumissions";

  const handleExport = async () => {
    if (!id) return;
    try {
      const file = await submissionsService.exportCsv(id);
      const blob =
        file instanceof Blob
          ? file
          : new Blob([typeof file === "string" ? file : ""], {
              type: "text/csv;charset=utf-8;",
            });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizeFilename(
        form?.title || "soumissions"
      )}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Export lancé",
        message: "Le téléchargement du CSV a démarré.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible d'exporter les données",
      });
    }
  };

  // Mémoriser les handlers pour éviter les re-renders inutiles
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  // Mémoriser la fonction de formatage des dates
  const formatDate = useCallback(
    (dateString: string) =>
      new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  // Mémoriser les calculs coûteux pour éviter les recalculs inutiles
  const fieldKeys = useMemo(() => {
    if (submissions.length === 0) return [];
    const allKeys = new Set<string>();
    submissions.forEach((s) => {
      Object.keys(s.data ?? {}).forEach((k) => allKeys.add(k));
    });
    return Array.from(allKeys).sort();
  }, [submissions]);

  // Mémoriser les labels des champs pour éviter les recherches répétées
  const fieldLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    if (formVersion?.schema?.fields) {
      formVersion.schema.fields.forEach((field) => {
        labels[field.id] = field.label;
      });
    }
    return labels;
  }, [formVersion?.schema?.fields]);

  const getFieldLabel = useCallback(
    (fieldId: string) => {
      return fieldLabels[fieldId] || fieldId;
    },
    [fieldLabels]
  );

  const getSubmissionValueForDisplay = useCallback(
    (submission: ISubmission, fieldId: string): string => {
      const value = getSubmissionValue(submission.data ?? {}, fieldId);
      if (value === undefined || value === null) return "-";
      return String(value);
    },
    []
  );

  // Affichage conditionnel optimisé
  if (formLoading) {
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
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto mb-4"></div>
                <p className="text-surface-400">
                  Chargement des soumissions...
                </p>
              </div>
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
                  {submissions.map((submission) => (
                    <SubmissionRow
                      key={submission.id}
                      submission={submission}
                      fieldKeys={fieldKeys}
                      getSubmissionValueForDisplay={
                        getSubmissionValueForDisplay
                      }
                      formatDate={formatDate}
                    />
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
