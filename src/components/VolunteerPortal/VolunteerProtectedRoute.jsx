import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useVolunteerAuth } from '../../context/VolunteerAuthContext';
import { motion } from 'framer-motion';

/**
 * Protects volunteer portal routes.
 * - Loading auth state → show spinner
 * - Not logged in → redirect to /volunteer-portal/login
 * - Logged in (any status) → render children (Dashboard handles pending/rejected UI)
 */
const VolunteerProtectedRoute = ({ children }) => {
    const { user, loading } = useVolunteerAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-color)',
                flexDirection: 'column',
                gap: '16px',
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid var(--outline-variant)',
                        borderTopColor: 'var(--primary-color)',
                        borderRadius: '50%',
                    }}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/volunteer-portal/login" state={{ from: location }} replace />;
    }

    return children;
};

export default VolunteerProtectedRoute;
