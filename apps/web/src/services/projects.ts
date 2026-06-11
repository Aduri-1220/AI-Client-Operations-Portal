import api from '@/lib/api';
import type { Project, ApiResponse } from '@/types';

export const projectsService = {
  getAll: (params?: { clientId?: string; status?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<Project[]>>('/projects', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`).then((r) => r.data),

  create: (data: Omit<Project, 'id' | 'client' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Project>>('/projects', data).then((r) => r.data),

  update: (id: string, data: Partial<Project>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/projects/${id}`).then((r) => r.data),
};
