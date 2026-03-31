import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useVolunteerAuth } from '../../context/VolunteerAuthContext';
import { motion } from 'framer-motion';

/**
 * Protects volunteer portal routes.
 * - Not logged in → redirect to /volunteer-portal/login
 * - Logged in but pending approval → show pending screen (handled in Dashboard)
 * - Logged in + approved → render children
 */
const VolunteerProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useVolunteerAuth();
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

    if (!currentUser) {
        // Preserve the URL they tried to visit so we can redirect back after login
        return <Navigate to="/volunteer-portal/login" state={{ from: location }} replace />;
    }

    return children;
};

export default VolunteerProtectedRoute;
