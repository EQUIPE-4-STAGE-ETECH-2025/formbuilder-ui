import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, MoreHorizontal, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { Pagination } from "../../components/ui/Pagination";
import { adminService } from "../../services/api/dashboard/adminService";
import { IUserList } from "../../types";

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUserList[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    adminService.listUsers().then(setUsers).catch(console.error);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.firstName ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase()) ||
      (user.lastName ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase()) ||
      (user.email ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSuspendUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user
      )
    );
    setActiveDropdown(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string) =>
    status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

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
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4 group">
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour au tableau de bord
        </Button>
        <h1 className="text-2xl font-bold text-text-100">Gestion des utilisateurs</h1>
        <p className="text-surface-400">Gérez les utilisateurs et leurs permissions</p>
      </div>

      {/* Table des utilisateurs */}
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-100">Liste des utilisateurs</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-surface-700 rounded-xl bg-surface-900 text-text-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              <Dropdown
                value={statusFilter}
                options={[
                  { value: "all", label: "Tous les statuts" },
                  { value: "active", label: "Actif" },
                  { value: "suspended", label: "Suspendu" },
                ]}
                onChange={(value) => setStatusFilter(value as "all" | "active" | "suspended")}
                size="sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700">
                  <th>Utilisateur</th>
                  <th>Plan</th>
                  <th>Statut</th>
                  <th>Formulaires</th>
                  <th>Soumissions</th>
                  <th>Dernière connexion</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-surface-700 hover:bg-surface-800">
                    <td>
                      {user.firstName} {user.lastName} <br />
                      <span className="text-sm text-surface-400">{user.email}</span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(user.plan)}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.formsCount ?? 0}</td>
                    <td>{(user.submissionsCount ?? 0).toLocaleString()}</td>
                    <td>
                      {user.lastLoginAt
                        ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true, locale: fr })
                        : "Jamais"}
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                      >
                        <MoreHorizontal />
                      </Button>
                      {activeDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface-900 rounded-xl shadow-large border border-surface-800 z-10">
                          <div className="py-1">
                            <button onClick={() => handleSuspendUser(user.id)}>Suspendre / Réactiver</button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-400">
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
