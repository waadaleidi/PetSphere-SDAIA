import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { readFileAsDataURL } from '@/lib/storage';

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  aspect?: 'square' | 'wide' | 'round';
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Upload photo',
  aspect = 'square',
  className = '',
}: ImageUploadProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const dataUrl = await readFileAsDataURL(file);
    onChange(dataUrl);
  };

  const shape =
    aspect === 'round'
      ? 'rounded-full'
      : aspect === 'wide'
      ? 'rounded-2xl aspect-video'
      : 'rounded-2xl aspect-square';

  return (
    <div className={className}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className={`relative overflow-hidden ${shape} border border-app w-full max-w-[14rem]`}>
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 p-2 bg-gradient-to-t from-black/50 to-transparent">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="p-2 rounded-full bg-white/90 text-ink-900 hover:bg-white transition"
              aria-label="Replace image"
            >
              <Upload size={16} />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-full bg-white/90 text-ink-900 hover:bg-white transition"
              aria-label="Delete image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 ${shape} w-full max-w-[14rem] border-2 border-dashed border-app text-soft hover:border-forest-400 hover:text-forest-600 transition-colors`}
        >
          <Upload size={22} />
          <span className="text-sm font-medium">{label}</span>
        </button>
      )}
    </div>
  );
}
