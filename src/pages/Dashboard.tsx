import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  FileText,
  PlusCircle,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import { dashboardAPI } from "../services/api";
import { IDashboardStats, ISubmission } from "../types";

// Mock data for charts
const submissionsData = [
  { name: "Jan", soumissions: 120 },
  { name: "Fév", soumissions: 190 },
  { name: "Mar", soumissions: 300 },
  { name: "Avr", soumissions: 250 },
  { name: "Mai", soumissions: 400 },
  { name: "Jun", soumissions: 350 },
  { name: "Jul", soumissions: 450 },
];

const formsStatusData = [
  { name: "Publiés", value: 8, color: "#10B981" },
  { name: "Brouillons", value: 3, color: "#F59E0B" },
  { name: "Désactivés", value: 1, color: "#EF4444" },
];

const topFormsData = [
  { name: "Contact Lead", soumissions: 245 },
  { name: "Newsletter", soumissions: 189 },
  { name: "Satisfaction", soumissions: 156 },
  { name: "Support", soumissions: 89 },
];

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">
            Aperçu de vos formulaires et performances
          </p>
        </div>
        <Link to="/forms/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau formulaire
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Formulaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_forms || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formulaires Publiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.published_forms || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Soumissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_submissions || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ce Mois</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.submissions_this_month || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Usage */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Utilisation des Quotas
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Formulaires</span>
                <span>
                  {user?.subscription?.currentForms || 0}/
                  {user?.subscription?.maxForms || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getQuotaColor(
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
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Soumissions ce mois</span>
                <span>
                  {user?.subscription?.currentSubmissions || 0}/
                  {user?.subscription?.maxSubmissionsPerMonth || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getQuotaColor(
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
            <div className="pt-2">
              <Link to="/subscription">
                <Button variant="outline" size="sm" className="w-full">
                  Gérer mon abonnement
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Soumissions Récentes
            </h3>
          </CardHeader>
          <CardContent>
            {stats?.recent_submissions?.length ? (
              <div className="space-y-3">
                {stats.recent_submissions
                  .slice(0, 3)
                  .map((submission: ISubmission, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {String(
                              submission.data?.["field-1"] || "Soumission"
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(
                              new Date(submission.submitted_at),
                              {
                                addSuffix: true,
                                locale: fr,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/forms/${submission.form_id}/submissions`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir
                      </Link>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune soumission récente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions Over Time */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Évolution des soumissions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="soumissions"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Forms Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Répartition des formulaires
            </h3>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formsStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {formsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Forms */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Formulaires les plus performants
          </h3>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFormsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="soumissions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
