'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Plus, Search, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import type { Client } from '@/types';

const clientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  company: z.string().min(2, 'Company required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT']),
  notes: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

const mockClients: Client[] = [
  { id: '1', name: 'Acme Corporation', contactPerson: 'John Smith', email: 'john@acme.com', phone: '+1-555-0101', company: 'Acme Corp', status: 'ACTIVE', createdAt: '2026-01-15', updatedAt: '2026-06-01' },
  { id: '2', name: 'TechStart Inc', contactPerson: 'Sarah Johnson', email: 'sarah@techstart.io', phone: '+1-555-0202', company: 'TechStart', status: 'ACTIVE', createdAt: '2026-02-20', updatedAt: '2026-05-15' },
  { id: '3', name: 'Bright Solutions', contactPerson: 'Mike Davis', email: 'mike@bright.co', phone: '+1-555-0303', company: 'Bright Solutions', status: 'PROSPECT', createdAt: '2026-03-10', updatedAt: '2026-06-05' },
  { id: '4', name: 'DataFlow Ltd', contactPerson: 'Emma Wilson', email: 'emma@dataflow.net', phone: '+1-555-0404', company: 'DataFlow Ltd', status: 'INACTIVE', createdAt: '2025-11-01', updatedAt: '2026-03-20' },
];

const statusBadge: Record<string, { label: string; variant: 'success' | 'default' | 'warning' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'default' },
  PROSPECT: { label: 'Prospect', variant: 'warning' },
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: { status: 'ACTIVE' },
  });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditingClient(null); reset({ status: 'ACTIVE' }); setModalOpen(true); };
  const openEdit = (client: Client) => {
    setEditingClient(client);
    reset({ name: client.name, contactPerson: client.contactPerson, email: client.email, phone: client.phone, company: client.company, status: client.status, notes: client.notes });
    setModalOpen(true);
  };

  const onSubmit = (data: ClientForm) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));
    } else {
      const now = new Date().toISOString();
      const newClient: Client = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
      setClients(prev => [newClient, ...prev]);
    }
    setModalOpen(false);
    reset();
  };

  const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  return (
    <div className="flex flex-col h-full">
      <Header title="Clients" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => {
            const badge = statusBadge[client.status];
            return (
              <Card key={client.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.company}</p>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{client.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{client.phone}</div>
                  <p className="text-gray-500">Contact: {client.contactPerson}</p>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(client)} className="flex-1">
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteClient(client.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'Edit Client' : 'Add Client'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Client Name" id="name" {...register('name')} error={errors.name?.message} />
            <Input label="Company" id="company" {...register('company')} error={errors.company?.message} />
          </div>
          <Input label="Contact Person" id="contactPerson" {...register('contactPerson')} error={errors.contactPerson?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" id="email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Phone" id="phone" {...register('phone')} error={errors.phone?.message} />
          </div>
          <Select
            label="Status"
            id="status"
            {...register('status')}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'PROSPECT', label: 'Prospect' },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
