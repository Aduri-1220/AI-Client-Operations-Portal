import api from '@/lib/api';
import type { Client } from '@/types';

export const clientsService = {
  getAll: (params?: { status?: string }) =>
    api.get<Client[]>('/clients', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Client>(`/clients/${id}`).then((r) => r.data),

  create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Client>('/clients', data).then((r) => r.data),

  update: (id: string, data: Partial<Client>) =>
    api.put<Client>(`/clients/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/clients/${id}`).then((r) => r.data),
};
