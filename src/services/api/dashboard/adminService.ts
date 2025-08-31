import apiClient from "../config/apiClient";
import { IAdminStats, IUserList } from "../../../types";

export const adminService = {
  getAdminStats: async (): Promise<IAdminStats> => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  listUsers: async (): Promise<IUserList[]> => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },
};
