import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, subtitle, action }: { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/60 py-14 px-6 text-center">
      {icon && <div className="text-slate-300">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-slate-400">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700',
  OCCUPIED: 'bg-slate-100 text-slate-600',
  PENDING: 'bg-amber-50 text-amber-700',
  ACCEPTED: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-600',
  CANCELLED: 'bg-slate-100 text-slate-500',
  PAID: 'bg-emerald-50 text-emerald-700',
  OVERDUE: 'bg-red-50 text-red-600',
  OPEN: 'bg-amber-50 text-amber-700',
  IN_PROGRESS: 'bg-blue-50 text-blue-600',
  RESOLVED: 'bg-emerald-50 text-emerald-700',
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status] || 'bg-slate-100 text-slate-600';
  return <span className={`badge ${cls}`}>{status.replace('_', ' ')}</span>;
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white shadow-soft`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">✕</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
