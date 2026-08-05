import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Trash2, PawPrint, Smile, Frown, Meh, Zap, HeartPulse } from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/Modal';
import { ImageUpload } from '@/components/ImageUpload';
import { Select } from '@/components/Select';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/components/Toaster';
import { uid, formatDate, todayISO } from '@/lib/storage';
import type { Mood } from '@/types';

const moods: { value: Mood; label: string; icon: React.ComponentType<{ size?: number }>; color: string }[] = [
  { value: 'Happy', label: 'Happy', icon: Smile, color: 'text-forest-600' },
  { value: 'Calm', label: 'Calm', icon: Meh, color: 'text-forest-500' },
  { value: 'Energetic', label: 'Energetic', icon: Zap, color: 'text-gold-500' },
  { value: 'Anxious', label: 'Anxious', icon: Frown, color: 'text-orange-500' },
  { value: 'Sad', label: 'Sad', icon: Frown, color: 'text-blue-500' },
  { value: 'Sick', label: 'Sick', icon: HeartPulse, color: 'text-red-500' },
];

export default function JournalPage() {
  const { pets, activePet, setActivePetId } = usePet();
  const { data, setData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', mood: 'Happy' as Mood, date: todayISO(), photo: '' });

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={<PawPrint size={26} />}
        title="No pets yet"
        message="Add a pet to start writing a journal."
        action={<Link to="/app/pets" className="btn-primary">Add a pet</Link>}
      />
    );
  }

  const pet = activePet ?? pets[0];
  const entries = data.journal
    .filter((j) => j.petId === pet.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.body.trim() && !form.title.trim()) {
      toast('Add a title or some notes first.');
      return;
    }
    const entry = { id: uid(), petId: pet.id, createdAt: Date.now(), ...form };
    setData((d) => ({ ...d, journal: [...d.journal, entry] }));
    setForm({ title: '', body: '', mood: 'Happy', date: todayISO(), photo: '' });
    setModalOpen(false);
    toast('Journal entry saved.');
  };

  const remove = (id: string) => {
    setData((d) => ({ ...d, journal: d.journal.filter((j) => j.id !== id) }));
    toast('Entry removed.');
  };

  const moodMeta = (m: Mood) => moods.find((x) => x.value === m) ?? moods[0];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Journal</h1>
          <p className="text-soft mt-1">Daily notes, moods and memories.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={18} /> New entry
        </button>
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

      {entries.length === 0 ? (
        <div className="surface rounded-3xl p-10 text-center">
          <BookOpen size={32} className="mx-auto text-soft mb-3" />
          <p className="text-soft">No journal entries yet. Capture your first memory.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[var(--app-border)] hidden sm:block" />
          <ul className="space-y-4">
            {entries.map((j) => {
              const M = moodMeta(j.mood);
              return (
                <li key={j.id} className="relative sm:pl-12 animate-fade-in">
                  <div className="hidden sm:grid absolute left-0 top-4 h-8 w-8 rounded-full bg-forest-600 text-white place-items-center">
                    <M.icon size={16} />
                  </div>
                  <div className="surface rounded-3xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-serif text-lg font-semibold">{j.title || j.mood}</h3>
                        <p className="text-xs text-soft mt-0.5">{formatDate(j.date)} · {j.mood}</p>
                      </div>
                      <button onClick={() => remove(j.id)} className="p-2 rounded-lg hover:text-red-600 transition-colors shrink-0" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {j.photo && (
                      <img src={j.photo} alt="" className="rounded-2xl w-full max-h-64 object-cover mb-3" />
                    )}
                    {j.body && <p className="text-soft whitespace-pre-line leading-relaxed text-sm">{j.body}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New journal entry" maxWidth="max-w-lg">
        <form onSubmit={addEntry} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="A day at the park" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Date</label>
              <input type="date" className="input-base" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Mood</label>
              <Select value={form.mood} onChange={(v) => setForm({ ...form, mood: v as Mood })} options={moods.map((m) => ({ value: m.value, label: m.label }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <textarea className="input-base min-h-[110px] resize-y" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="What happened today?" />
          </div>
          <ImageUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label="Add photo" aspect="wide" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">Save entry</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
