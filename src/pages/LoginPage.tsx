import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/Toaster';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const res = login(email.trim(), password);
    if (!res.ok) {
      setError(res.error ?? 'Login failed.');
      return;
    }
    toast('Welcome back!');
    navigate('/app');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-forest-700 via-forest-600 to-forest-800 text-white relative overflow-hidden">
        <Link to="/" className="relative z-10">
          <Logo size="md" />
        </Link>
        <div className="relative z-10">
          <h2 className="font-serif text-4xl leading-tight mb-4">
            Welcome back to your pet's world.
          </h2>
          <p className="text-forest-100/90 max-w-md text-lg">
            Track feeding, health, vaccines and precious moments — all in one elegant place.
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-forest-500/30 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />
      </div>

      <div className="flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-10">
            <Link to="/">
              <Logo size="md" />
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-semibold mb-2">Sign in</h1>
          <p className="text-soft mb-8">Enter your details to access PetSphere.</p>

          <form onSubmit={submit} className="space-y-4">
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
                  placeholder="Your password"
                  className="input-base pl-11 pr-11"
                  autoComplete="current-password"
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

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-300 px-3.5 py-2.5 rounded-xl">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Sign in <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-soft mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-forest-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
