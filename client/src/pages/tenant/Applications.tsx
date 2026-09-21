import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { RentalRequest } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function MyApplications() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/requests/mine').then((res) => setRequests(res.data.requests)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const cancel = async (id: number) => {
    await api.patch(`/requests/${id}/status`, { status: 'CANCELLED' });
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="My Applications" subtitle="Track the status of your rental requests." />

      {requests.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} />} title="No applications yet"
          subtitle="Browse properties and send your first rental request."
          action={<Link to="/properties" className="btn-primary">Browse Properties</Link>} />
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={r.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=70'} alt="" className="h-24 w-full rounded-xl object-cover sm:w-36" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/properties/${r.propertyId}`} className="font-semibold text-ink-900 hover:text-brand-600">{r.property?.title}</Link>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-ink-500">{r.property?.address}, {r.property?.city}</p>
                <p className="mt-1 text-sm font-medium text-brand-600">{currency(r.property?.monthlyRent || 0)}/mo</p>
                {r.message && <p className="mt-2 text-sm italic text-ink-400">"{r.message}"</p>}
                <p className="mt-1 text-xs text-ink-400">Applied {dateFmt(r.createdAt)}</p>
              </div>
              {r.status === 'PENDING' && (
                <button className="btn-ghost text-red-600" onClick={() => cancel(r.id)}><X size={16} /> Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
