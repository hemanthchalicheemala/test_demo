import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Bed, Bath, Sofa, Car, MapPin, Check, ArrowLeft, Phone, Mail, Wrench } from 'lucide-react';
import { api } from '../lib/api';
import type { Property } from '../types';
import { currency, amenityList } from '../lib/format';
import { Spinner, StatusBadge, Modal } from '../components/ui';
import { useAuth } from '../lib/auth';

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [showRequest, setShowRequest] = useState(false);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => setProperty(res.data.property)).finally(() => setLoading(false));
  }, [id]);

  const sendRequest = async () => {
    setSubmitting(true);
    setFeedback('');
    try {
      await api.post('/requests', { propertyId: Number(id), message });
      setShowRequest(false);
      setFeedback('Your rental request has been sent!');
      setMessage('');
    } catch (err: any) {
      setFeedback(err.response?.data?.error || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading property…" />;
  if (!property) return <p className="text-ink-500">Property not found.</p>;

  const images = property.images?.length ? property.images : [{ id: 0, url: FALLBACK }];
  const amenities = amenityList(property.amenities);

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 !px-2"><ArrowLeft size={16} /> Back</button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="overflow-hidden rounded-2xl bg-ink-100">
            <img src={images[active].url} alt={property.title} className="h-[380px] w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setActive(i)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${active === i ? 'border-brand-500' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="card mt-6 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-ink-900">{property.title}</h1>
                  <StatusBadge status={property.status} />
                </div>
                <p className="mt-1 flex items-center gap-1 text-ink-500"><MapPin size={16} /> {property.address}, {property.city}</p>
              </div>
              <span className="rounded-lg bg-ink-100 px-3 py-1 text-sm font-medium text-ink-600">{property.propertyType}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Feature icon={<Bed size={18} />} label="Bedrooms" value={property.bedrooms} />
              <Feature icon={<Bath size={18} />} label="Bathrooms" value={property.bathrooms} />
              <Feature icon={<Sofa size={18} />} label="Furnishing" value={property.furnished ? 'Furnished' : 'Unfurnished'} />
              <Feature icon={<Car size={18} />} label="Parking" value={property.parking ? 'Yes' : 'No'} />
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-ink-900">Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{property.description}</p>
            </div>

            {amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-ink-900">Amenities</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {amenities.map((a) => (
                    <span key={a} className="flex items-center gap-2 text-sm text-ink-600">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={12} /></span> {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <p className="text-sm text-ink-400">Monthly Rent</p>
            <p className="text-3xl font-bold text-brand-600">{currency(property.monthlyRent)}<span className="text-base font-normal text-ink-400">/mo</span></p>
            <p className="mt-1 text-sm text-ink-500">Security deposit: {currency(property.securityDeposit)}</p>

            {feedback && <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{feedback}</div>}

            {user?.role === 'TENANT' && property.status === 'AVAILABLE' && (
              <button className="btn-primary mt-4 w-full !py-2.5" onClick={() => setShowRequest(true)}>Send Rental Request</button>
            )}
            {user?.role === 'TENANT' && property.status === 'OCCUPIED' && (
              <button className="btn-secondary mt-4 w-full" disabled>Currently Occupied</button>
            )}
            {!user && (
              <Link to="/login" className="btn-primary mt-4 w-full">Login to Apply</Link>
            )}
          </div>

          {property.owner && (
            <div className="card p-6">
              <h3 className="font-semibold text-ink-900">Listed by</h3>
              <div className="mt-3 flex items-center gap-3">
                <img src={property.owner.avatar || `https://i.pravatar.cc/80?u=${property.owner.email}`} className="h-12 w-12 rounded-full object-cover" alt="" />
                <div>
                  <p className="font-medium text-ink-700">{property.owner.name}</p>
                  <p className="text-xs text-ink-400">Property Owner</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-ink-600">
                {property.owner.email && <p className="flex items-center gap-2"><Mail size={14} /> {property.owner.email}</p>}
                {property.owner.phone && <p className="flex items-center gap-2"><Phone size={14} /> {property.owner.phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={showRequest} onClose={() => setShowRequest(false)} title="Send Rental Request">
        <p className="text-sm text-ink-500">Introduce yourself to the owner and explain why you'd be a great tenant.</p>
        <textarea className="input mt-4 h-32" placeholder="Hi, I'm interested in renting this property…" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setShowRequest(false)}>Cancel</button>
          <button className="btn-primary" onClick={sendRequest} disabled={submitting}>Send Request</button>
        </div>
      </Modal>
    </div>
  );
}

function Feature({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-ink-50 p-3">
      <div className="flex items-center gap-2 text-brand-600">{icon}</div>
      <p className="mt-2 text-xs text-ink-400">{label}</p>
      <p className="font-semibold text-ink-700">{value}</p>
    </div>
  );
}
