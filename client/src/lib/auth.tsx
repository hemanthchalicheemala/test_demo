import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from './api';
import type { User, Role } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (u: User) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  city?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rc_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('rc_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('rc_token', res.data.token);
    setUser(res.data.user);
    return res.data.user as User;
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('rc_token', res.data.token);
    setUser(res.data.user);
    return res.data.user as User;
  };

  const logout = () => {
    localStorage.removeItem('rc_token');
    setUser(null);
  };

  const updateUser = (u: User) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const dashboardPath = (role: Role) =>
  role === 'ADMIN' ? '/admin' : role === 'OWNER' ? '/owner' : '/tenant';
