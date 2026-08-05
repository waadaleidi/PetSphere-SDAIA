import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Images, Plus, Trash2, PawPrint, X, Download } from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/components/Toaster';
import { uid, readFileAsDataURL } from '@/lib/storage';

export default function GalleryPage() {
  const { pets, activePet, setActivePetId } = usePet();
  const { data, setData } = useAuth();
  const [caption, setCaption] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={<PawPrint size={26} />}
        title="No pets yet"
        message="Add a pet to start building a gallery."
        action={<Link to="/app/pets" className="btn-primary">Add a pet</Link>}
      />
    );
  }

  const pet = activePet ?? pets[0];
  const images = data.gallery
    .filter((g) => g.petId === pet.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) return;
    const dataUrls = await Promise.all(valid.map((f) => readFileAsDataURL(f)));
    const newImages = dataUrls.map((d) => ({
      id: uid(),
      petId: pet.id,
      data: d,
      caption,
      createdAt: Date.now(),
    }));
    setData((d) => ({ ...d, gallery: [...d.gallery, ...newImages] }));
    setCaption('');
    toast(`${valid.length} photo${valid.length > 1 ? 's' : ''} added.`);
  };

  const removeImage = (id: string) => {
    setData((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== id) }));
    toast('Photo removed.');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Gallery</h1>
        <p className="text-soft mt-1">A collection of your favorite moments.</p>
      </div>

      {pets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePetId(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border shrink-0 transition-colors ${
                p.id === pet.id ? 'border-forest-400 bg-forest-50 text-forest-700 dark:bg-forest-800/40 dark:text-forest-100' : 'border-app text-soft hover:text-[var(--app-text)]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Upload */}
      <div className="surface rounded-3xl p-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <button onClick={() => inputRef.current?.click()} className="btn-primary">
            <Plus size={18} /> Upload photos
          </button>
          <input
            type="text"
            className="input-base flex-1"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="surface rounded-3xl p-10 text-center">
          <Images size={32} className="mx-auto text-soft mb-3" />
          <p className="text-soft">No photos yet. Upload your first pet photo above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden surface animate-fade-in">
              <img src={img.data} alt={img.caption || 'pet'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                {img.caption && <p className="text-white text-xs font-medium truncate mb-2">{img.caption}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setLightbox(img.data)} className="p-2 rounded-full bg-white/90 text-ink-900 hover:bg-white transition" aria-label="Preview">
                    <Images size={14} />
                  </button>
                  <a href={img.data} download className="p-2 rounded-full bg-white/90 text-ink-900 hover:bg-white transition" aria-label="Download">
                    <Download size={14} />
                  </a>
                  <button onClick={() => removeImage(img.id)} className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-white transition" aria-label="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
            <X size={22} />
          </button>
          <img src={lightbox} alt="preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain" />
        </div>
      )}
    </div>
  );
}
