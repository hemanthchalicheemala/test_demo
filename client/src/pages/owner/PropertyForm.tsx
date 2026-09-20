import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, ImagePlus, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { PageHeader, Spinner } from '../../components/ui';
import { amenityList } from '../../lib/format';

const TYPES = ['Apartment', 'House', 'Studio', 'Villa', 'Condo'];
const ALL_AMENITIES = ['WiFi', 'Air Conditioning', 'Heating', 'Washer', 'Dryer', 'Gym', 'Pool', 'Elevator', 'Pet Friendly', 'Balcony', 'Dishwasher', 'Security'];
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=70',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70',
];

const empty = {
  title: '', address: '', city: '', monthlyRent: '', securityDeposit: '', bedrooms: '1', bathrooms: '1',
  furnished: false, parking: false, propertyType: 'Apartment', description: '', status: 'AVAILABLE',
};

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = !!id;
  const [form, setForm] = useState<any>(empty);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imgInput, setImgInput] = useState('');
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    api.get(`/properties/${id}`).then((res) => {
      const p = res.data.property;
      setForm({
        title: p.title, address: p.address, city: p.city, monthlyRent: String(p.monthlyRent), securityDeposit: String(p.securityDeposit),
        bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms), furnished: p.furnished, parking: p.parking,
        propertyType: p.propertyType, description: p.description, status: p.status,
      });
      setAmenities(amenityList(p.amenities));
      setImages(p.images.map((i: any) => i.url));
    }).finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const toggleAmenity = (a: string) => setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  const addImage = (url: string) => { if (url && !images.includes(url)) setImages((prev) => [...prev, url]); setImgInput(''); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.address || !form.city || !form.monthlyRent) {
      setError('Please fill in title, address, city and monthly rent.');
      return;
    }
    setSaving(true);
    const payload = { ...form, monthlyRent: Number(form.monthlyRent), securityDeposit: Number(form.securityDeposit || 0), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), amenities, images: images.length ? images : SAMPLE_IMAGES };
    try {
      if (editing) await api.put(`/properties/${id}`, payload);
      else await api.post('/properties', payload);
      navigate('/owner/properties');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save property');
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl">
      <PageHeader title={editing ? 'Edit Property' : 'Add Property'} subtitle="Provide details about your rental property." />

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

      <form onSubmit={submit} className="space-y-6">
        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Sunlit Downtown Loft" />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main St" />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Austin" />
            </div>
            <div>
              <label className="label">Property Type</label>
              <select className="input" value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Pricing & Details</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="label">Monthly Rent ($)</label>
              <input type="number" className="input" value={form.monthlyRent} onChange={(e) => set('monthlyRent', e.target.value)} />
            </div>
            <div>
              <label className="label">Security Deposit ($)</label>
              <input type="number" className="input" value={form.securityDeposit} onChange={(e) => set('securityDeposit', e.target.value)} />
            </div>
            <div>
              <label className="label">Bedrooms</label>
              <input type="number" min="0" className="input" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} />
            </div>
            <div>
              <label className="label">Bathrooms</label>
              <input type="number" min="0" className="input" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded" checked={form.furnished} onChange={(e) => set('furnished', e.target.checked)} /> Furnished
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded" checked={form.parking} onChange={(e) => set('parking', e.target.checked)} /> Parking available
            </label>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((a) => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium ${amenities.includes(a) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-slate-800">Photos</h3>
          <div className="flex gap-2">
            <input className="input" value={imgInput} onChange={(e) => setImgInput(e.target.value)} placeholder="Paste an image URL…" />
            <button type="button" className="btn-secondary" onClick={() => addImage(imgInput)}><Plus size={16} /> Add</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs text-slate-400">Quick add:</span>
            {SAMPLE_IMAGES.map((s, i) => (
              <button type="button" key={s} className="text-xs text-brand-600 hover:underline" onClick={() => addImage(s)}>Sample {i + 1}</button>
            ))}
          </div>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((url) => (
                <div key={url} className="group relative h-24 overflow-hidden rounded-lg bg-slate-100">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 opacity-0 transition group-hover:opacity-100"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-400">
              <ImagePlus size={18} /> No images added — sample photos will be used.
            </div>
          )}
        </div>

        <div className="card p-6">
          <label className="label">Description</label>
          <textarea className="input h-32" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the property, neighborhood and highlights…" />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />} {editing ? 'Save Changes' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
