import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, FolderOpen, AlertTriangle, ClipboardCheck, Zap, AlertCircle } from 'lucide-react';

const mockStats = {
  totalClients: 24,
  activeProjects: 12,
  overdueTasks: 5,
  pendingApprovals: 3,
  sprintVelocity: 42,
  openRisks: 2,
};

const recentProjects = [
  { id: '1', name: 'E-Commerce Platform', client: 'Acme Corp', status: 'IN_PROGRESS', deadline: '2026-07-15' },
  { id: '2', name: 'CRM Integration', client: 'TechStart Inc', status: 'UAT', deadline: '2026-06-20' },
  { id: '3', name: 'Mobile App v2', client: 'Bright Solutions', status: 'PLANNING', deadline: '2026-08-01' },
  { id: '4', name: 'Data Pipeline', client: 'DataFlow Ltd', status: 'COMPLETED', deadline: '2026-05-30' },
];

const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'default' | 'purple' }> = {
  PLANNING: { label: 'Planning', variant: 'default' },
  IN_PROGRESS: { label: 'In Progress', variant: 'info' },
  UAT: { label: 'UAT', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'purple' },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome back, Admin</h2>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening across your portal today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Clients" value={mockStats.totalClients} icon={Users} color="blue" trend={{ value: 8, positive: true }} />
          <StatCard title="Active Projects" value={mockStats.activeProjects} icon={FolderOpen} color="green" trend={{ value: 12, positive: true }} />
          <StatCard title="Overdue Tasks" value={mockStats.overdueTasks} icon={AlertTriangle} color="red" />
          <StatCard title="Pending Approvals" value={mockStats.pendingApprovals} icon={ClipboardCheck} color="yellow" />
          <StatCard title="Sprint Velocity" value={mockStats.sprintVelocity} icon={Zap} color="purple" trend={{ value: 5, positive: true }} />
          <StatCard title="Open Risks" value={mockStats.openRisks} icon={AlertCircle} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Project</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Client</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => {
                    const cfg = statusConfig[project.status];
                    return (
                      <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">{project.name}</td>
                        <td className="px-6 py-3 text-gray-600">{project.client}</td>
                        <td className="px-6 py-3">
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </td>
                        <td className="px-6 py-3 text-gray-600">{project.deadline}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Done', count: 47, total: 80, color: 'bg-green-500' },
                  { label: 'In Progress', count: 18, total: 80, color: 'bg-blue-500' },
                  { label: 'Review', count: 8, total: 80, color: 'bg-yellow-500' },
                  { label: 'Backlog', count: 7, total: 80, color: 'bg-gray-400' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="text-gray-500">{item.count} / {item.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${(item.count / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
