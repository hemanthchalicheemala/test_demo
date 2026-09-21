import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Check, X, Mail, Phone, MapPin } from 'lucide-react';
import { api } from '../../lib/api';
import type { RentalRequest } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge, Modal } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function OwnerRequests() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RentalRequest | null>(null);
  const [filter, setFilter] = useState('ALL');

  const load = () => api.get('/requests/received').then((res) => setRequests(res.data.requests)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const act = async (id: number, status: string) => {
    await api.patch(`/requests/${id}/status`, { status });
    setProfile(null);
    load();
  };

  if (loading) return <Spinner />;
  const filtered = filter === 'ALL' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div>
      <PageHeader title="Rental Requests" subtitle="Review applications and accept or reject tenants." />

      <div className="mb-4 flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 border border-ink-200'}`}>
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} />} title="No requests" subtitle="Rental requests from tenants will appear here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <img src={r.tenant?.avatar || `https://i.pravatar.cc/80?u=${r.tenant?.email}`} alt="" className="h-14 w-14 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink-900">{r.tenant?.name}</h3>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-ink-500">applied for <Link to={`/properties/${r.propertyId}`} className="font-medium text-brand-600 hover:underline">{r.property?.title}</Link> · {currency(r.property?.monthlyRent || 0)}/mo</p>
                {r.message && <p className="mt-1 text-sm italic text-ink-400 line-clamp-1">"{r.message}"</p>}
                <p className="mt-1 text-xs text-ink-400">{dateFmt(r.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => setProfile(r)}>View Profile</button>
                {r.status === 'PENDING' && (
                  <>
                    <button className="btn-success" onClick={() => act(r.id, 'ACCEPTED')}><Check size={16} /> Accept</button>
                    <button className="btn-danger" onClick={() => act(r.id, 'REJECTED')}><X size={16} /> Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!profile} onClose={() => setProfile(null)} title="Tenant Profile">
        {profile?.tenant && (
          <div>
            <div className="flex items-center gap-4">
              <img src={profile.tenant.avatar || `https://i.pravatar.cc/120?u=${profile.tenant.email}`} alt="" className="h-16 w-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-ink-900">{profile.tenant.name}</h3>
                <p className="text-sm text-ink-500">Tenant</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-ink-600">
              <p className="flex items-center gap-2"><Mail size={15} /> {profile.tenant.email}</p>
              {profile.tenant.phone && <p className="flex items-center gap-2"><Phone size={15} /> {profile.tenant.phone}</p>}
              {profile.tenant.city && <p className="flex items-center gap-2"><MapPin size={15} /> {profile.tenant.city}</p>}
            </div>
            {profile.tenant.bio && <p className="mt-3 rounded-lg bg-ink-50 p-3 text-sm text-ink-600">{profile.tenant.bio}</p>}
            <div className="mt-4 rounded-lg border border-ink-100 p-3">
              <p className="text-xs font-semibold uppercase text-ink-400">Application message</p>
              <p className="mt-1 text-sm text-ink-600">{profile.message || 'No message provided.'}</p>
            </div>
            {profile.status === 'PENDING' && (
              <div className="mt-5 flex justify-end gap-2">
                <button className="btn-danger" onClick={() => act(profile.id, 'REJECTED')}><X size={16} /> Reject</button>
                <button className="btn-success" onClick={() => act(profile.id, 'ACCEPTED')}><Check size={16} /> Accept</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
