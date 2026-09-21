import { Link } from 'react-router-dom';
import { Bed, Bath, MapPin, Sofa, Car, ArrowUpRight } from 'lucide-react';
import type { Property } from '../types';
import { currency } from '../lib/format';
import { StatusBadge } from './ui';

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70';

export function PropertyCard({ property }: { property: Property }) {
  const img = property.images?.[0]?.url || FALLBACK;
  return (
    <Link to={`/properties/${property.id}`} className="card card-hover group overflow-hidden">
      <div className="relative h-52 overflow-hidden bg-ink-100">
        <img src={img} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent opacity-70" />
        <div className="absolute left-3 top-3 flex gap-2">
          <StatusBadge status={property.status} />
          {property.furnished && <span className="badge bg-white/90 text-ink-700 backdrop-blur">Furnished</span>}
        </div>
        <div className="absolute right-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-700 shadow-sm backdrop-blur">
          {property.propertyType}
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <span className="font-display text-xl font-bold drop-shadow">{currency(property.monthlyRent)}</span>
          <span className="text-sm font-medium text-white/80">/mo</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-ink-900 line-clamp-1">{property.title}</h3>
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={15} /></span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
          <MapPin size={14} className="shrink-0" /> <span className="line-clamp-1">{property.address}, {property.city}</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-3 text-sm text-ink-600">
          <span className="flex items-center gap-1.5"><Bed size={15} className="text-ink-400" /> {property.bedrooms} bd</span>
          <span className="flex items-center gap-1.5"><Bath size={15} className="text-ink-400" /> {property.bathrooms} ba</span>
          <span className="flex items-center gap-1.5"><Sofa size={15} className="text-ink-400" /> {property.furnished ? 'Furnished' : 'Unfurnished'}</span>
          {property.parking && <span className="flex items-center gap-1.5"><Car size={15} className="text-ink-400" /> Parking</span>}
        </div>
      </div>
    </Link>
  );
}
