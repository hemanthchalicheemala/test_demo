import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Loader2, Building2, User as UserIcon } from 'lucide-react';
import { useAuth, dashboardPath } from '../lib/auth';
import type { Role } from '../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '', role: 'TENANT' as Role });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(dashboardPath(user.role));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-mesh lg:hidden" />
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/" className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><Home size={18} /></div>
            <span className="font-display text-xl font-extrabold text-ink-900">RentConnect</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink-900">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-500">Join RentConnect in seconds.</p>

          {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 ring-1 ring-red-100">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => set('role', 'TENANT')}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${form.role === 'TENANT' ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' : 'border-ink-200 text-ink-600 hover:border-ink-300'}`}>
                  <UserIcon size={18} /> Tenant
                </button>
                <button type="button" onClick={() => set('role', 'OWNER')}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${form.role === 'OWNER' ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' : 'border-ink-200 text-ink-600 hover:border-ink-300'}`}>
                  <Building2 size={18} /> House Owner
                </button>
              </div>
            </div>
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="label">City</label>
                <input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />} Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=70" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-800/40 to-accent-500/20" />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <h2 className="font-display text-4xl font-bold leading-tight">Find your next home.</h2>
          <p className="mt-3 max-w-sm text-lg text-brand-100">List properties or discover your perfect rental with RentConnect.</p>
        </div>
      </div>
    </div>
  );
}
