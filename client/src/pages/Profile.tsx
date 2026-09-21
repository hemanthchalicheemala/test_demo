import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { PageHeader } from '../components/ui';
import { dateFmt } from '../lib/format';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await api.put('/users/me', form);
    updateUser(res.data.user);
    setSaved(true);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="My Profile" subtitle="Manage your personal information." />

      <div className="card p-6">
        <div className="flex items-center gap-4 border-b border-ink-100 pb-6">
          <img src={form.avatar || `https://i.pravatar.cc/120?u=${user?.email}`} alt="" className="h-20 w-20 rounded-full object-cover" />
          <div>
            <h2 className="text-lg font-semibold text-ink-900">{user?.name}</h2>
            <p className="text-sm text-ink-500">{user?.email}</p>
            <span className="badge mt-1 bg-brand-50 text-brand-700">{user?.role}</span>
          </div>
        </div>

        {saved && <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Profile updated successfully.</div>}

        <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div>
            <label className="label">Avatar URL</label>
            <input className="input" value={form.avatar} onChange={(e) => set('avatar', e.target.value)} placeholder="https://…" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Bio</label>
            <textarea className="input h-24" value={form.bio} onChange={(e) => set('bio', e.target.value)} />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between">
            <p className="text-xs text-ink-400">Member since {dateFmt(user?.createdAt)}</p>
            <button className="btn-primary" disabled={saving}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
