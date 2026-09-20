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
      <div className="relative hidden lg:block">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=70" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-brand-600/30" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 max-w-sm text-brand-100">Manage your properties, applications and payments in one place.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white"><Home size={18} /></div>
            <span className="text-xl font-extrabold text-slate-800">RentConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Sign in to your account</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your credentials to continue.</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full !py-2.5" disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />} Sign In
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Demo accounts (password: password123)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {demoAccounts.map((a) => (
                <button key={a.email} onClick={() => { setEmail(a.email); setPassword('password123'); }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-600">
                  {a.role}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="font-semibold text-brand-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
