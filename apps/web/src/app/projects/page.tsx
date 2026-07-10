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
import { useEffect, useState } from 'react';
import { Plus, Calendar, DollarSign, Users } from 'lucide-react';
import type { Client, Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { projectsService } from '@/services/projects';
import { clientsService } from '@/services/clients';

const projectSchema = z.object({
  name: z.string().min(2, 'Name required'),
  clientId: z.string().min(1, 'Client required'),
  startDate: z.string().min(1, 'Start date required'),
  deadline: z.string().min(1, 'Deadline required'),
  budget: z.string().min(1, 'Budget required'),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'UAT', 'COMPLETED', 'ON_HOLD']),
  description: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'default' | 'purple' }> = {
  PLANNING: { label: 'Planning', variant: 'default' },
  IN_PROGRESS: { label: 'In Progress', variant: 'info' },
  UAT: { label: 'UAT', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'purple' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'PLANNING' },
  });

  useEffect(() => {
    Promise.all([projectsService.getAll(), clientsService.getAll()])
      .then(([projectsData, clientsData]) => {
        setProjects(projectsData);
        setClients(clientsData);
      })
      .catch(() => setError('Could not load projects — is the API running?'))
      .finally(() => setLoading(false));
  }, []);

  const clientName = (project: Project) =>
    project.client?.name ?? clients.find(c => c.id === project.clientId)?.name ?? 'Unknown client';

  const onSubmit = async (data: ProjectForm) => {
    const { budget, ...rest } = data;
    const created = await projectsService.create({ ...rest, budget: parseFloat(budget), assignedTeam: [] });
    setProjects(prev => [created, ...prev]);
    setModalOpen(false);
    reset();
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Projects" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-end">
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-gray-500">Loading projects…</p>}
        {!loading && !error && clients.length === 0 && (
          <p className="text-sm text-gray-500">No clients yet — add a client first so you can assign a project to them.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => {
            const cfg = statusConfig[project.status];
            return (
              <Card key={project.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{clientName(project)}</p>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(project.startDate)} → {formatDate(project.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{formatCurrency(Number(project.budget))}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{project.assignedTeam.length} team member{project.assignedTeam.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: project.status === 'COMPLETED' ? '100%' : project.status === 'UAT' ? '80%' : project.status === 'IN_PROGRESS' ? '50%' : '10%' }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Project" className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Project Name" id="name" {...register('name')} error={errors.name?.message} />
          <Select
            label="Client"
            id="clientId"
            {...register('clientId')}
            options={[
              { value: '', label: clients.length ? 'Select client...' : 'No clients yet — add one first' },
              ...clients.map(c => ({ value: c.id, label: c.name })),
            ]}
            error={errors.clientId?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" id="startDate" type="date" {...register('startDate')} error={errors.startDate?.message} />
            <Input label="Deadline" id="deadline" type="date" {...register('deadline')} error={errors.deadline?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget ($)" id="budget" type="number" {...register('budget')} error={errors.budget?.message} />
            <Select
              label="Status"
              id="status"
              {...register('status')}
              options={[
                { value: 'PLANNING', label: 'Planning' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'UAT', label: 'UAT' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'ON_HOLD', label: 'On Hold' },
              ]}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
