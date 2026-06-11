'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Approval } from '@/types';
import { formatDate } from '@/lib/utils';

const mockApprovals: Approval[] = [
  { id: '1', title: 'UAT Sign-off Document — CRM Integration', documentId: 'd1', requestedBy: 'Sarah Johnson', status: 'PENDING', createdAt: '2026-06-07', updatedAt: '2026-06-07' },
  { id: '2', title: 'Project Proposal — Mobile App v2', documentId: 'd2', requestedBy: 'Mike Davis', status: 'APPROVED', notes: 'Approved with minor revisions noted.', createdAt: '2026-06-01', updatedAt: '2026-06-03' },
  { id: '3', title: 'Invoice Draft — Acme Corp Q2', documentId: 'd3', requestedBy: 'Admin', status: 'REJECTED', notes: 'Line items need revision.', createdAt: '2026-05-28', updatedAt: '2026-06-02' },
  { id: '4', title: 'Architecture Decision Record — Auth', documentId: 'd4', requestedBy: 'Emma Wilson', status: 'PENDING', createdAt: '2026-06-08', updatedAt: '2026-06-08' },
];

const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger'; icon: typeof Clock }> = {
  PENDING: { label: 'Pending', variant: 'warning', icon: Clock },
  APPROVED: { label: 'Approved', variant: 'success', icon: CheckCircle },
  REJECTED: { label: 'Rejected', variant: 'danger', icon: XCircle },
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);

  const updateStatus = (id: string, status: Approval['status']) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a));
  };

  const pending = approvals.filter(a => a.status === 'PENDING');
  const decided = approvals.filter(a => a.status !== 'PENDING');

  return (
    <div className="flex flex-col h-full">
      <Header title="Approvals" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-3 gap-4">
          {['PENDING', 'APPROVED', 'REJECTED'].map(s => {
            const cfg = statusConfig[s];
            const count = approvals.filter(a => a.status === s).length;
            return (
              <Card key={s} className="p-4 flex items-center gap-3">
                <cfg.icon className={`h-8 w-8 ${s === 'PENDING' ? 'text-yellow-500' : s === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-500">{cfg.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {pending.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Pending Review ({pending.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0">
              {pending.map(approval => (
                <div key={approval.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{approval.title}</p>
                    <p className="text-sm text-gray-500">Requested by {approval.requestedBy} · {formatDate(approval.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="danger" onClick={() => updateStatus(approval.id, 'REJECTED')}>
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => updateStatus(approval.id, 'APPROVED')}>
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>History</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {decided.map(approval => {
              const cfg = statusConfig[approval.status];
              return (
                <div key={approval.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{approval.title}</p>
                    <p className="text-sm text-gray-500">{approval.requestedBy} · {formatDate(approval.updatedAt)}</p>
                    {approval.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{approval.notes}</p>}
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
