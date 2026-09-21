import { useEffect, useState } from 'react';
import { Wrench, Plus } from 'lucide-react';
import { api } from '../../lib/api';
import type { Complaint, Lease } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge, Modal } from '../../components/ui';
import { dateFmt } from '../../lib/format';

const CATEGORIES = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Pest', 'General'];

export default function TenantComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ propertyId: '', title: '', description: '', category: 'General', priority: 'Medium' });
  const [error, setError] = useState('');

  const load = () => Promise.all([
    api.get('/complaints/mine'),
    api.get('/leases/mine'),
  ]).then(([c, l]) => {
    setComplaints(c.data.complaints);
    setLeases(l.data.leases);
    if (l.data.leases[0]) setForm((f) => ({ ...f, propertyId: String(l.data.leases[0].propertyId) }));
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setError('');
    if (!form.propertyId || !form.title) { setError('Please select a property and enter a title.'); return; }
    await api.post('/complaints', { ...form, propertyId: Number(form.propertyId) });
    setShow(false);
    setForm({ propertyId: String(leases[0]?.propertyId || ''), title: '', description: '', category: 'General', priority: 'Medium' });
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Maintenance Complaints" subtitle="Report and track maintenance issues."
        action={<button className="btn-primary" onClick={() => setShow(true)} disabled={leases.length === 0}><Plus size={16} /> New Complaint</button>} />

      {complaints.length === 0 ? (
        <EmptyState icon={<Wrench size={40} />} title="No complaints filed"
          subtitle={leases.length === 0 ? 'You need an active rental to submit complaints.' : 'Report a maintenance issue and track its progress.'} />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink-900">{c.title}</h3>
                    <StatusBadge status={c.status} />
                    <StatusBadge status={c.priority} />
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{c.description}</p>
                  <p className="mt-2 text-xs text-ink-400">{c.category} · {c.property?.title} · {dateFmt(c.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={show} onClose={() => setShow(false)} title="Submit Maintenance Complaint">
        {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <label className="label">Property</label>
        <select className="input" value={form.propertyId} onChange={(e) => set('propertyId', e.target.value)}>
          {leases.map((l) => <option key={l.id} value={l.propertyId}>{l.property?.title}</option>)}
        </select>
        <label className="label mt-3">Title</label>
        <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Leaking faucet" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
        </div>
        <label className="label mt-3">Description</label>
        <textarea className="input h-24" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the issue…" />
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setShow(false)}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Submit</button>
        </div>
      </Modal>
    </div>
  );
}
