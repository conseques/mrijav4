import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const hasAdminAccess = (role) => role === 'manager' || role === 'admin';

const ProtectedRoute = ({ children }) => {
  const { currentUser, backendUser, loading } = useAuth();

  if (loading) {
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

  // backendUser is null if exchange failed (email not in backend, or wrong role)
  if (!backendUser || !hasAdminAccess(backendUser.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
