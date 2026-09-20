import { useEffect, useState } from 'react';
import { Receipt, Plus, Check } from 'lucide-react';
import { api } from '../../lib/api';
import type { Payment, Lease } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge, Modal } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function OwnerPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ leaseId: '', amount: '', dueDate: '' });
  const [error, setError] = useState('');

  const load = () => Promise.all([
    api.get('/payments/received'),
    api.get('/leases/tenants'),
  ]).then(([p, l]) => {
    setPayments(p.data.payments);
    setLeases(l.data.leases);
  }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const markPaid = async (id: number) => { await api.patch(`/payments/${id}/pay`, { method: 'Recorded by owner' }); load(); };

  const record = async () => {
    setError('');
    const lease = leases.find((l) => String(l.id) === form.leaseId);
    if (!lease || !form.amount || !form.dueDate) { setError('Select a tenant, amount and due date.'); return; }
    await api.post('/payments', { leaseId: lease.id, propertyId: lease.propertyId, tenantId: lease.tenantId, amount: Number(form.amount), dueDate: form.dueDate });
    setShow(false);
    setForm({ leaseId: '', amount: '', dueDate: '' });
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Rent Payments" subtitle="Track and record rent across your properties."
        action={<button className="btn-primary" onClick={() => setShow(true)} disabled={leases.length === 0}><Plus size={16} /> Record Rent</button>} />

      {payments.length === 0 ? (
        <EmptyState icon={<Receipt size={40} />} title="No payments yet" subtitle="Record rent for your tenants to track payments." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Paid Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{p.tenant?.name}</td>
                    <td className="px-4 py-3 text-slate-500">{p.property?.title}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{currency(p.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{dateFmt(p.dueDate)}</td>
                    <td className="px-4 py-3 text-slate-500">{p.paidDate ? dateFmt(p.paidDate) : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {p.status !== 'PAID' && <button className="btn-secondary !py-1.5 !px-3 text-xs" onClick={() => markPaid(p.id)}><Check size={14} /> Mark Paid</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={show} onClose={() => setShow(false)} title="Record Rent Payment">
        {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <label className="label">Tenant / Property</label>
        <select className="input" value={form.leaseId} onChange={(e) => set('leaseId', e.target.value)}>
          <option value="">Select…</option>
          {leases.map((l) => <option key={l.id} value={l.id}>{l.tenant?.name} — {l.property?.title}</option>)}
        </select>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="label">Amount ($)</label>
            <input type="number" className="input" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
          </div>
          <div>
            <label className="label">Due Date</label>
            <input type="date" className="input" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setShow(false)}>Cancel</button>
          <button className="btn-primary" onClick={record}>Record</button>
        </div>
      </Modal>
    </div>
  );
}
