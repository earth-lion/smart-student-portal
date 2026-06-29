import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // On mount: if token exists, silently refresh user data from server.
  // This ensures student fields (GPA, credits, department) are always fresh.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;
    api.get('/user')
      .then(res => {
        const freshUser = res.data;
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // Token is invalid/expired — clear session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'خطأ في تسجيل الدخول',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/register', { name, email, password });
      const { token: newToken, user: userData } = res.data;
      if (newToken) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
      }
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'خطأ في التسجيل',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
