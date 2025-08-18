import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Ban,
  MoreHorizontal,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Pagination } from "../../components/ui/Pagination";
import { useToast } from "../../hooks/useToast";

interface IAdminUser {
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

const mockUsers: IAdminUser[] = [
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

export function UserManagement() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [users, setUsers] = useState<IAdminUser[]>(mockUsers);
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
          user.id === userId
            ? {
                ...user,
                status: user.status === "active" ? "suspended" : "active",
              }
            : user
        )
      );
      const targetUser = users.find((u) => u.id === userId);
      const action = targetUser?.status === "active" ? "suspendu" : "réactivé";
      addToast({
        type: "success",
        title: `Utilisateur ${action}`,
        message: `L'utilisateur a été ${action} avec succès`,
      });
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Impossible de modifier le statut de l'utilisateur",
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin")}
          className="mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour au tableau de bord
        </Button>
        <h1 className="text-2xl font-bold text-text-100">
          Gestion des utilisateurs
        </h1>
        <p className="text-surface-400">
          Gérez les utilisateurs et leurs permissions
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Total utilisateurs</p>
                <p className="text-xl font-bold text-text-100">
                  {users.length}
                </p>
              </div>
              <Users className="h-6 w-6 text-accent-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Actifs</p>
                <p className="text-xl font-bold text-text-100">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Suspendus</p>
                <p className="text-xl font-bold text-text-100">
                  {users.filter((u) => u.status === "suspended").length}
                </p>
              </div>
              <Ban className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Premium/Pro</p>
                <p className="text-xl font-bold text-text-100">
                  {
                    users.filter(
                      (u) => u.plan === "premium" || u.plan === "pro"
                    ).length
                  }
                </p>
              </div>
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-100">
              Liste des utilisateurs
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
                    Soumissions
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
                      {user.formsCount}
                    </td>
                    <td className="py-3 px-4 text-sm text-surface-400">
                      {user.submissionsCount.toLocaleString()}
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
    </div>
  );
}
