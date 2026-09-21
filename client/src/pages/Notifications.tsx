import { useEffect, useState } from 'react';
import { Bell, Check, CreditCard, Wrench, ClipboardList, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import type { Notification } from '../types';
import { PageHeader, Spinner, EmptyState } from '../components/ui';
import { timeAgo } from '../lib/format';

const iconFor = (type: string) => {
  switch (type) {
    case 'payment': return <CreditCard size={18} />;
    case 'complaint': return <Wrench size={18} />;
    case 'request': return <ClipboardList size={18} />;
    case 'success': return <CheckCircle2 size={18} />;
    case 'warning': return <AlertTriangle size={18} />;
    default: return <Info size={18} />;
  }
};
const toneFor = (type: string) => {
  switch (type) {
    case 'payment': return 'bg-blue-50 text-blue-600';
    case 'complaint': return 'bg-amber-50 text-amber-600';
    case 'request': return 'bg-brand-50 text-brand-600';
    case 'success': return 'bg-emerald-50 text-emerald-600';
    case 'warning': return 'bg-red-50 text-red-600';
    default: return 'bg-ink-100 text-ink-500';
  }
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/notifications').then((res) => setItems(res.data.notifications)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => { await api.patch(`/notifications/${id}/read`); load(); };
  const markAll = async () => { await api.patch('/notifications/read-all'); load(); };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Notifications" subtitle="Stay up to date with your activity."
        action={<button className="btn-secondary" onClick={markAll}><Check size={16} /> Mark all read</button>} />

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState icon={<Bell size={40} />} title="No notifications yet" subtitle="We'll let you know when something happens." />
      ) : (
        <div className="card divide-y divide-ink-100">
          {items.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 ${!n.read ? 'bg-brand-50/30' : ''}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneFor(n.type)}`}>{iconFor(n.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-ink-900">{n.title}</p>
                  <span className="text-xs text-ink-400">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-500">{n.message}</p>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-brand-600" title="Mark read">
                  <Check size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
