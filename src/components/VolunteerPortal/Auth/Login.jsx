import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import PortalTopActions from '../PortalTopActions';
import styles from '../VolunteerPortal.module.css';

const Login = () => {
    const { t } = useTranslation('volunteerPortal');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useVolunteerAuth();
    const from = location.state?.from?.pathname || '/volunteer-portal';
    const passwordChanged = Boolean(location.state?.passwordChanged);

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
            setError(err.message || t('auth.login.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <PortalTopActions />

            <div className={styles.authShell}>
                <motion.div
                    className={styles.authAside}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <span className={styles.authBadge}>{t('auth.login.badge')}</span>
                    <div className={styles.sectionStack}>
                        <h1 className={styles.authBrand}>MriJa</h1>
                        <p className={styles.authText}>
                            {t('auth.login.intro')}
                        </p>
                    </div>
                    <p className={styles.authFooter}>
                        {t('auth.login.footer')}
                    </p>
                </motion.div>

                <motion.div
                    className={styles.authPanel}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className={styles.sectionStack}>
                        <h2 className={styles.authTitle}>{t('auth.login.title')}</h2>
                        <p className={styles.authText}>{t('auth.login.description')}</p>
                    </div>

                    {passwordChanged && <p className={styles.successBanner}>{t('auth.login.passwordChanged')}</p>}
                    {error && <p className={styles.errorBanner}>{error}</p>}

                    <form onSubmit={handleLogin} className={styles.authForm}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>{t('common.email')}</label>
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
                            <label className={styles.fieldLabel}>{t('common.password')}</label>
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
                            {loading ? t('auth.login.submitting') : t('auth.login.submit')}
                        </button>

                        <p className={styles.authFooter}>
                            {t('auth.login.noAccount')} <Link to="/volunteer-portal/register" className={styles.authLink}>{t('auth.login.registerLink')}</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
