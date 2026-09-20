import { useEffect, useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { api } from '../lib/api';
import type { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PageHeader, Spinner, EmptyState } from '../components/ui';

const AMENITIES = ['WiFi', 'Air Conditioning', 'Heating', 'Washer', 'Gym', 'Pool', 'Elevator', 'Pet Friendly', 'Balcony', 'Parking', 'Security'];
const TYPES = ['Apartment', 'House', 'Studio', 'Villa', 'Condo'];

const emptyFilters = {
  q: '', city: '', minRent: '', maxRent: '', bedrooms: '', bathrooms: '', furnished: '', propertyType: '',
};

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const load = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    if (amenities.length) params.amenities = amenities.join(',');
    const res = await api.get('/properties', { params });
    setProperties(res.data.properties);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const set = (k: string, v: string) => setFilters((f) => ({ ...f, [k]: v }));
  const toggleAmenity = (a: string) => setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  const reset = () => { setFilters(emptyFilters); setAmenities([]); setTimeout(load, 0); };

  return (
    <div>
      <PageHeader title="Browse Properties" subtitle="Find your next home from our curated listings." />

      {/* Search bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input className="input !pl-10" placeholder="Search by title, address or city…" value={filters.q}
              onChange={(e) => set('q', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
          </div>
          <button className="btn-secondary" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="btn-primary" onClick={load}>Search</button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label">City / Location</label>
                <input className="input" value={filters.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. Austin" />
              </div>
              <div>
                <label className="label">Property Type</label>
                <select className="input" value={filters.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                  <option value="">Any</option>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Min Rent</label>
                <input type="number" className="input" value={filters.minRent} onChange={(e) => set('minRent', e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="label">Max Rent</label>
                <input type="number" className="input" value={filters.maxRent} onChange={(e) => set('maxRent', e.target.value)} placeholder="Any" />
              </div>
              <div>
                <label className="label">Min Bedrooms</label>
                <select className="input" value={filters.bedrooms} onChange={(e) => set('bedrooms', e.target.value)}>
                  <option value="">Any</option>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div>
                <label className="label">Min Bathrooms</label>
                <select className="input" value={filters.bathrooms} onChange={(e) => set('bathrooms', e.target.value)}>
                  <option value="">Any</option>{[1, 2, 3].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div>
                <label className="label">Furnishing</label>
                <select className="input" value={filters.furnished} onChange={(e) => set('furnished', e.target.value)}>
                  <option value="">Any</option>
                  <option value="true">Furnished</option>
                  <option value="false">Unfurnished</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${amenities.includes(a) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={load}>Apply Filters</button>
              <button className="btn-ghost" onClick={reset}><X size={16} /> Reset</button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <Spinner label="Loading properties…" />
      ) : properties.length === 0 ? (
        <EmptyState title="No properties found" subtitle="Try adjusting your search filters." />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
