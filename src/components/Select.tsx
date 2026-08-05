import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  id?: string;
}

export function Select({ value, onChange, options, placeholder, id }: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="input-base flex items-center justify-between text-left"
      >
        <span className={selected ? '' : 'text-soft'}>
          {selected ? selected.label : placeholder ?? 'Select…'}
        </span>
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 mt-1.5 w-full surface rounded-xl overflow-hidden shadow-[var(--app-shadow-lg)] animate-scale-in max-h-60 overflow-y-auto">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--app-surface-2)] transition-colors ${
                o.value === value ? 'text-forest-600 font-medium' : ''
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
