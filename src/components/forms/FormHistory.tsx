import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, FileText, GitBranch, RotateCcw, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { formVersionsAPI } from "../../services/api.mock";
import { IFormVersion } from "../../types";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Modal } from "../ui/Modal";

interface IFormHistoryProps {
  formId: string;
  currentVersion: number;
  onVersionRestored?: () => void;
}

export const FormHistory: React.FC<IFormHistoryProps> = ({
  formId,
  currentVersion,
  onVersionRestored,
}) => {
  const { addToast } = useToast();
  const [versions, setVersions] = useState<IFormVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<IFormVersion | null>(
    null
  );
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchVersions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formVersionsAPI.getByFormId(formId);
      if (response.success && response.data) {
        setVersions(
          response.data.sort((a, b) => b.version_number - a.version_number)
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger l'historique des versions",
      });
    } finally {
      setLoading(false);
    }
  }, [formId, addToast]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleViewVersion = (version: IFormVersion) => {
    setSelectedVersion(version);
    setShowVersionModal(true);
  };

  const handleRestoreVersion = (version: IFormVersion) => {
    setSelectedVersion(version);
    setShowRestoreModal(true);
  };

  const handleDeleteVersion = (version: IFormVersion) => {
    setSelectedVersion(version);
    setShowDeleteModal(true);
  };

  const confirmRestore = async () => {
    if (!selectedVersion) return;

    try {
      setRestoring(true);
      const response = await formVersionsAPI.restore(selectedVersion.id);

      if (response.success) {
        addToast({
          type: "success",
          title: "Version restaurée",
          message: `La version ${selectedVersion.version_number} a été restaurée avec succès`,
        });
        setShowRestoreModal(false);
        setSelectedVersion(null);
        onVersionRestored?.();
      } else {
        addToast({
          type: "error",
          title: "Erreur",
          message: response.error || "Impossible de restaurer la version",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la restauration",
      });
    } finally {
      setRestoring(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedVersion) return;

    try {
      setDeleting(true);
      const response = await formVersionsAPI.delete(selectedVersion.id);

      if (response.success) {
        addToast({
          type: "success",
          title: "Version supprimée",
          message: `La version ${selectedVersion.version_number} a été supprimée`,
        });
        setShowDeleteModal(false);
        setSelectedVersion(null);
        fetchVersions(); // Recharger la liste
      } else {
        addToast({
          type: "error",
          title: "Erreur",
          message: response.error || "Impossible de supprimer la version",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de la suppression",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusText = (version: IFormVersion) => {
    const status = version.schema.status;

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
      {versions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-surface-500 mb-4">
              <GitBranch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-text-100 mb-2">
              Aucune version disponible
            </h3>
            <p className="text-surface-400 mb-4">
              Les versions apparaîtront ici après sauvegarde
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => (
            <Card
              key={version.id}
              className={`hover:border-accent-500/30 transition-all duration-200 ${
                version.version_number === currentVersion
                  ? "border-accent-500/30 bg-accent-900/10"
                  : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-100">
                        Version numéro {version.version_number}
                      </h3>
                      {version.version_number === currentVersion && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-500/20 text-accent-400 border border-accent-500/30">
                          Actuelle
                        </span>
                      )}
                    </div>
                    <p className="text-surface-400 mb-4">
                      {version.schema.title || "Sans titre"}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-surface-500">
                      <span>Statut : {getStatusText(version)}</span>
                      <span>
                        Contient {version.schema.fields.length} champ
                        {version.schema.fields.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        Créée{" "}
                        {formatDistanceToNow(new Date(version.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="md"
                      className="shadow-none hover:shadow-none"
                      onClick={() => handleViewVersion(version)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les détails
                    </Button>

                    {version.version_number !== currentVersion && (
                      <>
                        <Button
                          variant="secondary"
                          size="md"
                          className="shadow-none hover:shadow-none"
                          onClick={() => handleRestoreVersion(version)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restaurer
                        </Button>

                        <Button
                          variant="secondary"
                          size="md"
                          className="shadow-none hover:shadow-none text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteVersion(version)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal pour voir une version */}
      <Modal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        size="lg"
      >
        {selectedVersion && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-text-100">Informations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-400">Titre :</span>
                  <span className="text-text-100">
                    {selectedVersion.schema.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Statut :</span>
                  <span className="text-text-100">
                    {getStatusText(selectedVersion)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Champs :</span>
                  <span className="text-text-100">
                    {selectedVersion.schema.fields.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Créée le :</span>
                  <span className="text-text-100">
                    {new Date(selectedVersion.created_at).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {selectedVersion.schema.description && (
              <div>
                <h4 className="font-medium mb-2 text-text-100">Description</h4>
                <p className="text-sm text-surface-300 bg-surface-800/50 backdrop-blur-sm p-3 rounded-xl">
                  {selectedVersion.schema.description}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2 text-text-100">Champs</h4>
              <div className="space-y-2">
                {selectedVersion.schema.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2 bg-surface-800/50 backdrop-blur-sm rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-surface-400" />
                      <span className="text-sm font-medium text-text-100">
                        {field.label}
                      </span>
                      {field.is_required && (
                        <span className="text-red-400 text-xs">*</span>
                      )}
                    </div>
                    <span className="text-xs text-surface-500 capitalize">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmation pour restaurer */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        title="Restaurer la version"
      >
        {selectedVersion && (
          <div className="space-y-4">
            <p className="text-surface-300">
              Êtes-vous sûr de vouloir restaurer la version{" "}
              {selectedVersion.version_number} ? Cette action créera une
              nouvelle version avec le contenu de la version sélectionnée.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowRestoreModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmRestore}
                disabled={restoring}
                variant="accent"
              >
                {restoring ? "Restauration..." : "Restaurer"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmation pour supprimer */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer la version"
      >
        {selectedVersion && (
          <div className="space-y-4">
            <p className="text-surface-300">
              Êtes-vous sûr de vouloir supprimer la version{" "}
              {selectedVersion.version_number} ? Cette action est irréversible.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleting}
                variant="danger"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
