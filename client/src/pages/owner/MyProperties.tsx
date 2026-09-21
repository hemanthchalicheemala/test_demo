import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Pencil, Trash2, Bed, Bath } from 'lucide-react';
import { api } from '../../lib/api';
import type { Property } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge } from '../../components/ui';
import { currency } from '../../lib/format';

export default function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/properties/mine').then((res) => setProperties(res.data.properties)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    await api.delete(`/properties/${id}`);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="My Properties" subtitle="Manage your property listings."
        action={<Link to="/owner/properties/new" className="btn-primary"><Plus size={16} /> Add Property</Link>} />

      {properties.length === 0 ? (
        <EmptyState icon={<Building2 size={40} />} title="No properties yet"
          subtitle="Create your first listing to start receiving rental requests."
          action={<Link to="/owner/properties/new" className="btn-primary">Add Property</Link>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative h-40 bg-ink-100">
                <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=70'} alt="" className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 flex gap-2">
                  <StatusBadge status={p.status} />
                  {!p.approved && <span className="badge bg-amber-50 text-amber-700">Pending Approval</span>}
                </div>
              </div>
              <div className="p-4">
                <Link to={`/properties/${p.id}`} className="font-semibold text-ink-900 hover:text-brand-600">{p.title}</Link>
                <p className="text-sm text-ink-500">{p.city}</p>
                <div className="mt-2 flex items-center gap-3 text-sm text-ink-600">
                  <span className="flex items-center gap-1"><Bed size={14} /> {p.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath size={14} /> {p.bathrooms}</span>
                  <span className="font-semibold text-brand-600">{currency(p.monthlyRent)}/mo</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-400">
                  <span>{p._count?.requests || 0} requests · {p._count?.complaints || 0} complaints</span>
                  <div className="flex gap-1">
                    <Link to={`/owner/properties/${p.id}/edit`} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 hover:text-brand-600"><Pencil size={16} /></Link>
                    <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
