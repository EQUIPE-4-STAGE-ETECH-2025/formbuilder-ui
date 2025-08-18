import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Filter,
  Info,
  Shield,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Pagination } from "../../components/ui/Pagination";

interface IAuditLogEntry {
  id: string;
  action:
    | "CREATE_USER"
    | "DELETE_USER"
    | "SUSPEND_USER"
    | "RESTORE_USER"
    | "UPDATE_USER"
    | "CHANGE_PLAN"
    | "DELETE_FORM"
    | "SYSTEM_CONFIG";
  adminEmail: string;
  targetUser?: string;
  targetResource?: string;
  reason: string;
  details?: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
}

const mockAuditLog: IAuditLogEntry[] = [
  {
    id: "log-1",
    action: "SUSPEND_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "elodie@example.com",
    reason: "Violation des conditions d'utilisation",
    details: "Utilisation abusive de l'API détectée",
    timestamp: "2024-07-14T10:30:00Z",
    severity: "warning",
  },
  {
    id: "log-2",
    action: "DELETE_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "spam@example.com",
    reason: "Compte spam",
    timestamp: "2024-07-13T15:45:00Z",
    severity: "critical",
  },
  {
    id: "log-3",
    action: "RESTORE_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "user@example.com",
    reason: "Erreur de suspension",
    timestamp: "2024-07-12T09:15:00Z",
    severity: "info",
  },
  {
    id: "log-4",
    action: "CHANGE_PLAN",
    adminEmail: "admin@formbuilder.com",
    targetUser: "marie@example.com",
    reason: "Upgrade manuel vers Premium",
    details: "Demande du service commercial",
    timestamp: "2024-07-11T14:20:00Z",
    severity: "info",
  },
  {
    id: "log-5",
    action: "DELETE_FORM",
    adminEmail: "admin@formbuilder.com",
    targetResource: "form-12345",
    targetUser: "lucas@example.com",
    reason: "Contenu inapproprié",
    timestamp: "2024-07-10T11:30:00Z",
    severity: "warning",
  },
  {
    id: "log-6",
    action: "SYSTEM_CONFIG",
    adminEmail: "superadmin@formbuilder.com",
    reason: "Modification des limites de taux",
    details: "Limite API augmentée de 1000 à 2000 req/h",
    timestamp: "2024-07-09T16:45:00Z",
    severity: "info",
  },
  {
    id: "log-7",
    action: "CREATE_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "newuser@example.com",
    reason: "Création manuelle d'un compte entreprise",
    timestamp: "2024-07-08T10:00:00Z",
    severity: "info",
  },
  {
    id: "log-8",
    action: "UPDATE_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "anna@example.com",
    reason: "Réinitialisation du mot de passe",
    details: "Demande de l'utilisateur via support",
    timestamp: "2024-07-07T13:25:00Z",
    severity: "info",
  },
];

export function AuditLog() {
  const navigate = useNavigate();
  const [auditLog] = useState<IAuditLogEntry[]>(mockAuditLog);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE_USER":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "DELETE_USER":
        return <UserX className="h-5 w-5 text-red-500" />;
      case "SUSPEND_USER":
        return <UserMinus className="h-5 w-5 text-orange-500" />;
      case "RESTORE_USER":
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      case "UPDATE_USER":
        return <Shield className="h-5 w-5 text-purple-500" />;
      case "CHANGE_PLAN":
        return <Info className="h-5 w-5 text-cyan-500" />;
      case "DELETE_FORM":
        return <Trash2 className="h-5 w-5 text-red-500" />;
      case "SYSTEM_CONFIG":
        return <Shield className="h-5 w-5 text-indigo-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_USER: "Création utilisateur",
      DELETE_USER: "Suppression utilisateur",
      SUSPEND_USER: "Suspension utilisateur",
      RESTORE_USER: "Restauration utilisateur",
      UPDATE_USER: "Modification utilisateur",
      CHANGE_PLAN: "Changement de plan",
      DELETE_FORM: "Suppression formulaire",
      SYSTEM_CONFIG: "Configuration système",
    };
    return labels[action] || action;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Critique";
      case "warning":
        return "Avertissement";
      default:
        return "Information";
    }
  };

  const filterByDate = (log: IAuditLogEntry) => {
    if (dateFilter === "all") return true;
    const logDate = new Date(log.timestamp);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (dateFilter) {
      case "today":
        return daysDiff === 0;
      case "week":
        return daysDiff <= 7;
      case "month":
        return daysDiff <= 30;
      default:
        return true;
    }
  };

  const filteredLogs = auditLog.filter((log) => {
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    const matchesDate = filterByDate(log);
    return matchesAction && matchesSeverity && matchesDate;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Statistiques
  const stats = {
    total: auditLog.length,
    critical: auditLog.filter((l) => l.severity === "critical").length,
    warning: auditLog.filter((l) => l.severity === "warning").length,
    info: auditLog.filter((l) => l.severity === "info").length,
  };

  return (
    <div className="space-modern">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour au tableau de bord
        </Button>
        <h1 className="text-2xl font-bold text-text-100">Journal d'audit</h1>
        <p className="text-surface-400">
          Historique des actions administratives et modifications système
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Total actions</p>
                <p className="text-xl font-bold text-text-100">{stats.total}</p>
              </div>
              <Calendar className="h-6 w-6 text-accent-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Critiques</p>
                <p className="text-xl font-bold text-text-100">
                  {stats.critical}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Avertissements</p>
                <p className="text-xl font-bold text-text-100">
                  {stats.warning}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Informations</p>
                <p className="text-xl font-bold text-text-100">{stats.info}</p>
              </div>
              <Info className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et journal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-text-100">
              Historique des actions
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-surface-400" />
                <span className="text-sm text-surface-400">Filtres:</span>
              </div>
              <Dropdown
                value={actionFilter}
                options={[
                  { value: "all", label: "Toutes les actions" },
                  { value: "CREATE_USER", label: "Créations" },
                  { value: "DELETE_USER", label: "Suppressions" },
                  { value: "SUSPEND_USER", label: "Suspensions" },
                  { value: "RESTORE_USER", label: "Restaurations" },
                  { value: "UPDATE_USER", label: "Modifications" },
                  { value: "CHANGE_PLAN", label: "Changements de plan" },
                  {
                    value: "DELETE_FORM",
                    label: "Suppressions de formulaires",
                  },
                  { value: "SYSTEM_CONFIG", label: "Config système" },
                ]}
                onChange={setActionFilter}
                size="sm"
                className="min-w-[180px]"
              />
              <Dropdown
                value={severityFilter}
                options={[
                  { value: "all", label: "Toutes les sévérités" },
                  { value: "critical", label: "Critique" },
                  { value: "warning", label: "Avertissement" },
                  { value: "info", label: "Information" },
                ]}
                onChange={setSeverityFilter}
                size="sm"
                className="min-w-[150px]"
              />
              <Dropdown
                value={dateFilter}
                options={[
                  { value: "all", label: "Toutes les dates" },
                  { value: "today", label: "Aujourd'hui" },
                  { value: "week", label: "7 derniers jours" },
                  { value: "month", label: "30 derniers jours" },
                ]}
                onChange={setDateFilter}
                size="sm"
                className="min-w-[150px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 bg-surface-800 rounded-xl hover:bg-surface-700 transition-colors duration-200"
              >
                <div className="mt-1">{getActionIcon(log.action)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-medium text-text-100">
                          {getActionLabel(log.action)}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge(
                            log.severity
                          )}`}
                        >
                          {getSeverityLabel(log.severity)}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-surface-400">
                          <span className="font-medium">Admin:</span>{" "}
                          {log.adminEmail}
                        </p>
                        {log.targetUser && (
                          <p className="text-sm text-surface-400">
                            <span className="font-medium">Utilisateur:</span>{" "}
                            {log.targetUser}
                          </p>
                        )}
                        {log.targetResource && (
                          <p className="text-sm text-surface-400">
                            <span className="font-medium">Ressource:</span>{" "}
                            {log.targetResource}
                          </p>
                        )}
                        <p className="text-sm text-surface-300">
                          <span className="font-medium">Raison:</span>{" "}
                          {log.reason}
                        </p>
                        {log.details && (
                          <p className="text-sm text-surface-500">
                            <span className="font-medium">Détails:</span>{" "}
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-surface-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-surface-400">
                Aucune entrée trouvée avec les filtres sélectionnés
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
