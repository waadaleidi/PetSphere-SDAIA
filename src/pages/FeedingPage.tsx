import { useState } from 'react';
import { Utensils, Sun, Sandwich, Moon, Droplets, PawPrint, Check } from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/components/Toaster';
import { todayISO, uid, formatDate } from '@/lib/storage';
import type { FeedingEntry } from '@/types';
import { Link } from 'react-router-dom';

const meals = [
  { key: 'breakfast' as const, label: 'Breakfast', icon: Sun },
  { key: 'lunch' as const, label: 'Lunch', icon: Sandwich },
  { key: 'dinner' as const, label: 'Dinner', icon: Moon },
  { key: 'water' as const, label: 'Water', icon: Droplets },
];

export default function FeedingPage() {
  const { pets, activePet, setActivePetId } = usePet();
  const { data, setData } = useAuth();
  const [selectedDate, setSelectedDate] = useState(todayISO());

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={<PawPrint size={26} />}
        title="No pets yet"
        message="Add a pet to start tracking feeding schedules."
        action={<Link to="/app/pets" className="btn-primary">Add a pet</Link>}
      />
    );
  }

  const pet = activePet ?? pets[0];
  const feeding = data.feedings.find((f) => f.petId === pet.id && f.date === selectedDate);

  const ensureFeeding = (): FeedingEntry => {
    if (feeding) return feeding;
    const entry: FeedingEntry = {
      id: uid(),
      petId: pet.id,
      date: selectedDate,
      breakfast: false,
      lunch: false,
      dinner: false,
      water: false,
    };
    setData((d) => ({ ...d, feedings: [...d.feedings, entry] }));
    return entry;
  };

  const toggle = (key: 'breakfast' | 'lunch' | 'dinner' | 'water') => {
    const current = ensureFeeding();
    setData((d) => ({
      ...d,
      feedings: d.feedings.map((f) =>
        f.id === current.id ? { ...f, [key]: !f[key] } : f
      ),
    }));
  };

  const mealsDone = feeding ? [feeding.breakfast, feeding.lunch, feeding.dinner].filter(Boolean).length : 0;
  const mealPct = Math.round((mealsDone / 3) * 100);

  const recent = data.feedings
    .filter((f) => f.petId === pet.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Feeding</h1>
        <p className="text-soft mt-1">Track meals and water for your pet.</p>
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

      {/* Date + progress */}
      <div className="surface rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-soft">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-base !w-auto"
            />
          </div>
          <div className="flex-1 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Meal progress</span>
              <span className="text-sm text-soft">{mealsDone}/3</span>
            </div>
            <div className="h-3 rounded-full bg-[var(--app-surface-2)] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-forest-400 to-forest-600 rounded-full transition-all duration-500" style={{ width: `${mealPct}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((m) => {
            const done = feeding ? feeding[m.key] : false;
            return (
              <button
                key={m.key}
                onClick={() => {
                  toggle(m.key);
                  toast(`${m.label} ${done ? 'unchecked' : 'marked complete'}`);
                }}
                className={`rounded-2xl p-5 border-2 transition-all text-left ${
                  done
                    ? 'border-forest-400 bg-forest-50 dark:bg-forest-800/40'
                    : 'border-app surface hover:border-forest-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center ${done ? 'bg-forest-600 text-white' : 'bg-[var(--app-surface-2)] text-forest-600'}`}>
                    <m.icon size={20} />
                  </div>
                  {done && <Check size={18} className="text-forest-600" />}
                </div>
                <p className="font-medium">{m.label}</p>
                <p className="text-xs text-soft mt-0.5">{done ? 'Completed' : 'Mark as done'}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent history */}
      <div className="surface rounded-3xl p-6">
        <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
          <Utensils size={20} className="text-forest-600" /> Recent days
        </h3>
        {recent.length === 0 ? (
          <p className="text-soft text-sm">No feeding history yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((f) => {
              const count = [f.breakfast, f.lunch, f.dinner].filter(Boolean).length;
              return (
                <li key={f.id} className="flex items-center justify-between p-3 rounded-2xl surface-2">
                  <span className="font-medium text-sm">{formatDate(f.date)}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      {(['breakfast', 'lunch', 'dinner'] as const).map((mk) => (
                        <span key={mk} className={`h-2.5 w-2.5 rounded-full ${f[mk] ? 'bg-forest-500' : 'bg-[var(--app-border)]'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-soft w-10 text-right">{count}/3</span>
                    <Droplets size={15} className={f.water ? 'text-forest-500' : 'text-[var(--app-border)]'} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
