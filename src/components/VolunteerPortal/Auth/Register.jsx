import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { registerVolunteer } from '../../../services/volunteerApi';
import styles from '../VolunteerPortal.module.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await registerVolunteer({ name, email, phone, password });
            setSuccess(true);
            setTimeout(() => navigate('/volunteer-portal/login'), 3500);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
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
                    <span className={styles.authBadge}>Apply to Volunteer</span>
                    <div className={styles.sectionStack}>
                        <h1 className={styles.authBrand}>MriJa</h1>
                        <p className={styles.authText}>
                            Join the volunteer network that helps with events, translations, logistics, and day-to-day support for the Ukrainian community in Drammen.
                        </p>
                    </div>
                    <p className={styles.authFooter}>
                        Your profile is reviewed by an administrator before access is granted, so the portal stays safe and organised for everyone.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.authPanel}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    {success ? (
                        <div className={styles.sectionStack} style={{ alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                            <CheckCircle2 size={52} style={{ color: 'var(--primary-color)' }} />
                            <h2 className={styles.authTitle}>Registration Submitted!</h2>
                            <p className={styles.authText}>
                                Your application has been received and is now pending review by an administrator.
                                You will be able to log in once your profile is approved.
                            </p>
                            <p className={styles.helper}>Redirecting you to login...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.sectionStack}>
                                <h2 className={styles.authTitle}>Become a Volunteer</h2>
                                <p className={styles.authText}>Create your profile and we will review it before opening portal access.</p>
                            </div>

                            {error && <p className={styles.errorBanner}>{error}</p>}

                            <form onSubmit={handleRegister} className={styles.authForm}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={styles.fieldInput}
                                    />
                                </div>

                                <div className={styles.splitRow}>
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
                                        <label className={styles.fieldLabel}>Phone (optional)</label>
                                        <input
                                            type="tel"
                                            placeholder="+47 ..."
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={styles.fieldInput}
                                        />
                                    </div>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Choose a secure password (min 8 characters)"
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={styles.fieldInput}
                                    />
                                </div>

                                <button type="submit" disabled={loading} className={styles.authSubmit}>
                                    {loading ? 'Submitting...' : 'Register'}
                                </button>

                                <p className={styles.authFooter}>
                                    Already have an account? <Link to="/volunteer-portal/login" className={styles.authLink}>Login</Link>
                                </p>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
