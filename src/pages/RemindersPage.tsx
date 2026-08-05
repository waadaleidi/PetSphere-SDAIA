import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus, Trash2, Check, PawPrint, Syringe, Utensils, Pill, Stethoscope, CalendarHeart } from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/components/Toaster';
import { uid, formatDate, relativeDays, todayISO } from '@/lib/storage';
import type { ReminderType } from '@/types';

const typeMeta: Record<ReminderType, { icon: React.ComponentType<{ size?: number }>; color: string }> = {
  Vaccine: { icon: Syringe, color: 'text-forest-600' },
  Food: { icon: Utensils, color: 'text-gold-500' },
  Medicine: { icon: Pill, color: 'text-blue-500' },
  Vet: { icon: Stethoscope, color: 'text-purple-500' },
  Other: { icon: CalendarHeart, color: 'text-forest-500' },
};

const typeOptions = [
  { value: 'Vaccine', label: 'Vaccine' },
  { value: 'Food', label: 'Food' },
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Vet', label: 'Vet appointment' },
  { value: 'Other', label: 'Other' },
];

export default function RemindersPage() {
  const { pets, activePet, setActivePetId } = usePet();
  const { data, setData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Vaccine' as ReminderType, dueDate: todayISO(), time: '09:00', notes: '', petId: '' });

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={<PawPrint size={26} />}
        title="No pets yet"
        message="Add a pet to start creating reminders."
        action={<Link to="/app/pets" className="btn-primary">Add a pet</Link>}
      />
    );
  }

  const reminders = data.reminders
    .filter((r) => pets.some((p) => p.id === r.petId))
    .sort((a, b) => (a.done === b.done ? a.dueDate.localeCompare(b.dueDate) : a.done ? 1 : -1));

  const toggleDone = (id: string) => {
    setData((d) => ({
      ...d,
      reminders: d.reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    }));
  };

  const remove = (id: string) => {
    setData((d) => ({ ...d, reminders: d.reminders.filter((r) => r.id !== id) }));
    toast('Reminder removed.');
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast('Please enter a title.');
      return;
    }
    const petId = form.petId || activePet?.id || pets[0].id;
    const reminder = {
      id: uid(),
      ownerId: pets.find((p) => p.id === petId)!.ownerId,
      done: false,
      ...form,
      petId,
    };
    setData((d) => ({ ...d, reminders: [...d.reminders, reminder] }));
    setForm({ title: '', type: 'Vaccine', dueDate: todayISO(), time: '09:00', notes: '', petId: '' });
    setModalOpen(false);
    toast('Reminder created.');
  };

  const petName = (id: string) => pets.find((p) => p.id === id)?.name ?? 'Unknown';

  const pending = reminders.filter((r) => !r.done);
  const done = reminders.filter((r) => r.done);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Reminders</h1>
          <p className="text-soft mt-1">Vaccines, food, medicine and appointments.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={18} /> New reminder
        </button>
      </div>

      {pets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePetId(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border shrink-0 transition-colors ${
                p.id === (activePet?.id ?? pets[0].id) ? 'border-forest-400 bg-forest-50 text-forest-700 dark:bg-forest-800/40 dark:text-forest-100' : 'border-app text-soft hover:text-[var(--app-text)]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="surface rounded-3xl p-10 text-center">
          <Bell size={32} className="mx-auto text-soft mb-3" />
          <p className="text-soft">No reminders yet. Create one to stay on track.</p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3">Pending ({pending.length})</h3>
            <ul className="space-y-2.5">
              {pending.map((r) => {
                const days = relativeDays(r.dueDate);
                const meta = typeMeta[r.type];
                return (
                  <li key={r.id} className="surface rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
                    <button
                      onClick={() => toggleDone(r.id)}
                      className="h-7 w-7 rounded-full border-2 border-app hover:border-forest-400 grid place-items-center shrink-0 transition-colors"
                      aria-label="Mark done"
                    />
                    <div className={`h-9 w-9 rounded-xl bg-[var(--app-surface-2)] grid place-items-center shrink-0 ${meta.color}`}>
                      <meta.icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{r.title}</p>
                      <p className="text-xs text-soft">{petName(r.petId)} · {formatDate(r.dueDate)} at {r.time}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      days < 0 ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' :
                      days === 0 ? 'bg-gold-300/40 text-gold-500' :
                      'bg-forest-50 text-forest-700 dark:bg-forest-800/50 dark:text-forest-200'
                    }`}>
                      {days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d`}
                    </span>
                    <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:text-red-600 transition-colors shrink-0" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {done.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-semibold mb-3 text-soft">Completed ({done.length})</h3>
              <ul className="space-y-2.5">
                {done.map((r) => {
                  const meta = typeMeta[r.type];
                  return (
                    <li key={r.id} className="surface rounded-2xl p-4 flex items-center gap-3 opacity-60">
                      <button
                        onClick={() => toggleDone(r.id)}
                        className="h-7 w-7 rounded-full bg-forest-600 text-white grid place-items-center shrink-0"
                        aria-label="Mark pending"
                      >
                        <Check size={15} />
                      </button>
                      <div className={`h-9 w-9 rounded-xl bg-[var(--app-surface-2)] grid place-items-center shrink-0 ${meta.color}`}>
                        <meta.icon size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate line-through">{r.title}</p>
                        <p className="text-xs text-soft">{petName(r.petId)} · {formatDate(r.dueDate)}</p>
                      </div>
                      <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:text-red-600 transition-colors shrink-0" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New reminder" maxWidth="max-w-lg">
        <form onSubmit={add} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Rabies booster" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <Select value={form.type} onChange={(v) => setForm({ ...form, type: v as ReminderType })} options={typeOptions} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Pet</label>
              <Select
                value={form.petId || activePet?.id || pets[0].id}
                onChange={(v) => setForm({ ...form, petId: v })}
                options={pets.map((p) => ({ value: p.id, label: p.name }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Due date</label>
              <input type="date" className="input-base" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Time</label>
              <input type="time" className="input-base" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <textarea className="input-base min-h-[70px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">Create reminder</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
