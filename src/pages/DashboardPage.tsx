import { Link } from 'react-router-dom';
import {
  PawPrint,
  Bell,
  Syringe,
  Activity,
  Utensils,
  BookOpen,
  HeartPulse,
  Images,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePet } from '@/context/PetContext';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, relativeDays, todayISO } from '@/lib/storage';

export default function DashboardPage() {
  const { user, data } = useAuth();
  const { pets, activePet, setActivePetId } = usePet();

  const firstName = user?.fullName?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (pets.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="font-serif text-3xl font-semibold mb-2">
          {greeting}, {firstName}.
        </h1>
        <p className="text-soft mb-10">Let's start by adding your first pet to PetSphere.</p>
        <EmptyState
          icon={<PawPrint size={26} />}
          title="No pets yet"
          message="Add your first companion to begin tracking feeding, health, reminders and memories."
          action={
            <Link to="/app/pets" className="btn-primary">
              <Plus size={18} /> Add your first pet
            </Link>
          }
        />
      </div>
    );
  }

  const pet = activePet ?? pets[0];
  const petId = pet.id;

  const today = todayISO();
  const todaysReminders = data.reminders
    .filter((r) => r.petId === petId && !r.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const upcomingVaccines = data.vaccines
    .filter((v) => v.petId === petId && v.nextDue)
    .sort((a, b) => a.nextDue.localeCompare(b.nextDue))
    .slice(0, 3);

  const recentJournal = data.journal
    .filter((j) => j.petId === petId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const todaysFeeding = data.feedings.find((f) => f.petId === petId && f.date === today);
  const mealsDone = todaysFeeding
    ? [todaysFeeding.breakfast, todaysFeeding.lunch, todaysFeeding.dinner].filter(Boolean).length
    : 0;
  const mealPct = Math.round((mealsDone / 3) * 100);

  const galleryCount = data.gallery.filter((g) => g.petId === petId).length;
  const reminderCount = data.reminders.filter((r) => r.petId === petId && !r.done).length;

  const stats = [
    { icon: Syringe, label: 'Vaccines', value: String(data.vaccines.filter((v) => v.petId === petId).length) },
    { icon: BookOpen, label: 'Journal entries', value: String(data.journal.filter((j) => j.petId === petId).length) },
    { icon: Images, label: 'Gallery photos', value: String(galleryCount) },
    { icon: Bell, label: 'Active reminders', value: String(reminderCount) },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">
          {greeting}, {firstName}.
        </h1>
        <p className="text-soft mt-1">Here's what's happening with your pet today.</p>
      </div>

      {/* Pet switcher cards */}
      {pets.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePetId(p.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all shrink-0 ${
                p.id === pet.id
                  ? 'border-forest-400 bg-forest-50 dark:bg-forest-800/40'
                  : 'border-app surface hover:border-forest-300'
              }`}
            >
              {p.photo ? (
                <img src={p.photo} alt={p.name} className="h-9 w-9 rounded-xl object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-forest-600 text-white grid place-items-center">
                  <PawPrint size={16} />
                </div>
              )}
              <span className="font-medium text-sm">{p.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hero pet card */}
      <div className="surface rounded-3xl overflow-hidden">
        <div className="grid sm:grid-cols-[auto_1fr] gap-6 p-6 sm:p-8">
          <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl overflow-hidden bg-forest-100 dark:bg-forest-800 shrink-0">
            {pet.photo ? (
              <img src={pet.photo} alt={pet.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-forest-500">
                <PawPrint size={40} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-3xl font-semibold">{pet.name}</h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-forest-50 text-forest-700 dark:bg-forest-800/50 dark:text-forest-100">
                {pet.species}
              </span>
            </div>
            <p className="text-soft mt-1">
              {pet.breed || 'Unknown breed'} · {pet.age || '—'} years · {pet.gender}
            </p>
            <div className="flex gap-2 mt-4">
              <Link to="/app/pets" className="btn-ghost !py-2 !px-4 text-sm">
                View profile <ArrowRight size={15} />
              </Link>
              <Link to="/app/health" className="btn-ghost !py-2 !px-4 text-sm">
                <HeartPulse size={15} /> Health
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="surface rounded-2xl p-5">
            <div className="h-10 w-10 rounded-xl bg-forest-50 dark:bg-forest-800/50 text-forest-600 grid place-items-center mb-3">
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-semibold font-serif">{s.value}</p>
            <p className="text-sm text-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's reminders */}
        <div className="surface rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-xl font-semibold">Today's reminders</h3>
            <Link to="/app/reminders" className="text-sm text-forest-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          {todaysReminders.length === 0 ? (
            <p className="text-soft text-sm py-6 text-center">No pending reminders. You're all caught up.</p>
          ) : (
            <ul className="space-y-2.5">
              {todaysReminders.map((r) => {
                const days = relativeDays(r.dueDate);
                return (
                  <li key={r.id} className="flex items-center gap-3 p-3 rounded-2xl surface-2">
                    <div className="h-9 w-9 rounded-xl bg-forest-600 text-white grid place-items-center shrink-0">
                      <Bell size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{r.title}</p>
                      <p className="text-xs text-soft">{formatDate(r.dueDate)} · {r.type}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                        days < 0
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                          : days === 0
                          ? 'bg-gold-300/40 text-gold-500'
                          : 'bg-forest-50 text-forest-700 dark:bg-forest-800/50 dark:text-forest-200'
                      }`}
                    >
                      {days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Upcoming vaccines */}
        <div className="surface rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-xl font-semibold">Upcoming vaccines</h3>
            <Link to="/app/health" className="text-sm text-forest-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          {upcomingVaccines.length === 0 ? (
            <p className="text-soft text-sm py-6 text-center">No upcoming vaccines scheduled.</p>
          ) : (
            <ul className="space-y-2.5">
              {upcomingVaccines.map((v) => {
                const days = relativeDays(v.nextDue);
                return (
                  <li key={v.id} className="flex items-center gap-3 p-3 rounded-2xl surface-2">
                    <div className="h-9 w-9 rounded-xl bg-forest-50 dark:bg-forest-800/50 text-forest-600 grid place-items-center shrink-0">
                      <Syringe size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{v.name}</p>
                      <p className="text-xs text-soft">Next due {formatDate(v.nextDue)}</p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 dark:bg-forest-800/50 dark:text-forest-200 shrink-0">
                      {days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Feeding + Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="surface rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-xl font-semibold">Today's feeding</h3>
            <Link to="/app/feeding" className="text-sm text-forest-600 font-medium hover:underline">
              Open
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-forest-600 text-white grid place-items-center">
              <Utensils size={18} />
            </div>
            <div className="flex-1">
              <div className="h-2.5 rounded-full bg-[var(--app-surface-2)] overflow-hidden">
                <div
                  className="h-full bg-forest-500 rounded-full transition-all duration-500"
                  style={{ width: `${mealPct}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium">{mealsDone}/3 meals</span>
          </div>
          <p className="text-sm text-soft">
            {mealsDone === 3 ? 'All meals logged today. Well done.' : 'Keep tracking meals throughout the day.'}
          </p>
        </div>

        <div className="surface rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-xl font-semibold">Recent activity</h3>
            <Link to="/app/journal" className="text-sm text-forest-600 font-medium hover:underline">
              Journal
            </Link>
          </div>
          {recentJournal.length === 0 ? (
            <p className="text-soft text-sm py-6 text-center">No journal entries yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentJournal.map((j) => (
                <li key={j.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-forest-50 dark:bg-forest-800/50 text-forest-600 grid place-items-center shrink-0 mt-0.5">
                    <Activity size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{j.title || j.mood}</p>
                    <p className="text-xs text-soft">{formatDate(j.date)} · {j.mood}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
