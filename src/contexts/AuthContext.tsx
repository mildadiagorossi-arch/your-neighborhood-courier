import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('quickbite-user');
    return saved ? JSON.parse(saved) : null;
  });
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation - en production, connecter à un vrai backend
    const users = JSON.parse(localStorage.getItem('quickbite-users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('quickbite-user', JSON.stringify(userData));
      toast({ title: 'Connexion réussie', description: `Bienvenue ${userData.firstName}!` });
      return true;
    }
    
    toast({ title: 'Erreur', description: 'Email ou mot de passe incorrect', variant: 'destructive' });
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('quickbite-users') || '[]');
    
    if (users.some((u: any) => u.email === data.email)) {
      toast({ title: 'Erreur', description: 'Cet email est déjà utilisé', variant: 'destructive' });
      return false;
    }

    const newUser = { ...data, id: crypto.randomUUID() };
    users.push(newUser);
    localStorage.setItem('quickbite-users', JSON.stringify(users));

    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('quickbite-user', JSON.stringify(userData));
    
    toast({ title: 'Compte créé!', description: 'Bienvenue sur QuickBite!' });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quickbite-user');
    toast({ title: 'Déconnexion', description: 'À bientôt!' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
