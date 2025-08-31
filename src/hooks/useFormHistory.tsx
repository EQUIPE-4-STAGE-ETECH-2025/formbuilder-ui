import { useState } from "react";
import { versionsService } from "../services/api";
import { IFormVersion } from "../types";
import { adaptVersionFromAPIForHooks } from "../utils/formAdapter";

interface IUseFormHistoryReturn {
  versions: IFormVersion[];
  loading: boolean;
  error: string | null;
  getVersions: (formId: string) => Promise<void>;
  getVersion: (formId: string, version: number) => Promise<IFormVersion | null>;
  restoreVersion: (formId: string, version: number) => Promise<boolean>;
  deleteVersion: (formId: string, version: number) => Promise<boolean>;
}

export const useFormHistory = (): IUseFormHistoryReturn => {
  // Hooks
  const [versions, setVersions] = useState<IFormVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonctions utilitaires
  const getVersions = async (formId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await versionsService.getByFormId(formId);

      if (response.success && response.data) {
        const adaptedVersions = response.data
          .map((version) => {
            const adapted = adaptVersionFromAPIForHooks(version);
            adapted.form_id = formId;
            return adapted;
          })
          .sort(
            (a: IFormVersion, b: IFormVersion) =>
              b.version_number - a.version_number
          );
        setVersions(adaptedVersions);
      } else {
        setError(
          response.message || "Erreur lors du chargement de l'historique"
        );
      }
    } catch {
      setError("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  const getVersion = async (
    formId: string,
    version: number
  ): Promise<IFormVersion | null> => {
    try {
      setLoading(true);
      setError(null);
      const versions = await versionsService.getByFormId(formId);

      if (versions.success && versions.data) {
        const targetVersionAPI = versions.data.find(
          (v) => v.versionNumber === version
        );
        if (targetVersionAPI) {
          const adapted = adaptVersionFromAPIForHooks(targetVersionAPI);
          adapted.form_id = formId;
          return adapted;
        }
        return null;
      } else {
        setError(
          versions.message || "Erreur lors de la récupération de la version"
        );
        return null;
      }
    } catch {
      setError("Erreur lors de la récupération de la version");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const restoreVersion = async (
    formId: string,
    version: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await versionsService.restore(formId, version);

      if (response.success) {
        // Recharger les versions après restauration
        await getVersions(formId);
        return true;
      } else {
        setError(response.message || "Erreur lors de la restauration");
        return false;
      }
    } catch {
      setError("Erreur lors de la restauration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVersion = async (
    formId: string,
    version: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await versionsService.delete(formId, version);

      if (response.success) {
        // Recharger les versions après suppression
        await getVersions(formId);
        return true;
      } else {
        setError(response.message || "Erreur lors de la suppression");
        return false;
      }
    } catch {
      setError("Erreur lors de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    versions,
    loading,
    error,
    getVersions,
    getVersion,
    restoreVersion,
    deleteVersion,
  };
};
