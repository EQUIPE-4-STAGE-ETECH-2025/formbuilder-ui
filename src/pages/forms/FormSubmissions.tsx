import { Download, Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../hooks/useToast";
import { formsAPI, submissionsAPI } from "../../services/api";
import { IForm, ISubmission } from "../../types";

export function FormSubmissions() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [form, setForm] = useState<IForm | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchForm = useCallback(async () => {
    try {
      const response = await formsAPI.getById(id!);
      if (response.success && response.data) {
        setForm(response.data);
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

  const handleDeleteSubmission = async () => {
    try {
      // In real app, would call API to delete submission
      addToast({
        type: "success",
        title: "Soumission supprimée",
        message: "La soumission a été supprimée avec succès",
      });
      fetchSubmissions(); // Refresh the list
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer la soumission",
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

  if (loading && !form) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Soumissions</h1>
          <p className="text-gray-600">{form.title}</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
              <p className="text-sm text-gray-600">Total soumissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {submissions.length > 0 ? submissions.length : 0}
              </p>
              <p className="text-sm text-gray-600">Cette page</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.ceil(totalItems / itemsPerPage)}
              </p>
              <p className="text-sm text-gray-600">Pages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des soumissions
          </h3>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune soumission pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      IP
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(submission.submitted_at)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {submission.ip_address}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // In real app, would show submission details
                              addToast({
                                type: "info",
                                title: "Détails",
                                message:
                                  "Fonctionnalité en cours de développement",
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubmission()}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
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
