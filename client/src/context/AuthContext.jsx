import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('fm_token');
      if (!token) { setLoading(false); return; }
      try { const { user: me } = await authService.getMe(); setUser(me); }
      catch { localStorage.removeItem('fm_token'); }
      finally { setLoading(false); }
    };
    init();
  }, []);

  const login = async (creds) => {
    const data = await authService.login(creds);
    localStorage.setItem('fm_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    localStorage.removeItem('fm_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be inside AuthProvider'); return ctx; };
