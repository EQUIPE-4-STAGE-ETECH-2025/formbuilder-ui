import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Copy,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../hooks/useToast";
import { formsAPI } from "../../services/api.mock";
import { IForm } from "../../types";

export function FormsList() {
  const [forms, setForms] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published" | "disabled"
  >("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { addToast } = useToast();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await formsAPI.getAll();
      if (response.success && response.data) {
        setForms(response.data);
      }
    } catch {
      console.error("Error fetching forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?")) {
      try {
        await formsAPI.delete(id);
        setForms(forms.filter((form) => form.id !== id));
        addToast({
          type: "success",
          title: "Formulaire supprimé",
          message: "Le formulaire a été supprimé avec succès",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erreur",
          message: "Impossible de supprimer le formulaire",
        });
      }
    }
    setActiveDropdown(null);
  };

  const handleDuplicateForm = async (formId: string) => {
    try {
      const originalForm = forms.find((f) => f.id === formId);
      if (!originalForm) return;

      const duplicatedForm: IForm = {
        ...originalForm,
        id: `form-${Date.now()}`,
        title: `${originalForm.title} (Copie)`,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setForms([duplicatedForm, ...forms]);

      addToast({
        type: "success",
        title: "Formulaire dupliqué",
        message: "Le formulaire a été dupliqué avec succès",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de dupliquer le formulaire",
      });
    }
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      disabled: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: "Brouillon",
      published: "Publié",
      disabled: "Désactivé",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredForms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedForms = filteredForms.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Formulaires</h1>
          <p className="text-gray-600">
            Gérez vos formulaires et suivez leurs performances
          </p>
        </div>
        <Link to="/forms/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau formulaire
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un formulaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "draft" | "published" | "disabled"
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="disabled">Désactivé</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      <Card>
        <CardContent className="p-0">
          {paginatedForms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun formulaire trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Aucun formulaire ne correspond à vos critères de recherche."
                  : "Vous n'avez encore créé aucun formulaire."}
              </p>
              <Link to="/forms/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre premier formulaire
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedForms.map((form) => (
                <div
                  key={form.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {form.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            form.status
                          )}`}
                        >
                          {getStatusText(form.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{form.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>
                          Modifié{" "}
                          {formatDistanceToNow(new Date(form.updated_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                        <span>
                          Créé le{" "}
                          {new Date(form.created_at).toLocaleDateString()}
                        </span>
                        {form.published_at && (
                          <span>
                            Publié le{" "}
                            {new Date(form.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/forms/${form.id}/submissions`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les réponses
                        </Button>
                      </Link>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === form.id ? null : form.id
                            )
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {activeDropdown === form.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <Link
                                to={`/forms/${form.id}/edit`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </Link>
                              <button
                                onClick={() => handleDuplicateForm(form.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Dupliquer
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(form.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
