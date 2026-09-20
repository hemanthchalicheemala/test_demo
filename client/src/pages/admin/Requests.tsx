import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { api } from '../../lib/api';
import type { RentalRequest } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function AdminRequests() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/requests').then((res) => setRequests(res.data.requests)).finally(() => setLoading(false)); }, []);
  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Rental Requests" subtitle="Monitor rental requests across the platform." />

      {requests.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} />} title="No requests" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Rent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{r.tenant?.name}</td>
                    <td className="px-4 py-3 text-slate-500">{r.property?.title}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{currency(r.property?.monthlyRent || 0)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-slate-500">{dateFmt(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
