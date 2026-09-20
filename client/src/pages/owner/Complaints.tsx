import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { api } from '../../lib/api';
import type { Complaint } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge } from '../../components/ui';
import { dateFmt } from '../../lib/format';

const NEXT: Record<string, { label: string; status: string }> = {
  OPEN: { label: 'Start Progress', status: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Mark Resolved', status: 'RESOLVED' },
};

export default function OwnerComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => api.get('/complaints/received').then((res) => setComplaints(res.data.complaints)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const update = async (id: number, status: string) => { await api.patch(`/complaints/${id}/status`, { status }); load(); };

  if (loading) return <Spinner />;
  const filtered = filter === 'ALL' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div>
      <PageHeader title="Maintenance Complaints" subtitle="Manage and resolve tenant maintenance requests." />

      <div className="mb-4 flex flex-wrap gap-2">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            {f.replace('_', ' ').charAt(0) + f.replace('_', ' ').slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Wrench size={40} />} title="No complaints" subtitle="Maintenance complaints from tenants will appear here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{c.title}</h3>
                    <StatusBadge status={c.status} />
                    <StatusBadge status={c.priority} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                  <p className="mt-2 text-xs text-slate-400">{c.category} · {c.property?.title} · by {c.tenant?.name} · {dateFmt(c.createdAt)}</p>
                </div>
                {NEXT[c.status] && (
                  <button className="btn-primary whitespace-nowrap" onClick={() => update(c.id, NEXT[c.status].status)}>{NEXT[c.status].label}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
