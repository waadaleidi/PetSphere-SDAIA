import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/Toaster';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const validate = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    const res = register(fullName.trim(), email.trim(), password);
    if (!res.ok) {
      setError(res.error ?? 'Registration failed.');
      return;
    }
    toast('Account created. Welcome to PetSphere!');
    navigate('/app');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 sm:px-12 py-12 order-2 lg:order-1">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-10">
            <Link to="/">
              <Logo size="md" />
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-semibold mb-2">Create your account</h1>
          <p className="text-soft mb-8">Join PetSphere and start caring for your pet.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="input-base pl-11"
                  autoComplete="name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base pl-11"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-base pl-11 pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-soft hover:text-[var(--app-text)]"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft" />
                <input
                  type={show ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-base pl-11"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-300 px-3.5 py-2.5 rounded-xl">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Create account <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-soft mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white relative overflow-hidden order-1 lg:order-2">
        <Link to="/" className="relative z-10">
          <Logo size="md" />
        </Link>
        <div className="relative z-10">
          <h2 className="font-serif text-4xl leading-tight mb-4">
            Every pet deserves a story worth keeping.
          </h2>
          <p className="text-forest-100/90 max-w-md text-lg">
            PetSphere helps you remember the small things — feeding times, vaccines, walks —
            and the big moments that make a life.
          </p>
        </div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-forest-500/30 blur-3xl" />
        <div className="absolute top-1/4 -right-20 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />
      </div>
    </div>
  );
}
