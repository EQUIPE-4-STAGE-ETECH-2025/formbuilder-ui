import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertTriangle,
  Ban,
  FileText,
  MoreHorizontal,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../hooks/useToast";

// Mock data for admin charts
const userGrowthData = [
  { name: "Jan", utilisateurs: 850, nouveaux: 45 },
  { name: "Fév", utilisateurs: 920, nouveaux: 70 },
  { name: "Mar", utilisateurs: 1050, nouveaux: 130 },
  { name: "Avr", utilisateurs: 1180, nouveaux: 130 },
  { name: "Mai", utilisateurs: 1247, nouveaux: 67 },
  { name: "Jun", utilisateurs: 1320, nouveaux: 73 },
  { name: "Jul", utilisateurs: 1420, nouveaux: 100 },
];

const revenueData = [
  { name: "Jan", revenus: 8500 },
  { name: "Fév", revenus: 9200 },
  { name: "Mar", revenus: 11800 },
  { name: "Avr", revenus: 13200 },
  { name: "Mai", revenus: 12450 },
  { name: "Jun", revenus: 14600 },
  { name: "Jul", revenus: 15800 },
];

const planDistributionData = [
  { name: "Gratuit", utilisateurs: 890 },
  { name: "Premium", utilisateurs: 280 },
  { name: "Pro", utilisateurs: 77 },
];

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "suspended";
  plan: string;
  formsCount: number;
  submissionsCount: number;
  createdAt: string;
  lastLoginAt: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalForms: number;
  totalSubmissions: number;
  revenueThisMonth: number;
}

interface AuditLog {
  id: string;
  action: string;
  adminEmail: string;
  targetUser: string;
  reason: string;
  timestamp: string;
}

const mockUsers: AdminUser[] = [
  {
    id: "user-1",
    firstName: "Anna",
    lastName: "Martin",
    email: "anna@example.com",
    status: "active",
    plan: "premium",
    formsCount: 8,
    submissionsCount: 2340,
    createdAt: "2024-01-15T10:00:00Z",
    lastLoginAt: "2024-07-14T15:30:00Z",
  },
  {
    id: "user-2",
    firstName: "Lucas",
    lastName: "Dubois",
    email: "lucas@example.com",
    status: "active",
    plan: "free",
    formsCount: 2,
    submissionsCount: 45,
    createdAt: "2024-03-20T14:00:00Z",
    lastLoginAt: "2024-07-13T09:15:00Z",
  },
  {
    id: "user-3",
    firstName: "Élodie",
    lastName: "Rousseau",
    email: "elodie@example.com",
    status: "suspended",
    plan: "pro",
    formsCount: 25,
    submissionsCount: 8900,
    createdAt: "2024-02-10T09:00:00Z",
    lastLoginAt: "2024-07-10T11:45:00Z",
  },
  {
    id: "user-4",
    firstName: "Thomas",
    lastName: "Leroy",
    email: "thomas@example.com",
    status: "active",
    plan: "free",
    formsCount: 1,
    submissionsCount: 12,
    createdAt: "2024-06-05T16:30:00Z",
    lastLoginAt: "2024-07-14T08:20:00Z",
  },
  {
    id: "user-5",
    firstName: "Marie",
    lastName: "Garcia",
    email: "marie@example.com",
    status: "active",
    plan: "premium",
    formsCount: 15,
    submissionsCount: 5670,
    createdAt: "2024-01-25T12:15:00Z",
    lastLoginAt: "2024-07-14T14:10:00Z",
  },
];

const mockStats: AdminStats = {
  totalUsers: 1247,
  activeUsers: 1189,
  totalForms: 3420,
  totalSubmissions: 156789,
  revenueThisMonth: 15800,
};

const mockAuditLog: AuditLog[] = [
  {
    id: "log-1",
    action: "SUSPEND_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "elodie@example.com",
    reason: "Violation des conditions d'utilisation",
    timestamp: "2024-07-14T10:30:00Z",
  },
  {
    id: "log-2",
    action: "DELETE_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "spam@example.com",
    reason: "Compte spam",
    timestamp: "2024-07-13T15:45:00Z",
  },
  {
    id: "log-3",
    action: "RESTORE_USER",
    adminEmail: "admin@formbuilder.com",
    targetUser: "user@example.com",
    reason: "Erreur de suspension",
    timestamp: "2024-07-12T09:15:00Z",
  },
];

export function AdminDashboard() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [stats] = useState<AdminStats>(mockStats);
  const [auditLog] = useState<AuditLog[]>(mockAuditLog);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSuspendUser = async (userId: string) => {
    try {
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "suspended" as const } : user
        )
      );
      addToast({
        type: "success",
        title: "Utilisateur suspendu",
        message: "L'utilisateur a été suspendu avec succès",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de suspendre l'utilisateur",
      });
    }
    setActiveDropdown(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        setUsers(users.filter((user) => user.id !== userId));
        addToast({
          type: "success",
          title: "Utilisateur supprimé",
          message: "L'utilisateur a été supprimé avec succès",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erreur",
          message: "Impossible de supprimer l'utilisateur",
        });
      }
    }
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: "bg-gray-100 text-gray-800",
      premium: "bg-blue-100 text-blue-800",
      pro: "bg-purple-100 text-purple-800",
    };
    return badges[plan as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-modern">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-100">Administration</h1>
        <p className="text-surface-400">
          Gestion des utilisateurs et statistiques de la plateforme
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Utilisateurs totaux</p>
                <p className="text-2xl font-bold text-text-100">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-accent-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-text-100">
                  {stats.activeUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Formulaires totaux</p>
                <p className="text-2xl font-bold text-text-100">
                  {stats.totalForms}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Soumissions totales</p>
                <p className="text-2xl font-bold text-text-100">
                  {stats.totalSubmissions.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Revenus ce mois</p>
                <p className="text-2xl font-bold text-text-100">
                  {stats.revenueThisMonth.toLocaleString()}€
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-100">
              Croissance des utilisateurs
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#404040"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#a3a3a3"
                    fontSize={12}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={{ stroke: "#525252", strokeWidth: 1 }}
                  />
                  <YAxis
                    stroke="#a3a3a3"
                    fontSize={12}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={{ stroke: "#525252", strokeWidth: 1 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#262626",
                      border: "1px solid #404040",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "500",
                      padding: "12px 16px",
                    }}
                    labelStyle={{
                      color: "#d4d4d4",
                      fontSize: "12px",
                      fontWeight: "400",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="utilisateurs"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    strokeOpacity={0.9}
                    dot={{
                      fill: "#8b5cf6",
                      strokeWidth: 3,
                      r: 5,
                      stroke: "#8b5cf6",
                      strokeOpacity: 0.3,
                    }}
                    activeDot={{
                      r: 7,
                      stroke: "#8b5cf6",
                      strokeWidth: 3,
                      fill: "#ffffff",
                    }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="nouveaux"
                    stroke="#10b981"
                    strokeWidth={3}
                    strokeOpacity={0.9}
                    dot={{
                      fill: "#10b981",
                      strokeWidth: 3,
                      r: 5,
                      stroke: "#10b981",
                      strokeOpacity: 0.3,
                    }}
                    activeDot={{
                      r: 7,
                      stroke: "#10b981",
                      strokeWidth: 3,
                      fill: "#ffffff",
                    }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-100">
              Évolution des revenus
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    strokeOpacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={{ stroke: "#475569", strokeWidth: 1 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={{ stroke: "#475569", strokeWidth: 1 }}
                    tickFormatter={(value) => `${value.toLocaleString()}€`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
                      color: "#f8fafc",
                      fontSize: "13px",
                      fontWeight: "500",
                      padding: "12px 16px",
                    }}
                    labelStyle={{
                      color: "#cbd5e1",
                      fontSize: "12px",
                      fontWeight: "400",
                    }}
                    formatter={(value) => [
                      `${value.toLocaleString()}€`,
                      "Revenus",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenus"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.4}
                    strokeWidth={3}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-100">
            Répartition des plans
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistributionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#404040"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="#a3a3a3"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={{ stroke: "#525252", strokeWidth: 1 }}
                />
                <YAxis
                  stroke="#a3a3a3"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={{ stroke: "#525252", strokeWidth: 1 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#262626",
                    border: "1px solid #404040",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: "500",
                    padding: "12px 16px",
                  }}
                  labelStyle={{
                    color: "#d4d4d4",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                />
                <Bar
                  dataKey="utilisateurs"
                  fill="#8b5cf6"
                  fillOpacity={0.9}
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-100">
              Gestion des utilisateurs
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-surface-700 rounded-xl bg-surface-900 text-text-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                />
              </div>
              <Dropdown
                value={statusFilter}
                options={[
                  { value: "all", label: "Tous les statuts" },
                  { value: "active", label: "Actif" },
                  { value: "suspended", label: "Suspendu" },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as "all" | "active" | "suspended")
                }
                size="sm"
                className="min-w-[140px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700">
                  <th className="text-left py-3 px-4 font-medium text-surface-300">
                    Utilisateur
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-300">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-300">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-300">
                    Formulaires
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-300">
                    Dernière connexion
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-surface-700 hover:bg-surface-800 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-text-100">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-surface-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadge(
                          user.plan
                        )}`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status === "active" ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-surface-400">
                      {user.formsCount} formulaires
                    </td>
                    <td className="py-3 px-4 text-sm text-surface-400">
                      {formatDistanceToNow(new Date(user.lastLoginAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === user.id ? null : user.id
                            )
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {activeDropdown === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-surface-900 rounded-xl shadow-large border border-surface-800 z-10">
                            <div className="py-1">
                              {user.status === "active" ? (
                                <button
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-surface-300 hover:bg-surface-800 transition-colors duration-200"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspendre
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-surface-300 hover:bg-surface-800 transition-colors duration-200"
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Réactiver
                                </button>
                              )}
                              <hr className="my-1 border-surface-700" />
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-100">
            Journal d'audit
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-surface-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-text-100">{log.action}</p>
                    <p className="text-sm text-surface-400">
                      {log.adminEmail} → {log.targetUser}
                    </p>
                    <p className="text-xs text-surface-500">{log.reason}</p>
                  </div>
                </div>
                <span className="text-sm text-surface-400">
                  {formatDistanceToNow(new Date(log.timestamp), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
