import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ClipboardList, Home, CalendarClock, CreditCard, Wrench, ArrowRight } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { StatCard } from '../../components/StatCard';
import { PageHeader, Spinner, StatusBadge } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#94a3b8'];

export default function TenantDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => { api.get('/stats/tenant').then((res) => setData(res.data)); }, []);
  if (!data) return <Spinner label="Loading dashboard…" />;

  const s = data.stats;
  const rental = data.currentRental;

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name.split(' ')[0]} 👋`} subtitle="Here's an overview of your rental activity."
        action={<Link to="/properties" className="btn-primary">Browse Properties</Link>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Applications" value={s.applications} icon={<ClipboardList size={20} />} tone="brand" hint={`${s.pendingApplications} pending`} />
        <StatCard label="Current Rental" value={s.currentRentals} icon={<Home size={20} />} tone="emerald" />
        <StatCard label="Next Rent Due" value={s.nextRentDue ? currency(s.nextRentDue.amount) : '—'} icon={<CalendarClock size={20} />} tone="amber" hint={s.nextRentDue ? dateFmt(s.nextRentDue.dueDate) : 'All paid'} />
        <StatCard label="Total Paid" value={currency(s.totalPaid)} icon={<CreditCard size={20} />} tone="blue" />
        <StatCard label="Open Complaints" value={s.openComplaints} icon={<Wrench size={20} />} tone="red" />
        <StatCard label="Saved Homes" value={s.applications} icon={<Heart size={20} />} tone="violet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-800">Payment History</h3>
          <p className="text-sm text-slate-400">Rent paid over the last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.paidHistory}>
                <defs>
                  <linearGradient id="pay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3366ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => currency(v)} />
                <Area type="monotone" dataKey="value" stroke="#3366ff" strokeWidth={2} fill="url(#pay)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-800">Applications</h3>
          <p className="text-sm text-slate-400">Status breakdown</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.applicationBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {data.applicationBreakdown.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {data.applicationBreakdown.map((b: any, i: number) => (
              <div key={b.name} className="flex items-center gap-2 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {b.name} ({b.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {rental && (
        <div className="card mt-6 overflow-hidden">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <img src={rental.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=70'} alt="" className="h-32 w-full rounded-xl object-cover sm:w-48" />
            <div className="flex-1">
              <span className="badge bg-emerald-50 text-emerald-700">Current Rental</span>
              <h3 className="mt-2 text-lg font-semibold text-slate-800">{rental.property?.title}</h3>
              <p className="text-sm text-slate-500">{rental.property?.address}, {rental.property?.city}</p>
              <p className="mt-2 text-brand-600 font-semibold">{currency(rental.rent)}/mo · Since {dateFmt(rental.startDate)}</p>
            </div>
            <Link to="/tenant/agreement" className="btn-secondary">View Agreement <ArrowRight size={16} /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
