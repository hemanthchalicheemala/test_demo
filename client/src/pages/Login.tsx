import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';
import { useAuth, dashboardPath } from '../lib/auth';

const demoAccounts = [
  { role: 'Owner', email: 'owner@rentconnect.com' },
  { role: 'Tenant', email: 'tenant@rentconnect.com' },
  { role: 'Admin', email: 'admin@rentconnect.com' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@rentconnect.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(dashboardPath(user.role));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=70" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-800/40 to-brand-600/20" />
        <div className="absolute left-10 top-10">
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur"><Home size={18} /></div>
            <span className="font-display text-xl font-extrabold">RentConnect</span>
          </Link>
        </div>
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <h2 className="font-display text-4xl font-bold leading-tight">Welcome back.</h2>
          <p className="mt-3 max-w-sm text-lg text-brand-100">Manage your properties, applications and payments — all in one beautiful place.</p>
          <div className="mt-8 flex items-center gap-6">
            <div><p className="font-display text-2xl font-bold">12+</p><p className="text-sm text-brand-200">Properties</p></div>
            <div className="h-10 w-px bg-white/20" />
            <div><p className="font-display text-2xl font-bold">3</p><p className="text-sm text-brand-200">Roles</p></div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-mesh lg:hidden" />
        <div className="w-full max-w-sm animate-fade-in-up">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><Home size={18} /></div>
            <span className="font-display text-xl font-extrabold text-ink-900">RentConnect</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink-900">Sign in</h1>
          <p className="mt-1.5 text-sm text-ink-500">Enter your credentials to continue.</p>

          {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 ring-1 ring-red-100">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />} Sign In
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Demo accounts · password123</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {demoAccounts.map((a) => (
                <button key={a.email} onClick={() => { setEmail(a.email); setPassword('password123'); }}
                  className="chip">
                  {a.role}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don't have an account? <Link to="/register" className="font-semibold text-brand-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
