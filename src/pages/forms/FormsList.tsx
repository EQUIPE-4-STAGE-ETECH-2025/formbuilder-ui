import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";

import { useForms } from "../../hooks/useForms";
import { useToast } from "../../hooks/useToast";

export function FormsList() {
  const navigate = useNavigate();
  const { forms, loading, deleteForm } = useForms();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published" | "disabled"
  >("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "disabled":
        return "Désactivé";
      default:
        return "Inconnu";
    }
  };

  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || form.status === statusFilter;

    // Filtre par date
    let matchesDate = true;
    if (dateFilter !== "all") {
      const formDate = new Date(form.created_at);
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;

      switch (dateFilter) {
        case "today":
          matchesDate = formDate.toDateString() === now.toDateString();
          break;
        case "week": {
          const weekAgo = new Date(now.getTime() - 7 * oneDay);
          matchesDate = formDate >= weekAgo;
          break;
        }
        case "month": {
          const monthAgo = new Date(now.getTime() - 30 * oneDay);
          matchesDate = formDate >= monthAgo;
          break;
        }
        case "year": {
          const yearAgo = new Date(now.getTime() - 365 * oneDay);
          matchesDate = formDate >= yearAgo;
          break;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalItems = filteredForms.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedForms = filteredForms.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDelete = (formId: string, formTitle: string) => {
    setSelectedForm({ id: formId, title: formTitle });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedForm) return;

    try {
      setDeleting(true);
      await deleteForm(selectedForm.id);
      addToast({
        type: "success",
        title: "Formulaire supprimé",
        message: "Le formulaire a été supprimé avec succès",
      });
      setShowDeleteModal(false);
      setSelectedForm(null);
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer le formulaire",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-modern">
        <div className="space-modern">
          <div className="h-32 loading-blur rounded-2xl"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 loading-blur rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-modern">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Mes formulaires</h1>
          <p className="text-surface-400 mt-2">
            Gérez vos formulaires et suivez leurs performances
          </p>
        </div>
        <Link to="/forms/new">
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau formulaire
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
              <input
                type="text"
                placeholder="Rechercher un formulaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-text-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Dropdown
                value={statusFilter}
                options={[
                  { value: "all", label: "Tous les statuts" },
                  { value: "draft", label: "Brouillon" },
                  { value: "published", label: "Publié" },
                  { value: "disabled", label: "Désactivé" },
                ]}
                onChange={(value: string) =>
                  setStatusFilter(
                    value as "all" | "draft" | "published" | "disabled"
                  )
                }
                size="md"
                className="min-w-[160px]"
                icon={<Zap className="h-4 w-4" />}
              />
              <Dropdown
                value={dateFilter}
                options={[
                  { value: "all", label: "Toutes les dates" },
                  { value: "today", label: "Aujourd'hui" },
                  { value: "week", label: "Cette semaine" },
                  { value: "month", label: "Ce mois" },
                  { value: "year", label: "Cette année" },
                ]}
                onChange={(value: string) => setDateFilter(value)}
                size="md"
                className="min-w-[160px]"
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      {paginatedForms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
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
              Aucun formulaire trouvé
            </h3>
            <p className="text-surface-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Aucun formulaire ne correspond à vos critères de recherche."
                : "Vous n'avez encore créé aucun formulaire."}
            </p>
            <Link to="/forms/new">
              <Button variant="accent">
                <Plus className="h-4 w-4 mr-2" />
                Créer votre premier formulaire
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedForms.map((form) => (
            <Card key={form.id} className="transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-accent-400" />
                      <h3 className="text-lg font-semibold text-text-100">
                        {form.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-500/20 text-accent-400 border border-accent-500/30">
                        {getStatusText(form.status)}
                      </span>
                    </div>
                    <p className="text-surface-400 mb-4">{form.description}</p>
                    <div className="flex items-center gap-6 text-sm text-surface-500">
                      <span className="flex items-center gap-1">
                        {form.submissionCount || 0} Soumission
                        {(form.submissionCount || 0) > 1 ? "s" : ""}
                      </span>
                      <span>
                        Modifié{" "}
                        {formatDistanceToNow(new Date(form.updated_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                      <span>
                        Créé le {new Date(form.created_at).toLocaleDateString()}
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
                    {form.status === "published" ? (
                      <Link to={`/forms/${form.id}/submissions`}>
                        <Button
                          variant="secondary"
                          size="md"
                          className="shadow-none hover:shadow-none"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les réponses
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="secondary"
                        size="md"
                        className="shadow-none hover:shadow-none"
                        onClick={() => handleDelete(form.id, form.title)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="md"
                      className="shadow-none hover:shadow-none"
                      onClick={() => {
                        navigate(`/forms/${form.id}/edit`);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        {selectedForm && (
          <div className="space-y-4">
            <div>
              <p className="text-base text-surface-300">
                Êtes-vous sûr de vouloir supprimer le formulaire "
                {selectedForm.title}" ? Cette action est irréversible et
                supprimera complètement ce formulaire.
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
        )}
      </Modal>
    </div>
  );
}
