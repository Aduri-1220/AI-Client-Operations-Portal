import api from '@/lib/api';
import type { Task } from '@/types';

export const tasksService = {
  getAll: (params?: { projectId?: string; status?: string; assigneeId?: string }) =>
    api.get<Task[]>('/tasks', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Task>(`/tasks/${id}`).then((r) => r.data),

  create: (data: Omit<Task, 'id' | 'project' | 'assignee' | 'comments' | 'createdAt' | 'updatedAt'>) =>
    api.post<Task>('/tasks', data).then((r) => r.data),

  update: (id: string, data: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, data).then((r) => r.data),

  updateStatus: (id: string, status: Task['status']) =>
    api.patch<Task>(`/tasks/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`).then((r) => r.data),
};
