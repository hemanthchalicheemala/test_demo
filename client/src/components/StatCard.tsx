import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: 'brand' | 'emerald' | 'amber' | 'red' | 'violet' | 'blue';
  hint?: string;
}

const tones: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
  blue: 'bg-blue-50 text-blue-600',
};

export function StatCard({ label, value, icon, tone = 'brand', hint }: Props) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
