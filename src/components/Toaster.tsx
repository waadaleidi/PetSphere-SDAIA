import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

let listeners: ((t: Toast) => void)[] = [];
let counter = 0;

export function toast(message: string) {
  const t = { id: ++counter, message };
  listeners.forEach((l) => l(t));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((cur) => [...cur, t]);
      setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== t.id)), 2600);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full surface shadow-[var(--app-shadow-lg)] text-sm font-medium animate-slide-up"
        >
          <CheckCircle2 size={18} className="text-forest-500" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
