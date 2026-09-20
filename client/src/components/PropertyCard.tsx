import { Link } from 'react-router-dom';
import { Bed, Bath, MapPin, Sofa, Car } from 'lucide-react';
import type { Property } from '../types';
import { currency } from '../lib/format';
import { StatusBadge } from './ui';

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70';

export function PropertyCard({ property }: { property: Property }) {
  const img = property.images?.[0]?.url || FALLBACK;
  return (
    <Link to={`/properties/${property.id}`} className="card group overflow-hidden transition hover:shadow-soft">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img src={img} alt={property.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.status} />
        </div>
        <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          {property.propertyType}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 line-clamp-1">{property.title}</h3>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} /> {property.address}, {property.city}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-1"><Bed size={15} /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath size={15} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Sofa size={15} /> {property.furnished ? 'Furnished' : 'Unfurnished'}</span>
          {property.parking && <span className="flex items-center gap-1"><Car size={15} /> Parking</span>}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="text-lg font-bold text-brand-600">{currency(property.monthlyRent)}</span>
            <span className="text-sm text-slate-400">/mo</span>
          </div>
          <span className="btn-secondary !py-1.5 !px-3 text-xs">View Details</span>
        </div>
      </div>
    </Link>
  );
}
