import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: 'brand' | 'emerald' | 'amber' | 'red' | 'violet' | 'blue' | 'accent';
  hint?: string;
  trend?: { value: string; up?: boolean };
}

const tones: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
  blue: 'bg-blue-50 text-blue-600',
  accent: 'bg-accent-50 text-accent-600',
};

export function StatCard({ label, value, icon, tone = 'brand', hint, trend }: Props) {
  return (
    <div className="card card-hover group relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-50/60 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-ink-500">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold leading-tight text-ink-900">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
      </div>
      {trend && (
        <div className="relative mt-3 flex items-center gap-1 text-xs font-medium">
          <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 ${trend.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend.value}
          </span>
          <span className="text-ink-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
