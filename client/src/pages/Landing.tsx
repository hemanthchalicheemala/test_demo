import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Search, ShieldCheck, CreditCard, Wrench, Bell, Building2, Users, ArrowRight, Star,
  MapPin, Bed, Bath, CheckCircle2, Quote, Sparkles,
} from 'lucide-react';
import { useAuth, dashboardPath } from '../lib/auth';
import { api } from '../lib/api';
import type { Property } from '../types';
import { currency } from '../lib/format';

const features = [
  { icon: <Search size={22} />, title: 'Smart Property Search', desc: 'Filter by location, rent, bedrooms, furnishing and amenities to find the perfect home in seconds.' },
  { icon: <ShieldCheck size={22} />, title: 'Verified Requests', desc: 'Owners review tenant profiles and accept or reject rental requests with a single click.' },
  { icon: <CreditCard size={22} />, title: 'Rent Management', desc: 'Track monthly rent, due dates and full payment history for every tenancy.' },
  { icon: <Wrench size={22} />, title: 'Maintenance Tracking', desc: 'Submit and monitor maintenance complaints from open to resolved.' },
  { icon: <Bell size={22} />, title: 'Real-time Notifications', desc: 'Stay informed on requests, payments, complaints and announcements.' },
  { icon: <Building2 size={22} />, title: 'Owner Dashboard', desc: 'Manage listings, tenants and finances from one beautiful dashboard.' },
];

const roles = [
  { icon: <Home size={24} />, title: 'House Owners', tone: 'from-brand-500 to-brand-700', points: ['List & manage properties', 'Review rental requests', 'Track rent & complaints'] },
  { icon: <Users size={24} />, title: 'Tenants', tone: 'from-accent-400 to-accent-600', points: ['Browse & filter homes', 'Apply & track status', 'Pay rent & raise issues'] },
  { icon: <ShieldCheck size={24} />, title: 'Admins', tone: 'from-emerald-500 to-teal-600', points: ['Manage users & listings', 'Monitor platform activity', 'View statistics'] },
];

const steps = [
  { n: '01', title: 'Create your account', desc: 'Sign up as an owner or tenant in seconds.' },
  { n: '02', title: 'List or discover', desc: 'Owners post properties; tenants search and filter.' },
  { n: '03', title: 'Connect & apply', desc: 'Send rental requests and review applications.' },
  { n: '04', title: 'Manage everything', desc: 'Rent, maintenance and notifications in one place.' },
];

const testimonials = [
  { name: 'Olivia Bennett', role: 'Property Owner', text: 'RentConnect replaced three spreadsheets and a dozen email threads. Managing 12 units has never been this calm.', avatar: 'https://i.pravatar.cc/100?img=32' },
  { name: 'David Chen', role: 'Tenant', text: 'Found my apartment, applied, and paid my first rent all in one afternoon. The dashboard is gorgeous.', avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Priya Sharma', role: 'Property Owner', text: 'The maintenance tracking and instant notifications keep my tenants happy and my properties in top shape.', avatar: 'https://i.pravatar.cc/100?img=45' },
];

export default function Landing() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<Property[]>([]);

  useEffect(() => {
    api.get('/properties').then((res) => setFeatured(res.data.properties.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow"><Home size={18} /></div>
            <span className="font-display text-lg font-extrabold tracking-tight text-ink-900">RentConnect</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-ink-600 transition hover:text-brand-600">Features</a>
            <a href="#properties" className="text-sm font-medium text-ink-600 transition hover:text-brand-600">Properties</a>
            <a href="#how" className="text-sm font-medium text-ink-600 transition hover:text-brand-600">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to={dashboardPath(user.role)} className="btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-mesh" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Sparkles size={13} /> Tenant & House Owner Management
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 text-balance sm:text-5xl lg:text-6xl">
              Renting made <span className="bg-brand-gradient bg-clip-text text-transparent">simple</span> for owners & tenants.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500">
              RentConnect brings listings, applications, rent payments, maintenance and communication together in one modern, delightful platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary !px-6 !py-3 text-base">Get Started <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn-secondary !px-6 !py-3 text-base">Explore Demo</Link>
            </div>
            <div className="mt-10 flex items-center gap-8">
              <Stat value="12+" label="Live properties" />
              <div className="h-10 w-px bg-ink-200" />
              <Stat value="3" label="User roles" />
              <div className="h-10 w-px bg-ink-200" />
              <div>
                <div className="flex items-center gap-1 text-accent-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={15} className="fill-accent-400 text-accent-400" />)}
                </div>
                <p className="mt-1 text-xs text-ink-400">Loved by owners</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-gradient opacity-20 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75"
              alt="Modern home"
              className="rounded-[2rem] shadow-soft ring-1 ring-ink-900/5"
            />
            <div className="absolute -bottom-6 -left-6 hidden animate-float rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-900/5 sm:block">
              <p className="text-xs text-ink-400">Monthly rent</p>
              <p className="font-display text-2xl font-bold text-brand-600">$2,600<span className="text-sm font-normal text-ink-400">/mo</span></p>
            </div>
            <div className="absolute -right-4 top-8 hidden animate-float rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-900/5 sm:flex sm:items-center sm:gap-2" style={{ animationDelay: '1.5s' }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={18} /></span>
              <div>
                <p className="text-xs font-semibold text-ink-800">Request accepted</p>
                <p className="text-[11px] text-ink-400">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by / roles */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink-900">Built for everyone in the rental journey</h2>
          <p className="mt-3 text-ink-500">Three tailored experiences, one connected platform.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="card card-hover p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${r.tone} text-white shadow-sm`}>{r.icon}</div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{r.title}</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-ink-600">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-500" /> {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section id="properties" className="bg-ink-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Featured</span>
              <h2 className="mt-1 font-display text-3xl font-bold text-ink-900">Handpicked homes</h2>
            </div>
            <Link to="/register" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 sm:inline-flex">Browse all <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.length === 0 && [...Array(3)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-white shadow-card" />)}
            {featured.map((p) => (
              <Link key={p.id} to="/login" className="card card-hover group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=70'} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 font-display text-lg font-bold text-white drop-shadow">{currency(p.monthlyRent)}<span className="text-sm font-normal">/mo</span></span>
                  <span className="badge absolute left-3 top-3 bg-white/90 text-ink-700 backdrop-blur">{p.propertyType}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-ink-900 line-clamp-1">{p.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-ink-500"><MapPin size={14} /> {p.city}</p>
                  <div className="mt-3 flex gap-4 border-t border-ink-100 pt-3 text-sm text-ink-600">
                    <span className="flex items-center gap-1.5"><Bed size={15} className="text-ink-400" /> {p.bedrooms} bd</span>
                    <span className="flex items-center gap-1.5"><Bath size={15} className="text-ink-400" /> {p.bathrooms} ba</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Everything included</span>
          <h2 className="mt-1 font-display text-3xl font-bold text-ink-900">Everything you need to rent smarter</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-gradient group-hover:text-white">{f.icon}</div>
              <h3 className="mt-4 font-display font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-ink-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Simple by design</span>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink-900">How RentConnect works</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl bg-white p-6 shadow-card">
                <span className="font-display text-4xl font-extrabold text-brand-100">{s.n}</span>
                <h3 className="mt-2 font-display font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Loved by users</span>
          <h2 className="mt-1 font-display text-3xl font-bold text-ink-900">What people are saying</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <Quote size={28} className="text-brand-200" />
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{t.text}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
                <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-ink-800">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient px-8 py-16 text-center text-white shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-md text-brand-100">Join RentConnect and manage your rentals with confidence and clarity.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn !bg-white !px-6 !py-3 text-base !text-brand-700 hover:!bg-brand-50">Create your account</Link>
              <Link to="/login" className="btn !border !border-white/40 !px-6 !py-3 text-base !text-white hover:!bg-white/10">Try the demo</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white"><Home size={18} /></div>
                <span className="font-display text-lg font-extrabold text-ink-900">RentConnect</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-ink-500">The modern way to connect house owners and tenants.</p>
            </div>
            <FooterCol title="Product" links={['Features', 'Properties', 'How it works']} />
            <FooterCol title="Company" links={['About', 'Careers', 'Contact']} />
            <FooterCol title="Legal" links={['Privacy', 'Terms', 'Security']} />
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-sm text-ink-400 sm:flex-row">
            <span>© {new Date().getFullYear()} RentConnect. Built with React, Express & Prisma.</span>
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-brand-600">Login</Link>
              <Link to="/register" className="hover:text-brand-600">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-400">{label}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-ink-800">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-ink-500">
        {links.map((l) => <li key={l}><a href="#" className="transition hover:text-brand-600">{l}</a></li>)}
      </ul>
    </div>
  );
}
