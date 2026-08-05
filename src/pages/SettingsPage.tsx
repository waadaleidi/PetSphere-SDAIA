import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User as UserIcon, Mail, Camera, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from '@/components/Toaster';

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName: name, email, avatar });
    toast('Profile updated.');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Settings</h1>
        <p className="text-soft mt-1">Manage your profile and preferences.</p>
      </div>

      {/* Appearance */}
      <div className="surface rounded-3xl p-6">
        <h3 className="font-serif text-xl font-semibold mb-4">Appearance</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
              theme === 'light' ? 'border-forest-400 bg-forest-50 dark:bg-forest-800/30' : 'border-app hover:border-forest-300'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-cream-100 grid place-items-center text-gold-500">
              <Sun size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Light</p>
              <p className="text-xs text-soft">Warm cream tones</p>
            </div>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
              theme === 'dark' ? 'border-forest-400 bg-forest-50 dark:bg-forest-800/30' : 'border-app hover:border-forest-300'
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-forest-900 grid place-items-center text-forest-200">
              <Moon size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Dark</p>
              <p className="text-xs text-soft">Deep forest night</p>
            </div>
          </button>
        </div>
      </div>

      {/* Profile */}
      <form onSubmit={saveProfile} className="surface rounded-3xl p-6 space-y-5">
        <h3 className="font-serif text-xl font-semibold">Profile</h3>
        <div className="flex flex-col sm:flex-row gap-5">
          <ImageUpload value={avatar} onChange={setAvatar} label="Avatar" aspect="round" />
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
                <input className="input-base pl-11" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
                <input className="input-base pl-11" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            <Save size={17} /> Save changes
          </button>
        </div>
      </form>

      {/* Account info */}
      <div className="surface rounded-3xl p-6">
        <h3 className="font-serif text-xl font-semibold mb-4">Account</h3>
        <div className="flex items-center gap-4 p-4 rounded-2xl surface-2 mb-4">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-forest-600 text-white grid place-items-center font-semibold text-lg">
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-sm text-soft">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-danger w-full">
          <LogOut size={18} /> Log out
        </button>
      </div>

      <p className="text-center text-xs text-soft pt-2">
        PetSphere · All data stored locally on your device.
      </p>
    </div>
  );
}
