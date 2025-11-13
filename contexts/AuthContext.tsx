import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithRedirect,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { saveUser } from '../services/firestoreService';
import type { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  emailLogin: async () => {},
  signup: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const formatUser = (firebaseUser: FirebaseUser): User => {
    return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario Anónimo',
        email: firebaseUser.email || '',
    }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = formatUser(firebaseUser);
        await saveUser(appUser); // Save user to Firestore on login/state change
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const emailLogin = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signup = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
        
    const appUser = formatUser(userCredential.user);
    appUser.name = name; // Ensure the name is set correctly
    await saveUser(appUser); // Save new user to Firestore
    setUser(appUser);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, emailLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};