import { FileText, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { adminService } from "../../services/api/dashboard/adminService";
import { IAdminStats } from "../../types";


// 👇 Définition des interfaces des tableaux de stats
interface IUserGrowth {
  name: string;
  utilisateurs: number;
  nouveaux: number;
}

interface IRevenue {
  name: string;
  revenus: number;
}

interface IPlanDistribution {
  name: string;
  utilisateurs: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<IAdminStats | null>(null);

  const [userGrowthData, setUserGrowthData] = useState<IUserGrowth[]>([]);
  const [revenueData, setRevenueData] = useState<IRevenue[]>([]);
  const [planDistributionData, setPlanDistributionData] = useState<IPlanDistribution[]>([]);

  useEffect(() => {
    adminService.getAdminStats()
      .then((data) => {
        setStats(data);
        setUserGrowthData(data.userGrowth);
        setRevenueData(data.revenue);
        setPlanDistributionData(data.planDistribution);
      })
      .catch(console.error);
  }, []);

  if (!stats) return <p>Chargement...</p>;

  return (
    <div className="space-modern">
      <div>
        <h1 className="text-2xl font-bold text-text-100">Administration</h1>
        <p className="text-surface-400">
          Gestion des utilisateurs et statistiques de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Utilisateurs totaux</p>
                <p className="text-2xl font-bold text-text-100">{stats.totalUsers}</p>
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
                <p className="text-2xl font-bold text-text-100">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Formulaires totaux</p>
                <p className="text-2xl font-bold text-text-100">{stats.totalForms}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Soumissions totales</p>
                <p className="text-2xl font-bold text-text-100">{stats.totalSubmissions.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Revenus ce mois</p>
                <p className="text-2xl font-bold text-text-100">{stats.revenueThisMonth.toLocaleString()}€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader><h3 className="text-lg font-semibold text-text-100">Croissance des utilisateurs</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" strokeOpacity={0.3}/>
                  <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} fontWeight={500} tickLine={false} axisLine={{ stroke: "#525252", strokeWidth: 1 }}/>
                  <YAxis stroke="#a3a3a3" fontSize={12} fontWeight={500} tickLine={false} axisLine={{ stroke: "#525252", strokeWidth: 1 }} tickFormatter={(v) => v.toLocaleString()}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="utilisateurs" stroke="#8b5cf6" strokeWidth={3}/>
                  <Line type="monotone" dataKey="nouveaux" stroke="#10b981" strokeWidth={3}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="text-lg font-semibold text-text-100">Évolution des revenus</h3></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3}/>
                  <XAxis dataKey="name" stroke="#94a3b8"/>
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v.toLocaleString()}€`}/>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()}€`, "Revenus"]}/>
                  <Area type="monotone" dataKey="revenus" stroke="#10b981" fill="#10b981" fillOpacity={0.4}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><h3 className="text-lg font-semibold text-text-100">Répartition des plans</h3></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" strokeOpacity={0.3}/>
                <XAxis dataKey="name" stroke="#a3a3a3"/>
                <YAxis stroke="#a3a3a3" tickFormatter={(v) => v.toLocaleString()}/>
                <Tooltip />
                <Bar dataKey="utilisateurs" fill="#8b5cf6" radius={[6, 6, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
