import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const VolunteerAuthContext = createContext();

export const useVolunteerAuth = () => useContext(VolunteerAuthContext);

export const VolunteerAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;

    const cleanupProfileListener = () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      cleanupProfileListener();
      setCurrentUser(user);
      setLoading(true);

      if (user) {
        const docRef = doc(db, 'volunteers', user.uid);
        unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching volunteer profile', error);
          setProfile(null);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      cleanupProfileListener();
      unsubscribeAuth();
    };
  }, []);

  const value = {
    currentUser,
    profile, // contains { status: 'pending'|'approved', role: 'user'|'volunteer'|'manager'|'admin', etc }
    loading // Indicates if auth or profile is loading
  };

  return (
    <VolunteerAuthContext.Provider value={value}>
      {!loading && children}
    </VolunteerAuthContext.Provider>
  );
};
