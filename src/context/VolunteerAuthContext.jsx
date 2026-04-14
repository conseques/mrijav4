import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchMe, loginVolunteer } from '../services/volunteerApi';

const TOKEN_KEY = 'mrija_volunteer_token';

const VolunteerAuthContext = createContext(null);

export const useVolunteerAuth = () => useContext(VolunteerAuthContext);

export const VolunteerAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    fetchMe(storedToken)
      .then(({ user: fetchedUser }) => {
        setUser({ ...fetchedUser, token: storedToken });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: loggedInUser } = await loginVolunteer({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setUser({ ...loggedInUser, token });
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return;

    try {
      const { user: refreshed } = await fetchMe(storedToken);
      setUser({ ...refreshed, token: storedToken });
    } catch {
      logout();
    }
  }, [logout]);

  const value = {
    user,       // { id, email, name, phone, status, role, skills, token } | null
    loading,
    login,
    logout,
    refreshUser
  };

  return (
    <VolunteerAuthContext.Provider value={value}>
      {children}
    </VolunteerAuthContext.Provider>
  );
};
