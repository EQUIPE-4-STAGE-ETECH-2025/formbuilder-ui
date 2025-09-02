import { FileText, Plus, Send, TrendingUp, Users } from "lucide-react";
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
import { dashboardService } from "../services/api/dashboard/dashboardService";
import { IDashboardStats } from "../services/api/dashboard/dashboardTypes";

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
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

  const submissionsThisMonth = (() => {
    if (!stats) return 0;
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return stats.submissionsPerMonth[key] || 0;
  })();

  const submissionsData = Object.entries(stats?.submissionsPerMonth || {}).map(
    ([month, count]) => ({
      name: month,
      Soumissions: count,
    })
  );
  
  const formsStatusData = Object.entries(stats?.formsStatusCount || {}).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );
  
  const topFormsData = Object.entries(stats?.submissionsPerForm || {}).map(
    ([formTitle, count]) => ({
      name: formTitle,
      Soumissions: count,
    })
  );

  const recentForms = stats?.recentForms || [];

  const getQuotaPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getQuotaColor = (percentage: number) => {
    if (percentage >= 90) return "bg-accent-500";
    if (percentage >= 75) return "bg-accent-500";
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
            <Plus className="h-4 w-4 mr-2" />
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
                  {stats?.totalForms || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-accent-900/20 rounded-2xl flex items-center justify-center">
                <FileText className="h-7 w-7 text-accent-400" />
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
                  {stats?.publishedForms || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-accent-900/20 rounded-2xl flex items-center justify-center">
                <Send className="h-7 w-7 text-accent-400" />
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
                  {stats?.totalSubmissions || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-accent-900/20 rounded-2xl flex items-center justify-center">
                <Users className="h-7 w-7 text-accent-400" />
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
                  {submissionsThisMonth}
                </p>
              </div>
              <div className="w-14 h-14 bg-accent-900/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-accent-400" />
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
              <div className="w-full bg-surface-800 border border-surface-700/50 rounded-full h-3">
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
              <div className="w-full bg-surface-800 border border-surface-700/50 rounded-full h-3">
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
            {recentForms.length > 0 ? (
              <div className="space-y-4">
                {recentForms.slice(0, 2).map((form) => (
                  <Link
                    key={form.id}
                    to={`/forms/${form.id}/edit`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-transparent border border-accent-500/30 rounded-xl hover:border-accent-500/50 hover:bg-accent-500/5 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent-900/20 rounded-xl flex items-center justify-center">
                          <FileText className="h-5 w-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-surface-400">
                            {form.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent-400">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-surface-500">{form.status}</p>
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
                    stroke="#eab308"
                    strokeWidth={2}
                    fill="#eab308"
                    fillOpacity={0.4}
                    dot={{
                      fill: "#eab308",
                      strokeWidth: 2,
                      r: 6,
                      stroke: "#eab308",
                      strokeOpacity: 0.8,
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "#eab308",
                      strokeWidth: 2.5,
                      fill: "transparent",
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
                      innerRadius={95}
                      dataKey="value"
                      label={false}
                      labelLine={false}
                      cornerRadius={12}
                      paddingAngle={2}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    >
                      {formsStatusData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#eab308"
                          fillOpacity={0.5}
                          stroke="#eab308"
                          strokeWidth={2.5}
                          strokeOpacity={1}
                          onMouseEnter={(e) => {
                            (e.target as SVGElement).style.strokeWidth = "3";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as SVGElement).style.strokeWidth = "2.5";
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
                        fontSize: "13px",
                        fontWeight: "500",
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
                        <span className="text-accent-500">
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
                {formsStatusData.map((entry, index) => {
                  const total = formsStatusData.reduce(
                    (sum, item) => sum + item.value,
                    0
                  );
                  const percentage = Math.round((entry.value / total) * 100);

                  return (
                    <div
                      key={index}
                      className="p-2 bg-surface-900 border border-surface-700/50 rounded-lg hover:bg-surface-700 transition-all duration-200"
                    >
                      <span className="text-xs text-surface-500">
                        <span className="text-accent-400">{percentage}%</span>{" "}
                        {entry.name}
                      </span>
                    </div>
                  );
                })}
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
                  fill="#eab308"
                  fillOpacity={0.5}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  stroke="#eab308"
                  strokeWidth={2.5}
                  strokeOpacity={1}
                  activeBar={{ strokeWidth: 3, stroke: "#eab308" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
