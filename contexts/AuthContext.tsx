
import React, { createContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
  });

  const login = (email: string) => {
    // Mock login: find user by email. In a real app, this would be an API call.
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
        // Fallback for demo purposes
        const guestUser = { id: 'u99', name: 'Guest User', email: email, role: UserRole.Participant, avatar: 'https://i.pravatar.cc/150?u=u99' };
        localStorage.setItem('user', JSON.stringify(guestUser));
        setUser(guestUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
