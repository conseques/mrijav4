import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { registerVolunteer } from '../../../services/volunteerApi';
import PortalTopActions from '../PortalTopActions';
import styles from '../VolunteerPortal.module.css';

const Register = () => {
    const { t } = useTranslation('volunteerPortal');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
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
            setError(err.message || t('auth.register.error'));
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
                    <span className={styles.authBadge}>{t('auth.register.badge')}</span>
                    <div className={styles.sectionStack}>
                        <h1 className={styles.authBrand}>MriJa</h1>
                        <p className={styles.authText}>
                            {t('auth.register.intro')}
                        </p>
                    </div>
                    <p className={styles.authFooter}>
                        {t('auth.register.footer')}
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
                            <h2 className={styles.authTitle}>{t('auth.register.successTitle')}</h2>
                            <p className={styles.authText}>
                                {t('auth.register.successDescription')}
                            </p>
                            <p className={styles.helper}>{t('auth.register.redirecting')}</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.sectionStack}>
                                <h2 className={styles.authTitle}>{t('auth.register.title')}</h2>
                                <p className={styles.authText}>{t('auth.register.description')}</p>
                            </div>

                            {error && <p className={styles.errorBanner}>{error}</p>}

                            <form onSubmit={handleRegister} className={styles.authForm}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>{t('auth.register.fullName')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('auth.register.fullName')}
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={styles.fieldInput}
                                    />
                                </div>

                                <div className={styles.splitRow}>
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
                                        <label className={styles.fieldLabel}>{t('auth.register.phone')}</label>
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
                                    <label className={styles.fieldLabel}>{t('common.password')}</label>
                                    <input
                                        type="password"
                                        placeholder={t('auth.register.passwordPlaceholder')}
                                        required
                                        minLength={8}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={styles.fieldInput}
                                    />
                                </div>

                                <button type="submit" disabled={loading} className={styles.authSubmit}>
                                    {loading ? t('auth.register.submitting') : t('auth.register.submit')}
                                </button>

                                <p className={styles.authFooter}>
                                    {t('auth.register.hasAccount')} <Link to="/volunteer-portal/login" className={styles.authLink}>{t('auth.register.loginLink')}</Link>
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
