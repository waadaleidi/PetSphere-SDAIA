import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Syringe,
  Stethoscope,
  ShieldAlert,
  Scale,
  CalendarHeart,
  Pill,
  Plus,
  Trash2,
  PawPrint,
} from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/components/Toaster';
import { uid, formatDate, todayISO } from '@/lib/storage';
import type { AppData } from '@/types';

type Tab = 'vaccines' | 'medical' | 'allergies' | 'weight' | 'visits' | 'medications';

const tabs: { key: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'vaccines', label: 'Vaccines', icon: Syringe },
  { key: 'medical', label: 'History', icon: Stethoscope },
  { key: 'allergies', label: 'Allergies', icon: ShieldAlert },
  { key: 'weight', label: 'Weight', icon: Scale },
  { key: 'visits', label: 'Vet visits', icon: CalendarHeart },
  { key: 'medications', label: 'Medications', icon: Pill },
];

export default function HealthPage() {
  const { pets, activePet, setActivePetId } = usePet();
  const { data, setData } = useAuth();
  const [tab, setTab] = useState<Tab>('vaccines');
  const [modalOpen, setModalOpen] = useState(false);

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={<PawPrint size={26} />}
        title="No pets yet"
        message="Add a pet to start tracking health records."
        action={<Link to="/app/pets" className="btn-primary">Add a pet</Link>}
      />
    );
  }

  const pet = activePet ?? pets[0];
  const petId = pet.id;

  const remove = (collection: keyof typeof data, id: string) => {
    setData((d) => ({ ...d, [collection]: (d[collection] as { id: string }[]).filter((x) => x.id !== id) }));
    toast('Entry removed.');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Health</h1>
        <p className="text-soft mt-1">Vaccines, history, allergies, weight and more.</p>
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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border shrink-0 transition-colors ${
              tab === t.key ? 'border-forest-400 bg-forest-50 text-forest-700 dark:bg-forest-800/40 dark:text-forest-100' : 'border-app text-soft hover:text-[var(--app-text)]'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="surface rounded-3xl p-6">
        {tab === 'vaccines' && <VaccinesPanel petId={petId} data={data} setData={setData} onAdd={() => setModalOpen(true)} onRemove={(id: string) => remove('vaccines', id)} />}
        {tab === 'medical' && <MedicalPanel petId={petId} data={data} setData={setData} onAdd={() => setModalOpen(true)} onRemove={(id: string) => remove('medicalHistory', id)} />}
        {tab === 'allergies' && <AllergiesPanel petId={petId} data={data} setData={setData} onAdd={() => setModalOpen(true)} onRemove={(id: string) => remove('allergies', id)} />}
        {tab === 'weight' && <WeightPanel petId={petId} data={data} setData={setData} onAdd={() => setModalOpen(true)} onRemove={(id: string) => remove('weights', id)} />}
        {tab === 'visits' && <VisitsPanel petId={petId} data={data} setData={setData} onAdd={() => setModalOpen(true)} onRemove={(id: string) => remove('vetVisits', id)} />}
        {tab === 'medications' && <MedicationsPanel petId={petId} data={data} setData={setData} onAdd={() => setModalOpen(true)} onRemove={(id: string) => remove('medications', id)} />}
      </div>

      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tab={tab}
        petId={petId}
        setData={setData}
      />
    </div>
  );
}

function PanelHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      <button onClick={onAdd} className="btn-ghost !py-2 !px-3.5 text-sm">
        <Plus size={16} /> Add
      </button>
    </div>
  );
}

function ListRow({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <li className="flex items-start gap-3 p-3.5 rounded-2xl surface-2">
      <div className="min-w-0 flex-1">{children}</div>
      <button onClick={onDelete} className="p-2 rounded-lg hover:text-red-600 transition-colors shrink-0" aria-label="Delete">
        <Trash2 size={16} />
      </button>
    </li>
  );
}

function Empty({ message }: { message: string }) {
  return <p className="text-soft text-sm py-6 text-center">{message}</p>;
}

function VaccinesPanel({ petId, data, onAdd, onRemove }: any) {
  const items = data.vaccines.filter((v: any) => v.petId === petId).sort((a: any, b: any) => b.date.localeCompare(a.date));
  return (
    <>
      <PanelHeader title="Vaccines" onAdd={onAdd} />
      {items.length === 0 ? <Empty message="No vaccines recorded yet." /> : (
        <ul className="space-y-2.5">
          {items.map((v: any) => (
            <ListRow key={v.id} onDelete={() => onRemove(v.id)}>
              <p className="font-medium text-sm">{v.name}</p>
              <p className="text-xs text-soft mt-0.5">Given {formatDate(v.date)} · Next due {formatDate(v.nextDue)}</p>
              {v.vet && <p className="text-xs text-soft">Vet: {v.vet}</p>}
              {v.notes && <p className="text-xs text-soft mt-1">{v.notes}</p>}
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}

function MedicalPanel({ petId, data, onAdd, onRemove }: any) {
  const items = data.medicalHistory.filter((m: any) => m.petId === petId).sort((a: any, b: any) => b.date.localeCompare(a.date));
  return (
    <>
      <PanelHeader title="Medical history" onAdd={onAdd} />
      {items.length === 0 ? <Empty message="No medical history recorded." /> : (
        <ul className="space-y-2.5">
          {items.map((m: any) => (
            <ListRow key={m.id} onDelete={() => onRemove(m.id)}>
              <p className="font-medium text-sm">{m.title}</p>
              <p className="text-xs text-soft mt-0.5">{formatDate(m.date)} · {m.vet || 'No vet'}</p>
              {m.description && <p className="text-xs text-soft mt-1">{m.description}</p>}
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}

function AllergiesPanel({ petId, data, onAdd, onRemove }: any) {
  const items = data.allergies.filter((a: any) => a.petId === petId);
  return (
    <>
      <PanelHeader title="Allergies" onAdd={onAdd} />
      {items.length === 0 ? <Empty message="No allergies recorded." /> : (
        <ul className="space-y-2.5">
          {items.map((a: any) => (
            <ListRow key={a.id} onDelete={() => onRemove(a.id)}>
              <p className="font-medium text-sm">{a.name}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
                a.severity === 'Severe' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' :
                a.severity === 'Moderate' ? 'bg-gold-300/40 text-gold-500' :
                'bg-forest-50 text-forest-700 dark:bg-forest-800/50 dark:text-forest-200'
              }`}>{a.severity}</span>
              {a.notes && <p className="text-xs text-soft mt-1">{a.notes}</p>}
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}

function WeightPanel({ petId, data, onAdd, onRemove }: any) {
  const items = data.weights.filter((w: any) => w.petId === petId).sort((a: any, b: any) => b.date.localeCompare(a.date));
  const max = Math.max(...items.map((w: any) => parseFloat(w.weight) || 0), 1);
  return (
    <>
      <PanelHeader title="Weight tracking" onAdd={onAdd} />
      {items.length === 0 ? <Empty message="No weight entries yet." /> : (
        <ul className="space-y-2.5">
          {items.map((w: any) => (
            <ListRow key={w.id} onDelete={() => onRemove(w.id)}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{w.weight} kg</span>
                <span className="text-xs text-soft">{formatDate(w.date)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--app-surface)] mt-2 overflow-hidden">
                <div className="h-full bg-forest-500 rounded-full" style={{ width: `${(parseFloat(w.weight) / max) * 100}%` }} />
              </div>
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}

function VisitsPanel({ petId, data, onAdd, onRemove }: any) {
  const items = data.vetVisits.filter((v: any) => v.petId === petId).sort((a: any, b: any) => b.date.localeCompare(a.date));
  return (
    <>
      <PanelHeader title="Vet visits" onAdd={onAdd} />
      {items.length === 0 ? <Empty message="No vet visits recorded." /> : (
        <ul className="space-y-2.5">
          {items.map((v: any) => (
            <ListRow key={v.id} onDelete={() => onRemove(v.id)}>
              <p className="font-medium text-sm">{v.reason}</p>
              <p className="text-xs text-soft mt-0.5">{formatDate(v.date)} · {v.clinic}</p>
              {v.cost && <p className="text-xs text-soft">Cost: {v.cost}</p>}
              {v.notes && <p className="text-xs text-soft mt-1">{v.notes}</p>}
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}

function MedicationsPanel({ petId, data, onAdd, onRemove }: any) {
  const items = data.medications.filter((m: any) => m.petId === petId);
  return (
    <>
      <PanelHeader title="Medications" onAdd={onAdd} />
      {items.length === 0 ? <Empty message="No medications recorded." /> : (
        <ul className="space-y-2.5">
          {items.map((m: any) => (
            <ListRow key={m.id} onDelete={() => onRemove(m.id)}>
              <p className="font-medium text-sm">{m.name}</p>
              <p className="text-xs text-soft mt-0.5">{m.dose} · {m.frequency}</p>
              <p className="text-xs text-soft">{formatDate(m.startDate)} → {m.endDate ? formatDate(m.endDate) : 'ongoing'}</p>
              {m.notes && <p className="text-xs text-soft mt-1">{m.notes}</p>}
            </ListRow>
          ))}
        </ul>
      )}
    </>
  );
}

function AddModal({ open, onClose, tab, petId, setData }: { open: boolean; onClose: () => void; tab: Tab; petId: string; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [form, setForm] = useState<Record<string, string>>({});

  const reset = () => setForm({});

  const fields: Record<Tab, { key: string; label: string; type?: string; placeholder?: string; options?: { value: string; label: string }[] }[]> = {
    vaccines: [
      { key: 'name', label: 'Vaccine name', placeholder: 'Rabies' },
      { key: 'date', label: 'Date given', type: 'date' },
      { key: 'nextDue', label: 'Next due', type: 'date' },
      { key: 'vet', label: 'Vet', placeholder: 'Dr. Smith' },
      { key: 'notes', label: 'Notes' },
    ],
    medical: [
      { key: 'title', label: 'Title', placeholder: 'Spay surgery' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'vet', label: 'Vet', placeholder: 'Dr. Smith' },
      { key: 'description', label: 'Description' },
    ],
    allergies: [
      { key: 'name', label: 'Allergen', placeholder: 'Chicken' },
      { key: 'severity', label: 'Severity', options: [{ value: 'Mild', label: 'Mild' }, { value: 'Moderate', label: 'Moderate' }, { value: 'Severe', label: 'Severe' }] },
      { key: 'notes', label: 'Notes' },
    ],
    weight: [
      { key: 'weight', label: 'Weight (kg)', placeholder: '12.5', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' },
    ],
    visits: [
      { key: 'reason', label: 'Reason', placeholder: 'Annual checkup' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'clinic', label: 'Clinic', placeholder: 'Greenfield Vet' },
      { key: 'cost', label: 'Cost', placeholder: '$120' },
      { key: 'notes', label: 'Notes' },
    ],
    medications: [
      { key: 'name', label: 'Medication', placeholder: 'Apoquel' },
      { key: 'dose', label: 'Dose', placeholder: '16mg' },
      { key: 'frequency', label: 'Frequency', placeholder: 'Once daily' },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'endDate', label: 'End date', type: 'date' },
      { key: 'notes', label: 'Notes' },
    ],
  };

  const collectionMap: Record<Tab, keyof AppData> = {
    vaccines: 'vaccines',
    medical: 'medicalHistory',
    allergies: 'allergies',
    weight: 'weights',
    visits: 'vetVisits',
    medications: 'medications',
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = { id: uid(), petId, ...form, date: form.date || todayISO(), startDate: form.startDate || todayISO() };
    setData((d) => ({ ...d, [collectionMap[tab]]: [...d[collectionMap[tab]], entry] }));
    toast('Entry added.');
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={`Add ${tab === 'medical' ? 'medical history' : tab === 'visits' ? 'vet visit' : tab.slice(0, -1)}`} maxWidth="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        {fields[tab].map((f: { key: string; label: string; type?: string; placeholder?: string; options?: { value: string; label: string }[] }) => (
          <div key={f.key}>
            <label className="block text-sm font-medium mb-1.5">{f.label}</label>
            {f.options ? (
              <Select value={form[f.key] ?? ''} onChange={(v) => setForm({ ...form, [f.key]: v })} options={f.options} placeholder="Select…" />
            ) : (
              <input
                type={f.type || 'text'}
                className="input-base"
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">Add entry</button>
        </div>
      </form>
    </Modal>
  );
}
