import { PawPrint } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' }[size];
  const icon = { sm: 18, md: 22, lg: 30 }[size];
  const text = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' }[size];
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims} rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 grid place-items-center text-white shadow-md`}
      >
        <PawPrint size={icon} strokeWidth={2.2} />
      </div>
      <span className={`font-serif font-semibold tracking-tight ${text}`}>
        Pet<span className="text-forest-600">Sphere</span>
      </span>
    </div>
  );
}
