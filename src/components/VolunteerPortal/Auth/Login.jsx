import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import styles from '../VolunteerPortal.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();
    const { login } = useVolunteerAuth();
    const from = location.state?.from?.pathname || '/volunteer-portal';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loggedInUser = await login(email, password);

            // Handle pending / rejected status — redirect to portal, dashboard shows a message
            if (loggedInUser.status === 'pending') {
                navigate('/volunteer-portal', { replace: true });
                return;
            }

            if (loggedInUser.status === 'rejected') {
                navigate('/volunteer-portal', { replace: true });
                return;
            }

            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to log in. Check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <div className={styles.authShell}>
                <motion.div
                    className={styles.authAside}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <span className={styles.authBadge}>Volunteer Portal</span>
                    <div className={styles.sectionStack}>
                        <h1 className={styles.authBrand}>MriJa</h1>
                        <p className={styles.authText}>
                            Log in to view live tasks, keep your skills updated, and coordinate practical help with the rest of the community.
                        </p>
                    </div>
                    <p className={styles.authFooter}>
                        Approved volunteers get access to assignments, admin notes, and the internal workflow used to support events and local aid.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.authPanel}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className={styles.sectionStack}>
                        <h2 className={styles.authTitle}>Volunteer Login</h2>
                        <p className={styles.authText}>Use the email and password linked to your volunteer profile.</p>
                    </div>

                    {error && <p className={styles.errorBanner}>{error}</p>}

                    <form onSubmit={handleLogin} className={styles.authForm}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.fieldInput}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.fieldInput}
                            />
                        </div>

                        <button type="submit" disabled={loading} className={styles.authSubmit}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className={styles.authFooter}>
                            Don't have an account? <Link to="/volunteer-portal/register" className={styles.authLink}>Register</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
