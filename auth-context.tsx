import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  name: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value === 'true') {
        setIsLoggedInState(true);
        setUser({ name: 'John Doe' });
      }
    })();
  }, []);

  const setIsLoggedIn = async (value: boolean) => {
    setIsLoggedInState(value);
    try {
      await AsyncStorage.setItem('isLoggedIn', value ? 'true' : 'false');
      if (!value) {
        setUser(null); 
      }
    } catch {
      console.error('Failed to save login state');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};