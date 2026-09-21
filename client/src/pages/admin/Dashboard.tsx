import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, ClipboardList, Wrench, DollarSign, Home, CheckCircle, UserCheck } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../lib/api';
import { StatCard } from '../../components/StatCard';
import { PageHeader, StatSkeleton } from '../../components/ui';
import { currency } from '../../lib/format';

const REQ_COLORS = ['#f2911a', '#10b981', '#ef4444', '#c0c1d2'];
const COMP_COLORS = ['#f2911a', '#6538ea', '#10b981'];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.get('/stats/admin').then((res) => setData(res.data)); }, []);
  if (!data) return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Loading platform statistics…" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...Array(8)].map((_, i) => <StatSkeleton key={i} />)}</div>
    </div>
  );
  const s = data.stats;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform-wide statistics and monitoring." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={s.totalUsers} icon={<Users size={20} />} tone="brand" hint={`${s.owners} owners · ${s.tenants} tenants`} />
        <StatCard label="Properties" value={s.totalProperties} icon={<Building2 size={20} />} tone="violet" hint={`${s.available} available · ${s.occupied} occupied`} />
        <StatCard label="Rental Requests" value={s.totalRequests} icon={<ClipboardList size={20} />} tone="amber" hint={`${s.pendingRequests} pending`} />
        <StatCard label="Open Complaints" value={s.openComplaints} icon={<Wrench size={20} />} tone="red" />
        <StatCard label="Platform Revenue" value={currency(s.totalRevenue)} icon={<DollarSign size={20} />} tone="emerald" />
        <StatCard label="Occupied Units" value={s.occupied} icon={<Home size={20} />} tone="blue" />
        <StatCard label="Available Units" value={s.available} icon={<CheckCircle size={20} />} tone="emerald" />
        <StatCard label="Pending Listings" value={s.pendingListings} icon={<UserCheck size={20} />} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <h3 className="font-semibold text-ink-900">Platform Revenue</h3>
          <p className="text-sm text-ink-400">Last 6 months</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByMonth}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#9c9db6" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#9c9db6" tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => currency(v)} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#6538ea" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Donut title="Rental Requests" data={data.requestBreakdown} colors={REQ_COLORS} />
        <Donut title="Complaints" data={data.complaintBreakdown} colors={COMP_COLORS} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/users" className="card flex items-center gap-3 p-4 hover:shadow-soft"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Users size={18} /></div><span className="font-medium text-ink-700">Manage Users</span></Link>
        <Link to="/admin/properties" className="card flex items-center gap-3 p-4 hover:shadow-soft"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Building2 size={18} /></div><span className="font-medium text-ink-700">Manage Properties</span></Link>
        <Link to="/admin/requests" className="card flex items-center gap-3 p-4 hover:shadow-soft"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><ClipboardList size={18} /></div><span className="font-medium text-ink-700">Monitor Requests</span></Link>
        <Link to="/admin/complaints" className="card flex items-center gap-3 p-4 hover:shadow-soft"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"><Wrench size={18} /></div><span className="font-medium text-ink-700">Monitor Complaints</span></Link>
      </div>
    </div>
  );
}

function Donut({ title, data, colors }: { title: string; data: any[]; colors: string[] }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <div className="mt-2 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
        {data.map((b, i) => (
          <div key={b.name} className="flex items-center gap-1.5 text-ink-500">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i % colors.length] }} /> {b.name} ({b.value})
          </div>
        ))}
      </div>
    </div>
  );
}
