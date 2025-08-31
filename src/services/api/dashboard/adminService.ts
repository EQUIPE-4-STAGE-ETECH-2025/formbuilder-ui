import apiClient from "../config/apiClient";
import { IAdminStats, IUserList } from "../../../types";

class AdminService {
  private readonly basePath = "/api/admin";

  /**
   * Récupère les statistiques globales de l'admin
   */
  async getAdminStats(): Promise<IAdminStats> {
    try {
      const response = await apiClient.get<IAdminStats>(`${this.basePath}/stats`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques admin:", error);
      return {
        success: false,
        message:
          (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Erreur lors de la récupération des statistiques",
      } as unknown as IAdminStats;
    }
  }

  /**
   * Récupère la liste des utilisateurs
   */
  async listUsers(): Promise<IUserList[]> {
    try {
      const response = await apiClient.get<IUserList[]>(`${this.basePath}/users`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des utilisateurs:", error);
      return [];
    }
  }
}

// Export singleton
export const adminService = new AdminService();
