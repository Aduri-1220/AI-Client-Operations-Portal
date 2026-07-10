import api from '@/lib/api';
import type { Approval } from '@/types';

export const approvalsService = {
  getAll: (params?: { status?: string }) =>
    api.get<Approval[]>('/approvals', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Approval>(`/approvals/${id}`).then((r) => r.data),

  create: (data: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Approval>('/approvals', data).then((r) => r.data),

  update: (id: string, data: Partial<Approval>) =>
    api.put<Approval>(`/approvals/${id}`, data).then((r) => r.data),

  updateStatus: (id: string, status: Approval['status'], notes?: string) =>
    api.patch<Approval>(`/approvals/${id}/status`, { status, notes }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/approvals/${id}`).then((r) => r.data),
};
