import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Trash2, Check, Ban } from 'lucide-react';
import { api } from '../../lib/api';
import type { Property } from '../../types';
import { PageHeader, Spinner, StatusBadge } from '../../components/ui';
import { currency } from '../../lib/format';

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin listing endpoint returns approved only; use a broad fetch by omitting approved filter is not possible,
  // so we query without filters (returns approved) plus we can toggle. For simplicity we show all via /properties.
  const load = () => api.get('/properties').then((res) => setProperties(res.data.properties)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const setApproval = async (id: number, approved: boolean) => { await api.patch(`/properties/${id}/approval`, { approved }); load(); };
  const remove = async (id: number) => { if (!confirm('Remove this listing?')) return; await api.delete(`/properties/${id}`); load(); };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Manage Properties" subtitle="Approve, monitor and remove listings." />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Rent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Approval</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=70'} alt="" className="h-10 w-14 rounded object-cover" />
                      <div>
                        <Link to={`/properties/${p.id}`} className="font-medium text-ink-700 hover:text-brand-600">{p.title}</Link>
                        <p className="text-xs text-ink-400">{p.city} · {p.propertyType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{p.owner?.name}</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{currency(p.monthlyRent)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{p.approved ? 'Approved' : 'Pending'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {p.approved ? (
                        <button onClick={() => setApproval(p.id, false)} className="rounded-lg p-1.5 text-ink-400 hover:bg-amber-50 hover:text-amber-600" title="Unapprove"><Ban size={16} /></button>
                      ) : (
                        <button onClick={() => setApproval(p.id, true)} className="rounded-lg p-1.5 text-ink-400 hover:bg-emerald-50 hover:text-emerald-600" title="Approve"><Check size={16} /></button>
                      )}
                      <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
