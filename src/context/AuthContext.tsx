import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AppData, User } from '@/types';
import { clearSession, loadData, loadSession, saveData, saveSession, uid } from '@/lib/storage';

interface AuthContextValue {
  user: User | null;
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  register: (fullName: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, 'fullName' | 'email' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());
  const [userId, setUserId] = useState<string | null>(() => loadSession());
  const firstRun = useRef(true);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
  }, [userId]);

  const user = useMemo(
    () => data.users.find((u) => u.id === userId) ?? null,
    [data.users, userId]
  );

  const register = useCallback(
    (fullName: string, email: string, password: string) => {
      const exists = data.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) return { ok: false, error: 'An account with this email already exists.' };
      const newUser: User = {
        id: uid(),
        fullName,
        email,
        password,
        createdAt: Date.now(),
      };
      setData((d) => ({ ...d, users: [...d.users, newUser] }));
      saveSession(newUser.id);
      setUserId(newUser.id);
      return { ok: true };
    },
    [data.users]
  );

  const login = useCallback(
    (email: string, password: string) => {
      const found = data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) return { ok: false, error: 'Invalid email or password.' };
      saveSession(found.id);
      setUserId(found.id);
      return { ok: true };
    },
    [data.users]
  );

  const logout = useCallback(() => {
    clearSession();
    setUserId(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, 'fullName' | 'email' | 'avatar'>>) => {
      if (!userId) return;
      setData((d) => ({
        ...d,
        users: d.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
      }));
    },
    [userId]
  );

  const value: AuthContextValue = {
    user,
    data,
    setData,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
