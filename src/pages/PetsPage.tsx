import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, PawPrint, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/Modal';
import { ImageUpload } from '@/components/ImageUpload';
import { Select } from '@/components/Select';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/components/Toaster';
import type { Pet, Species, Gender } from '@/types';

const speciesOptions: { value: Species; label: string }[] = [
  { value: 'Dog', label: 'Dog' },
  { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Reptile', label: 'Reptile' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Other', label: 'Other' },
];

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Unknown', label: 'Unknown' },
];

const blankForm: Omit<Pet, 'id' | 'ownerId' | 'createdAt'> = {
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Unknown',
  weight: '',
  color: '',
  birthday: '',
  microchipId: '',
  medicalNotes: '',
  emergencyContact: '',
  photo: '',
};

export default function PetsPage() {
  const { pets, addPet, updatePet, deletePet, setActivePetId } = usePet();
  const { data, setData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm);
  const [confirmDelete, setConfirmDelete] = useState<Pet | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(blankForm);
    setModalOpen(true);
  };

  const openEdit = (pet: Pet) => {
    setEditingId(pet.id);
    const { id, ownerId, createdAt, ...rest } = pet;
    setForm(rest);
    setModalOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast('Please enter a name.');
      return;
    }
    if (editingId) {
      updatePet(editingId, form);
      toast('Pet updated.');
    } else {
      addPet(form);
      toast('Pet added.');
    }
    setModalOpen(false);
  };

  const confirmDeletePet = () => {
    if (!confirmDelete) return;
    deletePet(confirmDelete.id);
    toast('Pet removed.');
    setConfirmDelete(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold">My Pets</h1>
          <p className="text-soft mt-1">Manage every companion in your care.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Add pet
        </button>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={26} />}
          title="No pets yet"
          message="Add your first companion to start tracking their health, feeding and memories."
          action={
            <button onClick={openAdd} className="btn-primary">
              <Plus size={18} /> Add your first pet
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet) => (
            <div key={pet.id} className="surface rounded-3xl overflow-hidden group animate-fade-in">
              <div className="aspect-[4/3] bg-forest-100 dark:bg-forest-800 relative overflow-hidden">
                {pet.photo ? (
                  <img src={pet.photo} alt={pet.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-forest-500">
                    <PawPrint size={40} />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-forest-700 backdrop-blur">
                  {pet.species}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold">{pet.name}</h3>
                <p className="text-sm text-soft mt-0.5">
                  {pet.breed || 'Unknown breed'} · {pet.age || '—'} yrs
                </p>
                <div className="flex gap-2 mt-4">
                  <Link
                    to="/app"
                    onClick={() => setActivePetId(pet.id)}
                    className="btn-ghost !py-2 !px-3.5 text-sm flex-1"
                  >
                    Select <ArrowRight size={15} />
                  </Link>
                  <button onClick={() => openEdit(pet)} className="p-2.5 rounded-full surface-2 hover:text-forest-600 transition-colors" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setConfirmDelete(pet)} className="p-2.5 rounded-full surface-2 hover:text-red-600 transition-colors" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit pet' : 'Add a new pet'} maxWidth="max-w-2xl">
        <form onSubmit={save} className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <ImageUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label="Pet photo" />
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Luna" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Species</label>
                  <Select value={form.species} onChange={(v) => setForm({ ...form, species: v as Species })} options={speciesOptions} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Gender</label>
                  <Select value={form.gender} onChange={(v) => setForm({ ...form, gender: v as Gender })} options={genderOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Breed" value={form.breed} onChange={(v) => setForm({ ...form, breed: v })} placeholder="Golden Retriever" />
            <Field label="Age (years)" value={form.age} onChange={(v) => setForm({ ...form, age: v })} placeholder="3" type="number" />
            <Field label="Weight (kg)" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} placeholder="12.5" type="number" />
            <Field label="Color" value={form.color} onChange={(v) => setForm({ ...form, color: v })} placeholder="Golden" />
            <Field label="Birthday" value={form.birthday} onChange={(v) => setForm({ ...form, birthday: v })} type="date" />
            <Field label="Microchip ID" value={form.microchipId} onChange={(v) => setForm({ ...form, microchipId: v })} placeholder="985112…" />
          </div>

          <Field label="Emergency contact" value={form.emergencyContact} onChange={(v) => setForm({ ...form, emergencyContact: v })} placeholder="Dr. Smith — +1 555 0100" />
          <div>
            <label className="block text-sm font-medium mb-1.5">Medical notes</label>
            <textarea className="input-base min-h-[90px] resize-y" value={form.medicalNotes} onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })} placeholder="Allergies, conditions, special care…" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Save changes' : 'Add pet'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Remove pet?" maxWidth="max-w-md">
        <p className="text-soft">
          This will permanently remove <strong className="text-[var(--app-text)]">{confirmDelete?.name}</strong> and all related records (feeding, health, gallery, journal, reminders). This cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setConfirmDelete(null)} className="btn-ghost">Cancel</button>
          <button onClick={confirmDeletePet} className="btn-danger">Delete pet</button>
        </div>
      </Modal>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type={type} className="input-base" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
