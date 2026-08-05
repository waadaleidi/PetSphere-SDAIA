import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  Utensils,
  HeartPulse,
  Images,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Plus,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { usePet } from '@/context/PetContext';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/pets', label: 'My Pets', icon: PawPrint },
  { to: '/app/feeding', label: 'Feeding', icon: Utensils },
  { to: '/app/health', label: 'Health', icon: HeartPulse },
  { to: '/app/gallery', label: 'Gallery', icon: Images },
  { to: '/app/journal', label: 'Journal', icon: BookOpen },
  { to: '/app/reminders', label: 'Reminders', icon: Bell },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { pets, activePet, setActivePetId } = usePet();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-app bg-[var(--app-surface)] z-30">
        <div className="px-6 py-6">
          <NavLink to="/app">
            <Logo size="md" />
          </NavLink>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-50 text-forest-700 dark:bg-forest-800/40 dark:text-forest-100'
                    : 'text-soft hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]'
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-app">
          <div className="flex items-center gap-3 px-3 py-2">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-forest-600 text-white grid place-items-center font-semibold">
                {user?.fullName?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
              <p className="text-xs text-soft truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-soft hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)] transition-colors"
          >
            <LogOut size={19} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-app bg-[var(--app-surface)]/90 backdrop-blur">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-[var(--app-surface-2)]"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Logo size="sm" />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-[var(--app-surface-2)]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[var(--app-surface)] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-5 py-5 border-b border-app">
              <Logo size="sm" />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-[var(--app-surface-2)]">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-forest-50 text-forest-700 dark:bg-forest-800/40 dark:text-forest-100'
                        : 'text-soft hover:bg-[var(--app-surface-2)]'
                    }`
                  }
                >
                  <item.icon size={19} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-app">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-soft hover:bg-[var(--app-surface-2)]"
              >
                <LogOut size={19} />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Desktop topbar */}
        <header className="hidden lg:flex sticky top-0 z-20 items-center justify-between px-8 h-16 border-b border-app bg-[var(--app-bg)]/80 backdrop-blur">
          <div className="flex items-center gap-3">
            {pets.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  value={activePet?.id ?? ''}
                  onChange={(e) => setActivePetId(e.target.value)}
                  className="input-base !py-1.5 !px-3 !w-auto font-medium"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <NavLink to="/app/pets" className="btn-ghost !py-1.5 !px-3 text-sm">
              <Plus size={16} /> Add pet
            </NavLink>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--app-surface-2)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
