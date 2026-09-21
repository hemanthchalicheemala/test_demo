import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: number; type: ToastType; message: string }

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx | undefined>(undefined);

const styles: Record<ToastType, { icon: ReactNode; ring: string }> = {
  success: { icon: <CheckCircle2 size={18} className="text-emerald-500" />, ring: 'ring-emerald-100' },
  error: { icon: <XCircle size={18} className="text-red-500" />, ring: 'ring-red-100' },
  warning: { icon: <AlertTriangle size={18} className="text-amber-500" />, ring: 'ring-amber-100' },
  info: { icon: <Info size={18} className="text-brand-500" />, ring: 'ring-brand-100' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => remove(id), 3800);
  }, [remove]);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex animate-fade-in-up items-start gap-3 rounded-xl border border-ink-100 bg-white px-4 py-3 shadow-soft ring-1 ${styles[t.type].ring}`}>
            <div className="mt-0.5">{styles[t.type].icon}</div>
            <p className="flex-1 text-sm font-medium text-ink-700">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-ink-300 transition hover:text-ink-500"><X size={16} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) return { toast: () => {} };
  return ctx;
}
