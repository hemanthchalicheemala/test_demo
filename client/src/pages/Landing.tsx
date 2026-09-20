import { Link } from 'react-router-dom';
import { Home, Search, ShieldCheck, CreditCard, Wrench, Bell, Building2, Users, ArrowRight, Star } from 'lucide-react';
import { useAuth, dashboardPath } from '../lib/auth';

const features = [
  { icon: <Search size={22} />, title: 'Smart Property Search', desc: 'Filter by location, rent, bedrooms, furnishing and amenities to find the perfect home.' },
  { icon: <ShieldCheck size={22} />, title: 'Verified Requests', desc: 'Owners review tenant profiles and accept or reject rental requests with a click.' },
  { icon: <CreditCard size={22} />, title: 'Rent Management', desc: 'Track monthly rent, due dates and payment history for every tenancy.' },
  { icon: <Wrench size={22} />, title: 'Maintenance Tracking', desc: 'Submit and monitor maintenance complaints from open to resolved.' },
  { icon: <Bell size={22} />, title: 'Real-time Notifications', desc: 'Stay informed on requests, payments, complaints and announcements.' },
  { icon: <Building2 size={22} />, title: 'Owner Dashboard', desc: 'Manage listings, tenants and finances from one beautiful dashboard.' },
];

const roles = [
  { icon: <Home size={24} />, title: 'House Owners', points: ['List & manage properties', 'Review rental requests', 'Track rent & complaints'] },
  { icon: <Users size={24} />, title: 'Tenants', points: ['Browse & filter homes', 'Apply & track status', 'Pay rent & raise issues'] },
  { icon: <ShieldCheck size={24} />, title: 'Admins', points: ['Manage users & listings', 'Monitor platform activity', 'View statistics'] },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white"><Home size={18} /></div>
            <span className="text-lg font-extrabold tracking-tight text-slate-800">RentConnect</span>
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              <Link to={dashboardPath(user.role)} className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-violet-50" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="badge bg-brand-100 text-brand-700">Tenant & House Owner Management</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Renting made <span className="text-brand-600">simple</span> for owners and tenants.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              RentConnect brings listings, applications, rent payments, maintenance and communication together in one modern platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary !px-6 !py-3 text-base">Get Started <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn-secondary !px-6 !py-3 text-base">Browse Demo</Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1"><Star size={16} className="fill-amber-400 text-amber-400" /> 4.9/5 owner rating</div>
              <div>12+ live properties</div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70"
              alt="Modern home"
              className="rounded-3xl shadow-soft"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-soft sm:block">
              <p className="text-xs text-slate-400">Monthly rent</p>
              <p className="text-xl font-bold text-brand-600">$2,600<span className="text-sm font-normal text-slate-400">/mo</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Built for everyone in the rental journey</h2>
          <p className="mt-2 text-slate-500">Three tailored experiences, one connected platform.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{r.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800">{r.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to rent smarter</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{f.icon}</div>
                <h3 className="mt-4 font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-violet-600 px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-brand-100">Join RentConnect and manage your rentals with confidence.</p>
          <Link to="/register" className="btn mt-6 !bg-white !px-6 !py-3 text-base !text-brand-700 hover:!bg-brand-50">Create your account</Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 sm:flex-row">
          <span>© {new Date().getFullYear()} RentConnect. Built with React, Express & Prisma.</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-600">Login</Link>
            <Link to="/register" className="hover:text-slate-600">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
