import { Link } from 'react-router-dom';
import {
  PawPrint,
  CakeSlice,
  Scale,
  Palette,
  Microchip,
  Phone,
  Stethoscope,
  Syringe,
  Pill,
  Utensils,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { usePet } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, todayISO } from '@/lib/storage';

export default function PetProfilePage() {
  const { pets, activePet, setActivePetId } = usePet();
  const { data } = useAuth();

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={<PawPrint size={26} />}
        title="No pet selected"
        message="Add a pet first to view its profile."
        action={<Link to="/app/pets" className="btn-primary">Go to My Pets</Link>}
      />
    );
  }

  const pet = activePet ?? pets[0];
  const petId = pet.id;

  const vaccines = data.vaccines.filter((v) => v.petId === petId);
  const medications = data.medications.filter((m) => m.petId === petId);
  const allergies = data.allergies.filter((a) => a.petId === petId);
  const todayFeeding = data.feedings.find((f) => f.petId === petId && f.date === todayISO());
  const reminders = data.reminders.filter((r) => r.petId === petId && !r.done).slice(0, 4);

  const info = [
    { icon: CakeSlice, label: 'Birthday', value: formatDate(pet.birthday) },
    { icon: Scale, label: 'Weight', value: pet.weight ? `${pet.weight} kg` : '—' },
    { icon: Palette, label: 'Color', value: pet.color || '—' },
    { icon: Microchip, label: 'Microchip', value: pet.microchipId || '—' },
    { icon: Phone, label: 'Emergency contact', value: pet.emergencyContact || '—' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
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

      {/* Hero */}
      <div className="surface rounded-3xl overflow-hidden">
        <div className="relative h-48 sm:h-64 bg-gradient-to-br from-forest-500 to-forest-700">
          {pet.photo && (
            <img src={pet.photo} alt={pet.name} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="font-serif text-4xl font-semibold drop-shadow">{pet.name}</h1>
            <p className="opacity-90 mt-1">{pet.breed || 'Unknown breed'} · {pet.species} · {pet.age || '—'} years</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {info.map((i) => (
          <div key={i.label} className="surface rounded-2xl p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-forest-50 dark:bg-forest-800/50 text-forest-600 grid place-items-center shrink-0">
              <i.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-soft">{i.label}</p>
              <p className="font-medium truncate">{i.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Medical notes */}
      {pet.medicalNotes && (
        <div className="surface rounded-3xl p-6">
          <h3 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
            <Stethoscope size={20} className="text-forest-600" /> Medical notes
          </h3>
          <p className="text-soft leading-relaxed whitespace-pre-line">{pet.medicalNotes}</p>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/app/health', icon: Syringe, label: 'Health', count: vaccines.length },
          { to: '/app/feeding', icon: Utensils, label: 'Feeding', count: todayFeeding ? [todayFeeding.breakfast, todayFeeding.lunch, todayFeeding.dinner].filter(Boolean).length : 0 },
          { to: '/app/reminders', icon: Bell, label: 'Reminders', count: reminders.length },
          { to: '/app/journal', icon: PawPrint, label: 'Journal', count: data.journal.filter((j) => j.petId === petId).length },
        ].map((q) => (
          <Link key={q.to} to={q.to} className="surface rounded-2xl p-5 hover:-translate-y-1 transition-transform group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-forest-50 dark:bg-forest-800/50 text-forest-600 grid place-items-center">
                <q.icon size={20} />
              </div>
              <ArrowRight size={18} className="text-soft group-hover:text-forest-600 transition-colors" />
            </div>
            <p className="text-2xl font-semibold font-serif">{q.count}</p>
            <p className="text-sm text-soft">{q.label}</p>
          </Link>
        ))}
      </div>

      {/* Allergies + medications */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface rounded-3xl p-6">
          <h3 className="font-serif text-xl font-semibold mb-4">Allergies</h3>
          {allergies.length === 0 ? (
            <p className="text-soft text-sm">No allergies recorded.</p>
          ) : (
            <ul className="space-y-2">
              {allergies.map((a) => (
                <li key={a.id} className="flex items-center justify-between p-3 rounded-2xl surface-2">
                  <span className="font-medium text-sm">{a.name}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    a.severity === 'Severe' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' :
                    a.severity === 'Moderate' ? 'bg-gold-300/40 text-gold-500' :
                    'bg-forest-50 text-forest-700 dark:bg-forest-800/50 dark:text-forest-200'
                  }`}>{a.severity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="surface rounded-3xl p-6">
          <h3 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
            <Pill size={20} className="text-forest-600" /> Medications
          </h3>
          {medications.length === 0 ? (
            <p className="text-soft text-sm">No medications recorded.</p>
          ) : (
            <ul className="space-y-2">
              {medications.map((m) => (
                <li key={m.id} className="p-3 rounded-2xl surface-2">
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-soft">{m.dose} · {m.frequency}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
