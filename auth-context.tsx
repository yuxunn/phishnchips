import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from './firebaseConfig';

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserState(user);
      setIsLoggedInState(!!user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value === 'true') {
        setIsLoggedInState(true);
      }
    })();
  }, []);

  const setIsLoggedIn = async (value: boolean) => {
    setIsLoggedInState(value);
    try {
      await AsyncStorage.setItem('isLoggedIn', value ? 'true' : 'false');
    } catch {
    }
  };

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
