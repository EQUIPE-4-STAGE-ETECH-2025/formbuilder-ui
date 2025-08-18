import { FileText, TrendingUp, Users } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

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

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalForms: number;
  totalSubmissions: number;
  revenueThisMonth: number;
}

const mockStats: AdminStats = {
  totalUsers: 1247,
  activeUsers: 1189,
  totalForms: 3420,
  totalSubmissions: 156789,
  revenueThisMonth: 15800,
};

export function AdminDashboard() {
  const [stats] = useState<AdminStats>(mockStats);

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
              <Users className="h-8 w-8 text-yellow-500" />
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
              <FileText className="h-8 w-8 text-yellow-500" />
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
              <TrendingUp className="h-8 w-8 text-yellow-500" />
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
              <TrendingUp className="h-8 w-8 text-yellow-500" />
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
    </div>
  );
}
