import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Payment } from '../../types';
import { PageHeader, Spinner, EmptyState, StatusBadge, Modal } from '../../components/ui';
import { currency, dateFmt } from '../../lib/format';

export default function TenantPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payTarget, setPayTarget] = useState<Payment | null>(null);
  const [method, setMethod] = useState('Card');

  const load = () => api.get('/payments/mine').then((res) => setPayments(res.data.payments)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const pay = async () => {
    if (!payTarget) return;
    await api.patch(`/payments/${payTarget.id}/pay`, { method });
    setPayTarget(null);
    load();
  };

  if (loading) return <Spinner />;

  const outstanding = payments.filter((p) => p.status !== 'PAID');
  const totalDue = outstanding.reduce((s, p) => s + p.amount, 0);
  const paid = payments.filter((p) => p.status === 'PAID');

  return (
    <div>
      <PageHeader title="Rent & Payments" subtitle="Pay your rent and review payment history." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500">Outstanding Balance</p><p className="text-2xl font-bold text-red-600">{currency(totalDue)}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Total Paid</p><p className="text-2xl font-bold text-emerald-600">{currency(paid.reduce((s, p) => s + p.amount, 0))}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">Payments Made</p><p className="text-2xl font-bold text-slate-800">{paid.length}</p></div>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={<CreditCard size={40} />} title="No payments yet" subtitle="Payments will appear here once you have an active rental." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
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
                    <td className="px-4 py-3 font-medium text-slate-700">{p.property?.title}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{currency(p.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{dateFmt(p.dueDate)}</td>
                    <td className="px-4 py-3 text-slate-500">{p.paidDate ? dateFmt(p.paidDate) : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {p.status !== 'PAID' ? (
                        <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => setPayTarget(p)}>Pay Now</button>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-xs text-emerald-600"><CheckCircle2 size={14} /> Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!payTarget} onClose={() => setPayTarget(null)} title="Pay Rent">
        {payTarget && (
          <div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{payTarget.property?.title}</p>
              <p className="text-2xl font-bold text-brand-600">{currency(payTarget.amount)}</p>
              <p className="text-xs text-slate-400">Due {dateFmt(payTarget.dueDate)}</p>
            </div>
            <label className="label mt-4">Payment Method</label>
            <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>Card</option><option>Bank Transfer</option><option>Online</option><option>Cash</option>
            </select>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setPayTarget(null)}>Cancel</button>
              <button className="btn-success" onClick={pay}>Confirm Payment</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
