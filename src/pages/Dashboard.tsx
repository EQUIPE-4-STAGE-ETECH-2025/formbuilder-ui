import { FileText, PlusCircle, Send, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { dashboardAPI } from "../services/api.mock";
import { IDashboardStats } from "../types";

// Mock data for charts
const submissionsData = [
  { name: "Jan", Soumissions: 120 },
  { name: "Fév", Soumissions: 190 },
  { name: "Mar", Soumissions: 300 },
  { name: "Avr", Soumissions: 250 },
  { name: "Mai", Soumissions: 400 },
  { name: "Jun", Soumissions: 350 },
  { name: "Jul", Soumissions: 450 },
];

const formsStatusData = [
  { name: "Publiés", value: 8, color: "#3b82f6" }, // Bleu-500 (base - Total Formulaires)
  { name: "Brouillons", value: 3, color: "#93c5fd" }, // Bleu-300 (plus subtil et doux)
  { name: "Désactivés", value: 1, color: "#0369a1" }, // Bleu-700 (plus foncé et distinct)
];

const topFormsData = [
  { name: "Contact Lead", Soumissions: 245 },
  { name: "Newsletter", Soumissions: 189 },
  { name: "Satisfaction", Soumissions: 156 },
  { name: "Support", Soumissions: 89 },
];

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Données mockées pour les formulaires récents
  const mockRecentForms = [
    {
      id: "form-1",
      title: "Contact Lead Generation",
      submissionCount: 245,
      status: "published" as const,
    },
    {
      id: "form-2",
      title: "Inscription Newsletter",
      submissionCount: 189,
      status: "published" as const,
    },
    {
      id: "form-3",
      title: "Satisfaction Client",
      submissionCount: 156,
      status: "published" as const,
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getQuotaPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getQuotaColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-accent-500";
  };

  if (loading) {
    return (
      <div className="space-modern">
        <div className="space-modern">
          <div className="h-32 loading-blur rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 loading-blur rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-modern">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-100">Tableau de bord</h1>
          <p className="text-surface-400 mt-2">
            Aperçu de vos formulaires et performances
          </p>
        </div>
        <Link to="/forms/new">
          <Button variant="accent">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau formulaire
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Total Formulaires</p>
                <p className="text-3xl font-bold text-text-100">
                  {stats?.total_forms || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-900/20 rounded-2xl flex items-center justify-center">
                <FileText className="h-7 w-7 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Formulaires Publiés</p>
                <p className="text-3xl font-bold text-text-100">
                  {stats?.published_forms || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-900/20 rounded-2xl flex items-center justify-center">
                <Send className="h-7 w-7 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Total Soumissions</p>
                <p className="text-3xl font-bold text-text-100">
                  {stats?.total_submissions || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-900/20 rounded-2xl flex items-center justify-center">
                <Users className="h-7 w-7 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Ce Mois</p>
                <p className="text-3xl font-bold text-text-100">
                  {stats?.submissions_this_month || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-900/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quota Usage */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-text-100">
              Utilisation des Quotas
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-surface-400 mb-2">
                <span>Formulaires</span>
                <span>
                  {user?.subscription?.currentForms || 0}/
                  {user?.subscription?.maxForms || 0}
                </span>
              </div>
              <div className="w-full bg-surface-800/50 backdrop-blur-sm border border-surface-700/50 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getQuotaColor(
                    getQuotaPercentage(
                      user?.subscription?.currentForms || 0,
                      user?.subscription?.maxForms || 1
                    )
                  )}`}
                  style={{
                    width: `${getQuotaPercentage(
                      user?.subscription?.currentForms || 0,
                      user?.subscription?.maxForms || 1
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-surface-400 mb-2">
                <span>Soumissions ce mois</span>
                <span>
                  {user?.subscription?.currentSubmissions || 0}/
                  {user?.subscription?.maxSubmissionsPerMonth || 0}
                </span>
              </div>
              <div className="w-full bg-surface-800/50 backdrop-blur-sm border border-surface-700/50 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getQuotaColor(
                    getQuotaPercentage(
                      user?.subscription?.currentSubmissions || 0,
                      user?.subscription?.maxSubmissionsPerMonth || 1
                    )
                  )}`}
                  style={{
                    width: `${getQuotaPercentage(
                      user?.subscription?.currentSubmissions || 0,
                      user?.subscription?.maxSubmissionsPerMonth || 1
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/subscription">
                <Button variant="secondary" size="md" className="w-full">
                  Gérer mon abonnement
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Formulaires Récents */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-text-100">
              Formulaires Récents
            </h3>
          </CardHeader>
          <CardContent>
            {mockRecentForms.length > 0 ? (
              <div className="space-y-4">
                {mockRecentForms.slice(0, 2).map((form) => (
                  <Link
                    key={form.id}
                    to={`/forms/${form.id}/edit`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-transparent border border-blue-500/30 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-900/20 rounded-xl flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-surface-400">
                            {form.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">
                          {form.submissionCount}
                        </p>
                        <p className="text-xs text-surface-500">soumissions</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-surface-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-surface-600" />
                <p>Aucun formulaire récent</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions Over Time */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-text-100">
              Évolution des Soumissions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={submissionsData}
                  margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
                >
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
                      backgroundColor: "rgba(38, 38, 38, 0.8)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(64, 64, 64, 0.5)",
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
                  <Area
                    type="monotone"
                    dataKey="Soumissions"
                    stroke="#f97316"
                    strokeWidth={3}
                    fill="#f97316"
                    fillOpacity={0.3}
                    dot={{
                      fill: "#f97316",
                      strokeWidth: 2,
                      r: 5,
                      stroke: "#f97316",
                      strokeOpacity: 0.6,
                    }}
                    activeDot={{
                      r: 7,
                      stroke: "#f97316",
                      strokeWidth: 2,
                      fill: "#ffffff",
                    }}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Forms Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-text-100">
              Répartition des formulaires
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-3/4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formsStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      dataKey="value"
                      label={false}
                      labelLine={false}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {formsStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={0}
                          onMouseEnter={(e) => {
                            const target = e.target as SVGElement;
                            target.style.stroke = entry.color;
                            target.style.strokeWidth = "0";
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as SVGElement;
                            target.style.stroke = entry.color;
                            target.style.strokeWidth = "0";
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(38, 38, 38, 0.8)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(64, 64, 64, 0.5)",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "400",
                        padding: "12px 16px",
                      }}
                      labelStyle={{
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "400",
                      }}
                      itemStyle={{
                        color: "#ffffff",
                      }}
                      formatter={(value, name) => [
                        <span className="text-surface-400">
                          {name} : {value}
                        </span>,
                        null,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="ml-2 flex flex-col gap-3">
                {formsStatusData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-surface-800/50 backdrop-blur-sm border border-surface-700/50 rounded-lg hover:bg-surface-700/50 hover:backdrop-blur-sm transition-all duration-200"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs text-surface-400">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Forms */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-text-100">
            Formulaires les plus performants
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFormsData}>
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
                  cursor={false}
                  contentStyle={{
                    backgroundColor: "rgba(38, 38, 38, 0.8)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(64, 64, 64, 0.5)",
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
                  dataKey="Soumissions"
                  fill="#a855f7"
                  fillOpacity={0.9}
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  activeBar={{
                    fill: "#a855f7",
                    fillOpacity: 1,
                    stroke: "#9333ea",
                    strokeWidth: 0,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
