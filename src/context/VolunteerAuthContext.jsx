import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const VolunteerAuthContext = createContext();

export const useVolunteerAuth = () => useContext(VolunteerAuthContext);

export const VolunteerAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or listen to profile changes
        const docRef = doc(db, 'volunteers', user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                setProfile(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching volunteer profile", error);
            setLoading(false);
        });

        // Cleanup snapshot listener on unmount or auth change
        return () => unsubscribeSnapshot();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
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
