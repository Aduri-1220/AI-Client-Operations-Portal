import api from '@/lib/api';
import type { Task, Comment, ApiResponse } from '@/types';

export const tasksService = {
  getAll: (params?: { projectId?: string; status?: string; assigneeId?: string }) =>
    api.get<ApiResponse<Task[]>>('/tasks', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<Task>>(`/tasks/${id}`).then((r) => r.data),

  create: (data: Omit<Task, 'id' | 'project' | 'assignee' | 'comments' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Task>>('/tasks', data).then((r) => r.data),

  update: (id: string, data: Partial<Task>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, data).then((r) => r.data),

  updateStatus: (id: string, status: Task['status']) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`).then((r) => r.data),

  addComment: (taskId: string, content: string) =>
    api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content }).then((r) => r.data),
};
