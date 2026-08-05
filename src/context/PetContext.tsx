import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Pet } from '@/types';
import { uid } from '@/lib/storage';

interface PetContextValue {
  activePetId: string | null;
  activePet: Pet | null;
  setActivePetId: (id: string | null) => void;
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => Pet;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  deletePet: (id: string) => void;
}

const PetContext = createContext<PetContextValue | null>(null);

const ACTIVE_PET_KEY = 'petsphere:activePet';

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { user, data, setData } = useAuth();
  const [activePetId, setActivePetIdState] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_PET_KEY)
  );

  const pets = useMemo(
    () => (user ? data.pets.filter((p) => p.ownerId === user.id) : []),
    [data.pets, user]
  );

  const setActivePetId = useCallback((id: string | null) => {
    setActivePetIdState(id);
    if (id) localStorage.setItem(ACTIVE_PET_KEY, id);
    else localStorage.removeItem(ACTIVE_PET_KEY);
  }, []);

  const activePet = useMemo(
    () => pets.find((p) => p.id === activePetId) ?? pets[0] ?? null,
    [pets, activePetId]
  );

  const addPet = useCallback(
    (pet: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => {
      const newPet: Pet = {
        ...pet,
        id: uid(),
        ownerId: user!.id,
        createdAt: Date.now(),
      };
      setData((d) => ({ ...d, pets: [...d.pets, newPet] }));
      setActivePetId(newPet.id);
      return newPet;
    },
    [user, setData, setActivePetId]
  );

  const updatePet = useCallback(
    (id: string, patch: Partial<Pet>) => {
      setData((d) => ({
        ...d,
        pets: d.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
    },
    [setData]
  );

  const deletePet = useCallback(
    (id: string) => {
      setData((d) => ({
        ...d,
        pets: d.pets.filter((p) => p.id !== id),
        feedings: d.feedings.filter((f) => f.petId !== id),
        gallery: d.gallery.filter((g) => g.petId !== id),
        journal: d.journal.filter((j) => j.petId !== id),
        reminders: d.reminders.filter((r) => r.petId !== id),
        vaccines: d.vaccines.filter((v) => v.petId !== id),
        medicalHistory: d.medicalHistory.filter((m) => m.petId !== id),
        allergies: d.allergies.filter((a) => a.petId !== id),
        weights: d.weights.filter((w) => w.petId !== id),
        vetVisits: d.vetVisits.filter((v) => v.petId !== id),
        medications: d.medications.filter((m) => m.petId !== id),
      }));
      if (activePetId === id) setActivePetId(null);
    },
    [setData, activePetId, setActivePetId]
  );

  const value: PetContextValue = {
    activePetId: activePet?.id ?? null,
    activePet,
    setActivePetId,
    pets,
    addPet,
    updatePet,
    deletePet,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePet(): PetContextValue {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be used within PetProvider');
  return ctx;
}
