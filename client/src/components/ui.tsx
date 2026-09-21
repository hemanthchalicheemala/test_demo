import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card flex items-center gap-4 p-5">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, subtitle, action }: { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-200 bg-white/60 py-16 px-6 text-center">
      {icon && (
        <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">{icon}</div>
      )}
      <h3 className="font-display text-base font-semibold text-ink-800">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-ink-400">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  OCCUPIED: 'bg-ink-100 text-ink-600 ring-1 ring-ink-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  ACCEPTED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  REJECTED: 'bg-red-50 text-red-600 ring-1 ring-red-100',
  CANCELLED: 'bg-ink-100 text-ink-500 ring-1 ring-ink-200',
  PAID: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  OVERDUE: 'bg-red-50 text-red-600 ring-1 ring-red-100',
  OPEN: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  IN_PROGRESS: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  High: 'bg-red-50 text-red-600 ring-1 ring-red-100',
  Medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  Low: 'bg-ink-100 text-ink-600 ring-1 ring-ink-200',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status] || 'bg-ink-100 text-ink-600 ring-1 ring-ink-200';
  const dot: Record<string, string> = {
    AVAILABLE: 'bg-emerald-500', PAID: 'bg-emerald-500', ACCEPTED: 'bg-emerald-500', RESOLVED: 'bg-emerald-500',
    PENDING: 'bg-amber-500', OPEN: 'bg-amber-500', OVERDUE: 'bg-red-500', REJECTED: 'bg-red-500',
    IN_PROGRESS: 'bg-brand-500', OCCUPIED: 'bg-ink-400', CANCELLED: 'bg-ink-400',
  };
  return (
    <span className={`badge ${cls}`}>
      {dot[status] && <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />}
      {status.replace('_', ' ')}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full animate-fade-in-up ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white shadow-soft`}>
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-600"><X size={18} /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
