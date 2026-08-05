import { Link, useNavigate } from 'react-router-dom';
import {
  PawPrint,
  HeartPulse,
  Utensils,
  Images,
  BookOpen,
  Bell,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Moon,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: PawPrint,
    title: 'Unlimited pets',
    desc: 'Add every companion — dogs, cats, birds and more — with full profiles and photos.',
  },
  {
    icon: HeartPulse,
    title: 'Health tracking',
    desc: 'Vaccines, medications, allergies, weight history and vet visits in one place.',
  },
  {
    icon: Utensils,
    title: 'Feeding schedules',
    desc: 'Breakfast, lunch, dinner and water reminders with daily progress tracking.',
  },
  {
    icon: BookOpen,
    title: 'Daily journal',
    desc: "Capture moods, notes and photos in a beautiful timeline of your pet's life.",
  },
  {
    icon: Bell,
    title: 'Smart reminders',
    desc: 'Never miss a vaccine, dose or vet appointment with timely, organized alerts.',
  },
  {
    icon: Images,
    title: 'Pet gallery',
    desc: 'Upload and curate a gallery of your favorite moments, all stored privately.',
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-[var(--app-bg)]/80 border-b border-app">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-soft">
            <a href="#features" className="hover:text-[var(--app-text)] transition-colors">Features</a>
            <a href="#about" className="hover:text-[var(--app-text)] transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-2.5">
            {user ? (
              <Link to="/app" className="btn-primary">
                Go to dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full surface-2 text-sm font-medium text-forest-700 dark:text-forest-200 mb-8 animate-fade-in">
            <Sparkles size={15} />
            Premium pet care, beautifully organized
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-4xl mx-auto animate-slide-up">
            Every moment with your pet,{' '}
            <span className="text-forest-600">beautifully kept.</span>
          </h1>
          <p className="text-lg sm:text-xl text-soft max-w-2xl mx-auto mt-7 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            PetSphere is a warm, elegant companion for managing your pet's health, feeding,
            gallery and memories — designed with the care your companion deserves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="btn-primary text-base px-7 py-3.5">
              Create your free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-7 py-3.5">
              I already have one
            </Link>
          </div>

          {/* Hero card preview */}
          <div className="mt-16 lg:mt-20 relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="surface rounded-3xl p-2 max-w-4xl mx-auto shadow-[var(--app-shadow-lg)]">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-forest-50 to-cream-100 dark:from-forest-900 dark:to-forest-800 p-8 sm:p-12">
                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    { icon: HeartPulse, label: 'Health', value: 'Up to date' },
                    { icon: Utensils, label: "Today's meals", value: '2 / 3' },
                    { icon: Bell, label: 'Reminders', value: '3 upcoming' },
                  ].map((s) => (
                    <div key={s.label} className="surface rounded-2xl p-5 text-left">
                      <div className="h-10 w-10 rounded-xl bg-forest-600 text-white grid place-items-center mb-3">
                        <s.icon size={20} />
                      </div>
                      <p className="text-sm text-soft">{s.label}</p>
                      <p className="text-xl font-semibold mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 surface rounded-2xl p-5 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-forest-100 dark:bg-forest-800 grid place-items-center text-forest-600">
                    <PawPrint size={26} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg">Luna</p>
                    <p className="text-sm text-soft">Golden Retriever · 3 years</p>
                  </div>
                  <div className="ml-auto flex -space-x-2">
                    {[Moon, ShieldCheck, Sparkles].map((Icon, i) => (
                      <div key={i} className="h-9 w-9 rounded-full surface-2 grid place-items-center text-forest-600 border border-app">
                        <Icon size={15} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-forest-200/40 dark:bg-forest-700/20 blur-3xl" />
        <div className="absolute bottom-0 -right-32 h-96 w-96 rounded-full bg-gold-300/30 dark:bg-gold-500/10 blur-3xl" />
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-forest-600 font-medium mb-2">Everything in one place</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
              Thoughtful features for devoted owners
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="surface rounded-3xl p-7 hover:-translate-y-1 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="h-12 w-12 rounded-2xl bg-forest-50 dark:bg-forest-800/50 text-forest-600 grid place-items-center mb-5">
                  <f.icon size={24} />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-soft leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto surface rounded-[2rem] p-10 lg:p-16 text-center bg-gradient-to-br from-forest-50 to-cream-50 dark:from-forest-900 dark:to-forest-800">
          <ShieldCheck className="mx-auto text-forest-600 mb-5" size={40} />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Your data stays yours, always.
          </h2>
          <p className="text-soft text-lg max-w-2xl mx-auto mb-8">
            PetSphere stores everything locally on your device. No servers, no tracking —
            just you and your pet's story.
          </p>
          <Link to="/register" className="btn-primary text-base px-7 py-3.5">
            Start your pet's story <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-app px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-soft">Crafted with care for pets and their people.</p>
        </div>
      </footer>
    </div>
  );
}
