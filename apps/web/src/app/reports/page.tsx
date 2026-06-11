'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Download, FileText, TrendingUp, Users, FolderOpen } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'project-status', title: 'Project Status Report', desc: 'Full status for all active projects including task progress and budget utilization', icon: FolderOpen, color: 'bg-blue-50 text-blue-600' },
  { id: 'client-summary', title: 'Client Summary Report', desc: 'Overview of all clients, their projects, and engagement status', icon: Users, color: 'bg-green-50 text-green-600' },
  { id: 'sprint-summary', title: 'Sprint Summary', desc: 'Velocity, completed stories, and carry-over for the current sprint', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  { id: 'invoice-draft', title: 'Invoice Draft', desc: 'Auto-generated invoice based on project budget and milestones', icon: FileText, color: 'bg-yellow-50 text-yellow-600' },
];

const MONTHLY_DATA = [
  { month: 'Jan', tasks: 28 }, { month: 'Feb', tasks: 35 }, { month: 'Mar', tasks: 42 },
  { month: 'Apr', tasks: 38 }, { month: 'May', tasks: 51 }, { month: 'Jun', tasks: 47 },
];

const maxTasks = Math.max(...MONTHLY_DATA.map(d => d.tasks));

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Reports" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TYPES.map(report => (
            <Card key={report.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${report.color}`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="secondary">Preview</Button>
                    <Button size="sm">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Monthly Completed Tasks</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-48">
              {MONTHLY_DATA.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">{d.tasks}</span>
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                    style={{ height: `${(d.tasks / maxTasks) * 160}px` }}
                  />
                  <span className="text-xs text-gray-500">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
