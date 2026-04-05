import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import styles from '../VolunteerPortal.module.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'volunteers', user.uid), {
                name,
                email,
                phone,
                status: 'pending',
                role: 'user',
                skills: [],
                createdAt: serverTimestamp()
            });

            navigate('/volunteer-portal');
        } catch (err) {
            setError(err.message || 'Registration failed.');
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
                                <label className={styles.fieldLabel}>Phone</label>
                                <input
                                    type="tel"
                                    placeholder="+47 ..."
                                    required
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
                                placeholder="Choose a secure password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.fieldInput}
                            />
                        </div>

                        <button type="submit" className={styles.authSubmit}>
                            Register
                        </button>

                        <p className={styles.authFooter}>
                            Already have an account? <Link to="/volunteer-portal/login" className={styles.authLink}>Login</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
