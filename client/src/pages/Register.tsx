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
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white"><Home size={18} /></div>
            <span className="text-xl font-extrabold text-slate-800">RentConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join RentConnect in seconds.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => set('role', 'TENANT')}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${form.role === 'TENANT' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
                  <UserIcon size={18} /> Tenant
                </button>
                <button type="button" onClick={() => set('role', 'OWNER')}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${form.role === 'OWNER' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
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
            <button type="submit" className="btn-primary w-full !py-2.5" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />} Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=70" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/70 to-brand-600/30" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Find your next home</h2>
          <p className="mt-2 max-w-sm text-brand-100">List properties or discover your perfect rental with RentConnect.</p>
        </div>
      </div>
    </div>
  );
}
