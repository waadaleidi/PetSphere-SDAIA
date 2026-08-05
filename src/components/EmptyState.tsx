import { AlertTriangle } from 'lucide-react';

export function EmptyState({
  title,
  message,
  action,
  icon,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
      <div className="h-16 w-16 rounded-3xl surface-2 grid place-items-center text-forest-600 mb-5">
        {icon ?? <AlertTriangle size={26} />}
      </div>
      <h3 className="text-xl font-semibold mb-1.5">{title}</h3>
      <p className="text-soft max-w-sm mb-5">{message}</p>
      {action}
    </div>
  );
}
