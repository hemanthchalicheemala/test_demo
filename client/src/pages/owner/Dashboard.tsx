import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle, Home, Users, ClipboardList, DollarSign, Wrench, Plus } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { StatCard } from '../../components/StatCard';
import { PageHeader, Spinner } from '../../components/ui';
import { currency } from '../../lib/format';

const COLORS = ['#10b981', '#94a3b8'];

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.get('/stats/owner').then((res) => setData(res.data)); }, []);
  if (!data) return <Spinner label="Loading dashboard…" />;

  const s = data.stats;

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name.split(' ')[0]} 👋`} subtitle="Your property portfolio at a glance."
        action={<Link to="/owner/properties/new" className="btn-primary"><Plus size={16} /> Add Property</Link>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Properties" value={s.totalProperties} icon={<Building2 size={20} />} tone="brand" />
        <StatCard label="Available" value={s.available} icon={<CheckCircle size={20} />} tone="emerald" />
        <StatCard label="Occupied" value={s.occupied} icon={<Home size={20} />} tone="blue" />
        <StatCard label="Total Tenants" value={s.totalTenants} icon={<Users size={20} />} tone="violet" />
        <StatCard label="Pending Requests" value={s.pendingRequests} icon={<ClipboardList size={20} />} tone="amber" />
        <StatCard label="Pending Rent" value={currency(s.pendingRent)} icon={<DollarSign size={20} />} tone="red" />
        <StatCard label="Collected Rent" value={currency(s.collectedRent)} icon={<DollarSign size={20} />} tone="emerald" />
        <StatCard label="Open Complaints" value={s.openComplaints} icon={<Wrench size={20} />} tone="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-800">Rent Collected</h3>
          <p className="text-sm text-slate-400">Revenue over the last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByMonth}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => currency(v)} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#3366ff" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-800">Occupancy</h3>
          <p className="text-sm text-slate-400">Available vs occupied</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.propertyStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {data.propertyStatus.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {data.propertyStatus.map((b: any, i: number) => (
              <div key={b.name} className="flex items-center gap-2 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {b.name} ({b.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/owner/requests" icon={<ClipboardList size={18} />} label="Review Requests" />
        <QuickLink to="/owner/payments" icon={<DollarSign size={18} />} label="Rent Payments" />
        <QuickLink to="/owner/complaints" icon={<Wrench size={18} />} label="Maintenance" />
        <QuickLink to="/owner/announcements" icon={<Users size={18} />} label="Post Notice" />
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="card flex items-center gap-3 p-4 transition hover:shadow-soft">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
      <span className="font-medium text-slate-700">{label}</span>
    </Link>
  );
}
