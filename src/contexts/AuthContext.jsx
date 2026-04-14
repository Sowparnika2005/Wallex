// ============================================
// FINTRACKER — AUTH CONTEXT
// ============================================
// Manages Firebase authentication state.
// Falls back to demo user when Firebase is not configured.

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { SAMPLE_USER } from '../utils/sampleData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      // Demo mode — auto-login with sample user
      setIsDemo(true);
      setCurrentUser(SAMPLE_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || userDoc.data()?.displayName || 'User',
            photoURL: user.photoURL,
            ...userDoc.data(),
          });
        } catch {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'User',
            photoURL: user.photoURL,
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email/password
  const signup = async (email, password, displayName) => {
    if (isDemo) {
      setCurrentUser({ ...SAMPLE_USER, displayName, email });
      return;
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName,
      email,
      createdAt: new Date().toISOString(),
      currency: 'INR',
      darkMode: false,
      notifications: true,
    });

    return user;
  };

  // Sign in with email/password
  const login = async (email, password) => {
    if (isDemo) {
      setCurrentUser({ ...SAMPLE_USER, email });
      return;
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out
  const logout = async () => {
    if (isDemo) {
      setCurrentUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    isDemo,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
