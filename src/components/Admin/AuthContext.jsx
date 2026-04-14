import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '../../firebase';
import { exchangeFirebaseToken } from '../../services/volunteerApi';

const BACKEND_TOKEN_KEY = 'mrija_admin_backend_token';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendToken, setBackendToken] = useState(() => sessionStorage.getItem(BACKEND_TOKEN_KEY));
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const exchangeToken = useCallback(async (firebaseUser) => {
    try {
      const idToken = await getIdToken(firebaseUser, false);
      const { token, user } = await exchangeFirebaseToken(idToken);
      sessionStorage.setItem(BACKEND_TOKEN_KEY, token);
      setBackendToken(token);
      setBackendUser(user);
      return { token, user };
    } catch (err) {
      console.error('Backend token exchange failed:', err.message);
      sessionStorage.removeItem(BACKEND_TOKEN_KEY);
      setBackendToken(null);
      setBackendUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await exchangeToken(user);
      } else {
        sessionStorage.removeItem(BACKEND_TOKEN_KEY);
        setBackendToken(null);
        setBackendUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [exchangeToken]);

  const value = {
    currentUser,
    backendToken,
    backendUser,  // { id, email, name, role, status, ... } from backend
    loading,
    exchangeToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
