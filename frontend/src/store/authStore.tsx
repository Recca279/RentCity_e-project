import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types';
import api from '@/services/api';

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  isAuthModalOpen: boolean;
  authModalInitialTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');

  // Khôi phục session: Chỉ dùng LocalStorage để không bị kẹt loading
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false); // Bắt buộc set False để hết trắng trang
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      // Gọi API thật 100%
      const { data } = await api.post('/auth/login', credentials);
      
      // Lấy data user (Tùy backend của cậu trả về {user: ...} hay trả về trực tiếp user)
      const loggedInUser = data.user || data;
      
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      if (data.accessToken) {
         localStorage.setItem('accessToken', data.accessToken);
      }
      
      setUser(loggedInUser);
      closeAuthModal();
    } catch (error) {
      throw error;
    }
  };

  const register = async (info: RegisterRequest) => {
    try {
      // Gọi API thật 100%
      await api.post('/auth/register', info);
      // Đăng ký thành công thì mở tab Login
      setAuthModalInitialTab('login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, isLoggedIn: !!user, isLoading, login, register, logout,
      updateUser, isAuthModalOpen, authModalInitialTab, openAuthModal, closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };