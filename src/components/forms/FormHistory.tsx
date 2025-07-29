import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  RotateCcw,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { formVersionsAPI } from "../../services/api";
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

  const getStatusIcon = (version: IFormVersion) => {
    // Utiliser le statut du schéma de la version
    const status = version.schema.status;

    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "draft":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "disabled":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Historique des versions</h3>
        <span className="text-sm text-gray-500">
          {versions.length} version{versions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Aucune version disponible</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <Card
              key={version.id}
              className={`p-4 border rounded-lg ${
                version.version_number === currentVersion
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(version)}
                    <span className="font-medium">
                      Version {version.version_number}
                      {version.version_number === currentVersion && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Actuelle
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(version.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {getStatusText(version)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVersion(version)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>

                    {version.version_number !== currentVersion && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreVersion(version)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restaurer
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVersion(version)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
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
        title={`Version ${selectedVersion?.version_number} - ${selectedVersion?.schema.title}`}
        size="lg"
      >
        {selectedVersion && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Informations</h4>
              <p className="text-sm text-gray-600">
                {selectedVersion.schema.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Champs</h4>
              <div className="space-y-2">
                {selectedVersion.schema.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm font-medium">{field.label}</span>
                    <span className="text-xs text-gray-500 capitalize">
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
            <p>
              Êtes-vous sûr de vouloir restaurer la version{" "}
              {selectedVersion.version_number} ? Cette action créera une
              nouvelle version avec le contenu de la version sélectionnée.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRestoreModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmRestore}
                disabled={restoring}
                className="bg-blue-600 hover:bg-blue-700"
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
            <p>
              Êtes-vous sûr de vouloir supprimer la version{" "}
              {selectedVersion.version_number} ? Cette action est irréversible.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
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
