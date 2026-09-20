import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Home, Calendar, DollarSign, Shield } from 'lucide-react';
import { api } from '../../lib/api';
import type { Lease } from '../../types';
import { PageHeader, Spinner, EmptyState } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function RentalAgreement() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/leases/mine').then((res) => setLeases(res.data.leases)).finally(() => setLoading(false)); }, []);

  if (loading) return <Spinner />;
  const active = leases.filter((l) => l.active);

  return (
    <div className="max-w-4xl">
      <PageHeader title="Rental Agreement" subtitle="Details of your current and past tenancies." />

      {leases.length === 0 ? (
        <EmptyState icon={<FileText size={40} />} title="No rental agreement"
          subtitle="Once your application is accepted, your agreement will appear here."
          action={<Link to="/properties" className="btn-primary">Browse Properties</Link>} />
      ) : (
        <div className="space-y-6">
          {leases.map((l) => (
            <div key={l.id} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-brand-50 to-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-brand-600" size={20} />
                  <h3 className="font-semibold text-slate-800">Lease Agreement #{l.id}</h3>
                </div>
                <span className={`badge ${l.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{l.active ? 'Active' : 'Ended'}</span>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div className="flex gap-4">
                  <img src={l.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=70'} alt="" className="h-24 w-32 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-semibold text-slate-800">{l.property?.title}</h4>
                    <p className="text-sm text-slate-500">{l.property?.address}, {l.property?.city}</p>
                    <Link to={`/properties/${l.propertyId}`} className="mt-1 inline-block text-sm text-brand-600 hover:underline">View property</Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Item icon={<DollarSign size={16} />} label="Monthly Rent" value={currency(l.rent)} />
                  <Item icon={<Shield size={16} />} label="Security Deposit" value={currency(l.deposit)} />
                  <Item icon={<Calendar size={16} />} label="Start Date" value={dateFmt(l.startDate)} />
                  <Item icon={<Home size={16} />} label="Landlord" value={l.owner?.name || '—'} />
                </div>
              </div>
              <div className="border-t border-slate-100 px-6 py-4">
                <Link to="/tenant/payments" className="btn-secondary">Manage Rent Payments</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Item({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-slate-400">{icon}<span className="text-xs">{label}</span></div>
      <p className="mt-0.5 font-semibold text-slate-700">{value}</p>
    </div>
  );
}
