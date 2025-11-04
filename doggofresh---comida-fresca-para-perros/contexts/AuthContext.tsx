import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';
// FIX: All imports from 'firebase/auth' were failing.
// Switched to using the firebase compat library to align with the updated `services/firebase.ts`
// and ensure compatibility. This involves importing firebase from compat and using the v8-style syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
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

// FIX: Define FirebaseUser type from the compat import.
type FirebaseUser = firebase.User;

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
    // FIX: Use auth.onAuthStateChanged (v8 syntax) instead of onAuthStateChanged(auth) (v9 syntax).
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
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
    const provider = new firebase.auth.GoogleAuthProvider();
    // Using signInWithRedirect is more compatible with sandboxed environments (like iframes) where popups are blocked.
    // The onAuthStateChanged listener will handle the user state automatically after the page redirects back to the app.
    await auth.signInWithRedirect(provider);
  };

  const emailLogin = async (email: string, pass: string) => {
    // FIX: Use auth.signInWithEmailAndPassword.
    await auth.signInWithEmailAndPassword(email, pass);
  };
  
  const signup = async (name: string, email: string, pass: string) => {
    // FIX: Use auth.createUserWithEmailAndPassword and user.updateProfile.
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    if (userCredential.user) {
        await userCredential.user.updateProfile({ displayName: name });
        
        const appUser = formatUser(userCredential.user);
        appUser.name = name; // Ensure the name is set correctly
        await saveUser(appUser); // Save new user to Firestore
        setUser(appUser);
    }
  };

  const logout = async () => {
    // FIX: Use auth.signOut().
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, emailLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
