import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';

const hasAdminAccess = (role) => role === 'manager' || role === 'admin';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (loading) {
        return;
      }

      if (!currentUser) {
        if (isMounted) {
          setIsAllowed(false);
          setCheckingAccess(false);
        }
        return;
      }

      setCheckingAccess(true);

      try {
        const profileSnapshot = await getDoc(doc(db, 'volunteers', currentUser.uid));
        const role = profileSnapshot.data()?.role;

        if (isMounted) {
          setIsAllowed(hasAdminAccess(role));
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        if (isMounted) {
          setIsAllowed(false);
        }
      } finally {
        if (isMounted) {
          setCheckingAccess(false);
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [currentUser, loading]);

  // Wait for Firebase to resolve session before deciding to redirect
  if (loading || checkingAccess) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-muted)',
        fontSize: '14px',
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAllowed) {
    return <Navigate to="/volunteer-portal" replace />;
  }

  return children;
};

export default ProtectedRoute;
