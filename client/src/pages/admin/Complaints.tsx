import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { api } from '../../lib/api';
import type { Complaint } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge } from '../../components/ui';
import { dateFmt } from '../../lib/format';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/complaints').then((res) => setComplaints(res.data.complaints)).finally(() => setLoading(false)); }, []);
  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Complaints" subtitle="Monitor maintenance complaints across the platform." />

      {complaints.length === 0 ? (
        <EmptyState icon={<Wrench size={40} />} title="No complaints" />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-ink-900">{c.title}</h3>
                <StatusBadge status={c.status} />
                <StatusBadge status={c.priority} />
              </div>
              <p className="mt-1 text-sm text-ink-500">{c.description}</p>
              <p className="mt-2 text-xs text-ink-400">{c.category} · {c.property?.title} · by {c.tenant?.name} · {dateFmt(c.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
