import { useEffect, useState } from 'react';
import { Megaphone, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Announcement, Property } from '../../types';
import { PageHeader, Spinner, EmptyState, Modal } from '../../components/ui';
import { timeAgo } from '../../lib/format';

export default function OwnerAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', propertyId: '' });

  const load = () => Promise.all([
    api.get('/announcements/mine'),
    api.get('/properties/mine'),
  ]).then(([a, p]) => { setItems(a.data.announcements); setProperties(p.data.properties); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const post = async () => {
    if (!form.title || !form.body) return;
    await api.post('/announcements', { title: form.title, body: form.body, propertyId: form.propertyId ? Number(form.propertyId) : undefined });
    setShow(false); setForm({ title: '', body: '', propertyId: '' }); load();
  };

  const remove = async (id: number) => { await api.delete(`/announcements/${id}`); load(); };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Announcements & Notices" subtitle="Broadcast notices to your current tenants."
        action={<button className="btn-primary" onClick={() => setShow(true)}><Plus size={16} /> New Notice</button>} />

      {items.length === 0 ? (
        <EmptyState icon={<Megaphone size={40} />} title="No announcements" subtitle="Post a notice to keep your tenants informed." />
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Megaphone size={18} /></div>
                  <div>
                    <h3 className="font-semibold text-ink-900">{a.title}</h3>
                    <p className="mt-1 text-sm text-ink-500">{a.body}</p>
                    <p className="mt-2 text-xs text-ink-400">{a.property ? a.property.title + ' · ' : ''}{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => remove(a.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={show} onClose={() => setShow(false)} title="Post Announcement">
        <label className="label">Title</label>
        <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Scheduled maintenance" />
        <label className="label mt-3">Scope</label>
        <select className="input" value={form.propertyId} onChange={(e) => set('propertyId', e.target.value)}>
          <option value="">All my tenants</option>
          {properties.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <label className="label mt-3">Message</label>
        <textarea className="input h-28" value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Write your notice…" />
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setShow(false)}>Cancel</button>
          <button className="btn-primary" onClick={post}>Post Notice</button>
        </div>
      </Modal>
    </div>
  );
}
