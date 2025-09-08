import { IAdminStats, IUserList } from "../../../types";
import apiClient from "../config/apiClient";

// Interfaces pour les données de l'API backend
interface IBackendUserGrowthItem {
  month: string;
  count: number;
}

interface IBackendPlanDistributionItem {
  plan: string;
  count: number;
}

class AdminService {
  private readonly basePath = "/api/admin";

  /**
   * Récupère les statistiques globales de l'admin
   */
  async getAdminStats(): Promise<IAdminStats> {
    try {
      const response = await apiClient.get(`${this.basePath}/stats`);
      const data = response.data;

      // Mapping back → front
      return {
        totalUsers: data.totalUsers,
        activeUsers: 0, // à calculer plus tard quand dispo
        totalForms: data.totalForms,
        totalSubmissions: data.totalSubmissions,
        revenueThisMonth: 0, // pas encore dispo côté back

        userGrowth: data.totalUsersPerMonth.map(
          (item: IBackendUserGrowthItem, i: number) => ({
            name: item.month,
            utilisateurs: item.count,
            nouveaux: data.usersPerMonth[i]?.count ?? 0,
          })
        ),

        revenue: [], // placeholder pour plus tard

        planDistribution: data.usersByPlan.map(
          (item: IBackendPlanDistributionItem) => ({
            name: item.plan,
            utilisateurs: item.count,
          })
        ),
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des statistiques admin:",
        error
      );
      throw error;
    }
  }

  /**
   * Récupère la liste des utilisateurs
   */
  async listUsers(): Promise<IUserList[]> {
    try {
      const response = await apiClient.get<IUserList[]>(
        `${this.basePath}/users`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste des utilisateurs:",
        error
      );
      return [];
    }
  }
}

// Export singleton
export const adminService = new AdminService();
