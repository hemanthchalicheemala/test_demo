import { useEffect, useState } from 'react';
import { Users, Mail, Phone, LogOut } from 'lucide-react';
import { api } from '../../lib/api';
import type { Lease } from '../../types';
import { PageHeader, Spinner, EmptyState } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function OwnerTenants() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/leases/tenants').then((res) => setLeases(res.data.leases)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const endLease = async (id: number) => {
    if (!confirm('End this tenancy? The property will be marked available.')) return;
    await api.patch(`/leases/${id}/end`);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Current Tenants" subtitle="Everyone currently renting your properties." />

      {leases.length === 0 ? (
        <EmptyState icon={<Users size={40} />} title="No active tenants" subtitle="Accept a rental request to see tenants here." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leases.map((l) => (
            <div key={l.id} className="card p-6">
              <div className="flex items-center gap-3">
                <img src={l.tenant?.avatar || `https://i.pravatar.cc/80?u=${l.tenant?.email}`} alt="" className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-slate-800">{l.tenant?.name}</h3>
                  <p className="text-sm text-slate-500">{l.property?.title}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {l.tenant?.email && <p className="flex items-center gap-2"><Mail size={14} /> {l.tenant.email}</p>}
                {l.tenant?.phone && <p className="flex items-center gap-2"><Phone size={14} /> {l.tenant.phone}</p>}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Rent</p>
                  <p className="font-semibold text-brand-600">{currency(l.rent)}/mo</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Since</p>
                  <p className="font-medium text-slate-700">{dateFmt(l.startDate)}</p>
                </div>
              </div>
              <button className="btn-ghost mt-3 w-full text-red-600" onClick={() => endLease(l.id)}><LogOut size={15} /> End Tenancy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
