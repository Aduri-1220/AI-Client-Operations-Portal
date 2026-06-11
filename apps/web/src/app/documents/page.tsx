'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileText, Download, Trash2, Upload, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import type { Document } from '@/types';
import { formatDate } from '@/lib/utils';

const mockDocuments: Document[] = [
  { id: '1', name: 'Project_Proposal_ECommerce_v2.pdf', projectId: '1', uploadedBy: 'Admin', fileUrl: '#', fileType: 'pdf', size: 2048000, createdAt: '2026-06-01' },
  { id: '2', name: 'Architecture_Diagram_v3.png', projectId: '1', uploadedBy: 'Emma W.', fileUrl: '#', fileType: 'png', size: 512000, createdAt: '2026-06-03' },
  { id: '3', name: 'Sprint_13_Planning.xlsx', projectId: '2', uploadedBy: 'Sarah J.', fileUrl: '#', fileType: 'xlsx', size: 128000, createdAt: '2026-06-05' },
  { id: '4', name: 'UAT_Signoff_CRM.pdf', projectId: '2', uploadedBy: 'Mike D.', fileUrl: '#', fileType: 'pdf', size: 256000, createdAt: '2026-06-07' },
  { id: '5', name: 'Invoice_Acme_Q2_2026.pdf', projectId: '1', uploadedBy: 'Admin', fileUrl: '#', fileType: 'pdf', size: 180000, createdAt: '2026-06-08' },
];

const fileIcon = (type: string) => {
  if (type === 'pdf') return <FileText className="h-8 w-8 text-red-500" />;
  if (type === 'xlsx') return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
  return <FileText className="h-8 w-8 text-blue-500" />;
};

const formatSize = (bytes: number) => {
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  return `${(bytes / 1000).toFixed(0)} KB`;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);

  return (
    <div className="flex flex-col h-full">
      <Header title="Documents" />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{documents.length} documents</p>
          <Button>
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {documents.map(doc => (
            <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {fileIcon(doc.fileType)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatSize(doc.size)} · {formatDate(doc.createdAt)}</p>
                  <p className="text-xs text-gray-400">Uploaded by {doc.uploadedBy}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
