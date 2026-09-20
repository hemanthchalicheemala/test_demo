import { useEffect, useState } from 'react';
import { Trash2, Search } from 'lucide-react';
import { api } from '../../lib/api';
import type { User } from '../../types';
import { PageHeader, Spinner } from '../../components/ui';
import { dateFmt } from '../../lib/format';

const roleStyle: Record<string, string> = {
  ADMIN: 'bg-violet-50 text-violet-700',
  OWNER: 'bg-brand-50 text-brand-700',
  TENANT: 'bg-emerald-50 text-emerald-700',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('ALL');

  const load = () => api.get('/users').then((res) => setUsers(res.data.users)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Delete this user and all their data?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  if (loading) return <Spinner />;
  const filtered = users.filter((u) =>
    (role === 'ALL' || u.role === role) &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Manage Users" subtitle="View and manage platform users." />

      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input className="input !pl-10" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input sm:w-48" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ALL">All roles</option><option value="OWNER">Owners</option><option value="TENANT">Tenants</option><option value="ADMIN">Admins</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || `https://i.pravatar.cc/60?u=${u.email}`} alt="" className="h-9 w-9 rounded-full object-cover" />
                      <div><p className="font-medium text-slate-700">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`badge ${roleStyle[u.role]}`}>{u.role}</span></td>
                  <td className="px-4 py-3 text-slate-500">{u.city || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{u._count?.properties || 0} props · {u._count?.requests || 0} reqs · {u._count?.complaints || 0} complaints</td>
                  <td className="px-4 py-3 text-slate-500">{dateFmt(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'ADMIN' && <button onClick={() => remove(u.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
