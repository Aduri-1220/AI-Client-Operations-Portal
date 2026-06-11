import api from '@/lib/api';
import type { DashboardStats } from '@/types';

export const dashboardService = {
  getStats: () =>
    api.get<DashboardStats>('/dashboard/stats').then((r) => r.data),

  getTasksByStatus: () =>
    api.get<Record<string, number>>('/dashboard/tasks-by-status').then((r) => r.data),

  getProjectsByClient: () =>
    api.get<{ clientName: string; count: number }[]>('/dashboard/projects-by-client').then((r) => r.data),

  getMonthlyCompletedTasks: () =>
    api.get<{ month: string; count: number }[]>('/dashboard/monthly-completed').then((r) => r.data),
};
