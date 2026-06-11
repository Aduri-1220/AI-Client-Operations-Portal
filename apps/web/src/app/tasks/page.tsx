'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';

const COLUMNS: { status: Task['status']; label: string }[] = [
  { status: 'BACKLOG', label: 'Backlog' },
  { status: 'TODO', label: 'To Do' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'REVIEW', label: 'Review' },
  { status: 'DONE', label: 'Done' },
];

const priorityVariant: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
  CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'default',
};

const taskSchema = z.object({
  title: z.string().min(2, 'Title required'),
  projectId: z.string().min(1, 'Project required'),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  storyPoints: z.string().optional(),
  description: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

const mockTasks: Task[] = [
  { id: '1', title: 'Set up authentication flow', projectId: '1', status: 'DONE', priority: 'HIGH', storyPoints: 5, createdAt: '2026-06-01', updatedAt: '2026-06-05' },
  { id: '2', title: 'Design client dashboard UI', projectId: '1', status: 'IN_PROGRESS', priority: 'HIGH', storyPoints: 8, createdAt: '2026-06-02', updatedAt: '2026-06-06' },
  { id: '3', title: 'Build REST API for projects', projectId: '1', status: 'IN_PROGRESS', priority: 'MEDIUM', storyPoints: 5, createdAt: '2026-06-03', updatedAt: '2026-06-07' },
  { id: '4', title: 'Write Playwright E2E tests', projectId: '2', status: 'TODO', priority: 'MEDIUM', storyPoints: 3, createdAt: '2026-06-04', updatedAt: '2026-06-04' },
  { id: '5', title: 'Configure Azure AD B2C', projectId: '1', status: 'REVIEW', priority: 'CRITICAL', storyPoints: 8, createdAt: '2026-06-05', updatedAt: '2026-06-08' },
  { id: '6', title: 'Set up n8n workflows', projectId: '2', status: 'BACKLOG', priority: 'LOW', storyPoints: 3, createdAt: '2026-06-06', updatedAt: '2026-06-06' },
  { id: '7', title: 'Implement MCP server tools', projectId: '1', status: 'TODO', priority: 'HIGH', storyPoints: 13, createdAt: '2026-06-07', updatedAt: '2026-06-07' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: { status: 'BACKLOG', priority: 'MEDIUM' },
  });

  const onSubmit = (data: TaskForm) => {
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      storyPoints: data.storyPoints ? (parseInt(data.storyPoints) as Task['storyPoints']) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setModalOpen(false);
    reset();
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t));
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Tasks" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>

        <div className="flex gap-4 min-w-max pb-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status);
            return (
              <div
                key={col.status}
                className="w-64 flex-shrink-0"
                onDragOver={e => e.preventDefault()}
                onDrop={() => dragging && moveTask(dragging, col.status)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-32">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDragging(task.id)}
                      onDragEnd={() => setDragging(null)}
                      className={cn(
                        'bg-white rounded-lg border border-gray-200 p-3 cursor-grab hover:shadow-sm transition-shadow select-none',
                        dragging === task.id && 'opacity-50'
                      )}
                    >
                      <p className="text-sm font-medium text-gray-900 mb-2">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant={priorityVariant[task.priority]} className="text-xs">
                          {task.priority}
                        </Badge>
                        {task.storyPoints && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono">
                            {task.storyPoints}pt
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" id="title" {...register('title')} error={errors.title?.message} />
          <Select
            label="Project"
            id="projectId"
            {...register('projectId')}
            options={[
              { value: '', label: 'Select project...' },
              { value: '1', label: 'E-Commerce Platform' },
              { value: '2', label: 'CRM Integration' },
              { value: '3', label: 'Mobile App v2' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              id="status"
              {...register('status')}
              options={[
                { value: 'BACKLOG', label: 'Backlog' },
                { value: 'TODO', label: 'To Do' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'REVIEW', label: 'Review' },
                { value: 'DONE', label: 'Done' },
              ]}
            />
            <Select
              label="Priority"
              id="priority"
              {...register('priority')}
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'CRITICAL', label: 'Critical' },
              ]}
            />
          </div>
          <Select
            label="Story Points"
            id="storyPoints"
            {...register('storyPoints')}
            options={[
              { value: '', label: 'Unestimated' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '5', label: '5' },
              { value: '8', label: '8' },
              { value: '13', label: '13' },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
