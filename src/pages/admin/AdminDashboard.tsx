import { useState } from 'react';
import { Users, FileText, TrendingUp, AlertTriangle, Search, MoreHorizontal, Ban, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { useToast } from '../../hooks/useToast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock data for admin charts
const userGrowthData = [
  { name: 'Jan', utilisateurs: 850, nouveaux: 45 },
  { name: 'Fév', utilisateurs: 920, nouveaux: 70 },
  { name: 'Mar', utilisateurs: 1050, nouveaux: 130 },
  { name: 'Avr', utilisateurs: 1180, nouveaux: 130 },
  { name: 'Mai', utilisateurs: 1247, nouveaux: 67 },
  { name: 'Jun', utilisateurs: 1320, nouveaux: 73 },
  { name: 'Jul', utilisateurs: 1420, nouveaux: 100 }
];

const revenueData = [
  { name: 'Jan', revenus: 8500 },
  { name: 'Fév', revenus: 9200 },
  { name: 'Mar', revenus: 11800 },
  { name: 'Avr', revenus: 13200 },
  { name: 'Mai', revenus: 12450 },
  { name: 'Jun', revenus: 14600 },
  { name: 'Jul', revenus: 15800 }
];

const planDistributionData = [
  { name: 'Gratuit', utilisateurs: 890 },
  { name: 'Premium', utilisateurs: 280 },
  { name: 'Pro', utilisateurs: 77 }
];
interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended';
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
    id: 'user-1',
    firstName: 'Anna',
    lastName: 'Martin',
    email: 'anna@example.com',
    status: 'active',
    plan: 'premium',
    formsCount: 8,
    submissionsCount: 2340,
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-07-14T15:30:00Z'
  },
  {
    id: 'user-2',
    firstName: 'Lucas',
    lastName: 'Dubois',
    email: 'lucas@example.com',
    status: 'active',
    plan: 'free',
    formsCount: 2,
    submissionsCount: 45,
    createdAt: '2024-03-20T14:00:00Z',
    lastLoginAt: '2024-07-13T09:15:00Z'
  },
  {
    id: 'user-3',
    firstName: 'Élodie',
    lastName: 'Rousseau',
    email: 'elodie@example.com',
    status: 'suspended',
    plan: 'pro',
    formsCount: 25,
    submissionsCount: 8900,
    createdAt: '2024-02-10T11:30:00Z',
    lastLoginAt: '2024-07-10T16:45:00Z'
  }
];

const mockStats: AdminStats = {
  totalUsers: 1247,
  activeUsers: 1198,
  totalForms: 3456,
  totalSubmissions: 89234,
  revenueThisMonth: 12450
};

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    action: 'user_suspended',
    adminEmail: 'admin@formbuilder.com',
    targetUser: 'elodie@example.com',
    reason: 'Violation des conditions d\'utilisation',
    timestamp: '2024-07-14T10:30:00Z'
  },
  {
    id: 'log-2',
    action: 'user_deleted',
    adminEmail: 'admin@formbuilder.com',
    targetUser: 'spam@example.com',
    reason: 'Compte spam détecté',
    timestamp: '2024-07-13T16:45:00Z'
  }
];

export function AdminDashboard() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [stats] = useState<AdminStats>(mockStats);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSuspendUser = async (userId: string) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
          : user
      ));
      
      const user = users.find(u => u.id === userId);
      const action = user?.status === 'active' ? 'suspendu' : 'réactivé';
      
      addToast({
        type: 'success',
        title: `Utilisateur ${action}`,
        message: `Le compte a été ${action} avec succès`
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de modifier le statut de l\'utilisateur'
      });
    }
    setActiveDropdown(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?')) {
      try {
        setUsers(users.filter(user => user.id !== userId));
        addToast({
          type: 'success',
          title: 'Utilisateur supprimé',
          message: 'Le compte a été supprimé définitivement'
        });
      } catch {
        addToast({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de supprimer l\'utilisateur'
        });
      }
    }
    setActiveDropdown(null);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800'
    };
    return badges[plan as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600">Gestion des utilisateurs et statistiques de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs totaux</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formulaires totaux</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalForms}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Soumissions totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.revenueThisMonth.toLocaleString()}€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Croissance des utilisateurs</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="utilisateurs" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nouveaux" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Evolution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Évolution des revenus</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}€`, 'Revenus']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenus" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Répartition des abonnements</h3>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistributionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="utilisateurs" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h3>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="suspended">Suspendus</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateur</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Formulaires</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadge(user.plan)}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                            {user.status === 'active' ? 'Actif' : 'Suspendu'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {user.formsCount} formulaires<br />
                          <span className="text-gray-500">{user.submissionsCount} soumissions</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            {activeDropdown === user.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleSuspendUser(user.id)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                                  </button>
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
              {totalItems > 0 && (
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

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Logs d'audit</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log.action === 'user_suspended' ? 'Utilisateur suspendu' : 'Utilisateur supprimé'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Cible: {log.targetUser}
                      </p>
                      <p className="text-xs text-gray-600">
                        Par: {log.adminEmail}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Raison: {log.reason}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}