import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'MANAGER' | 'INVESTIGATOR';

export interface User {
  name: string;
  role: UserRole;
  title: string;
  typology?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, typology?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, typology?: string) => {
    if (role === 'MANAGER') {
      setUser({ name: 'Director Shen', role: 'MANAGER', title: 'Operations Manager' });
    } else {
      setUser({ 
        name: 'Insp. Lim', 
        role: 'INVESTIGATOR', 
        title: `${typology} Investigator`,
        typology: typology 
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
