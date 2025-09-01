import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
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

export function FormSubmissions() {
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState<IForm | null>(null);
  const [formVersion, setFormVersion] = useState<IFormVersion | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [analytics, setAnalytics] = useState<{
    total: number;
    daily: Record<string, number>;
    conversion_rate: number;
    average_submission_time: number | null;
  } | null>(null);

  const fetchForm = useCallback(async () => {
    if (!id) return;
    try {
      const response = await formsService.getById(id);
      if (response?.success && response.data) {
        const adaptedForm = adaptFormFromAPI(response.data, user?.id);
        setForm(adaptedForm);

        const versionResponse = await versionsService.getByFormId(id);
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
    } catch {
      console.error("Error fetching form");
    }
  }, [id, user?.id]);

  const fetchSubmissions = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const submissions = await submissionsService.getByFormId(id, {
        page: currentPage,
        limit: itemsPerPage,
      });
      setSubmissions(submissions);
      setTotalItems(submissions.length);
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les soumissions",
      });
    } finally {
      setLoading(false);
    }
  }, [id, currentPage, itemsPerPage, addToast]);

  const fetchAnalytics = useCallback(async () => {
    if (!id) return;
    try {
      const data = await submissionsService.getAnalytics(id);
      setAnalytics(data);
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les statistiques",
      });
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  useEffect(() => {
    fetchSubmissions();
    fetchAnalytics();
  }, [fetchSubmissions, fetchAnalytics]);

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

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getFieldLabel = (fieldId: string) => {
    if (!formVersion?.schema?.fields) return fieldId;
    const field = formVersion.schema.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  const getSubmissionValueForDisplay = (
    submission: ISubmission,
    fieldId: string
  ) => {
    return getSubmissionValue(submission.data ?? {}, fieldId);
  };

  const getFieldKeys = (): string[] => {
    if (submissions.length === 0) return [];
    const allKeys = new Set<string>();
    submissions.forEach((s) => {
      Object.keys(s.data ?? {}).forEach((k) => allKeys.add(k));
    });
    return Array.from(allKeys).sort();
  };

  const fieldKeys = getFieldKeys();

  if (loading && !form) {
    return (
      <div className="space-modern">
        <div className="space-modern">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">
            Soumissions du formulaire
          </h1>
          <p className="text-surface-400 mt-2">{form.title}</p>
        </div>
        <Button
          onClick={handleExport}
          variant="secondary"
          disabled={submissions.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {analytics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-surface-500 text-sm">Total soumissions</p>
                <h2 className="text-2xl font-bold text-text-100">
                  {analytics.total}
                </h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-surface-500 text-sm">Taux de conversion</p>
                <h2 className="text-2xl font-bold text-text-100">
                  {analytics.conversion_rate}%
                </h2>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-surface-500 text-sm">
                  Temps moyen de remplissage
                </p>
                <h2 className="text-2xl font-bold text-text-100">
                  {analytics.average_submission_time
                    ? `${(analytics.average_submission_time / 60).toFixed(
                        1
                      )} min`
                    : "-"}
                </h2>
              </CardContent>
            </Card>
          </div>

          <div className="my-6">
            <Card>
              <CardHeader>
                <h3 className="text-sm font-semibold text-surface-400">
                  Évolution
                </h3>
              </CardHeader>
              <CardContent>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={Object.entries(analytics.daily).map(
                        ([date, value]) => ({
                          date,
                          value,
                        })
                      )}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#404040"
                        strokeOpacity={0.2}
                      />
                      <XAxis dataKey="date" stroke="#a3a3a3" />
                      <YAxis stroke="#a3a3a3" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#222222",
                          borderRadius: "12px",
                          padding: "8px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#eab308"
                        fill="#eab308"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 loading-blur rounded-2xl"></div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-center text-surface-500 py-12">
              Aucune soumission pour le moment
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-surface-900 text-surface-400 text-left">
                    <th className="p-2 border-b border-surface-700">#</th>
                    {fieldKeys.map((key) => (
                      <th key={key} className="p-2 border-b border-surface-700">
                        {getFieldLabel(key)}
                      </th>
                    ))}
                    <th className="p-2 border-b border-surface-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <tr
                      key={sub.id}
                      className={`border-b border-surface-700 ${
                        i % 2 === 0 ? "bg-surface-950" : "bg-surface-900"
                      }`}
                    >
                      <td className="p-2">{i + 1}</td>
                      {fieldKeys.map((key) => (
                        <td key={key} className="p-2">
                          {getSubmissionValueForDisplay(sub, key)}
                        </td>
                      ))}
                      <td className="p-2">{formatDate(sub.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
