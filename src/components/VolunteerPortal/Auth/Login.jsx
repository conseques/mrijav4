import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleTheme } = useTheme();
    // Where to go after login — the page they originally tried to visit
    const from = location.state?.from?.pathname || '/volunteer-portal';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err.code === 'auth/invalid-credential'
                ? 'Invalid email or password.'
                : (err.message || 'Failed to log in.');
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={toggleTheme} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Toggle theme">
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    backgroundColor: 'var(--container-bg)', 
                    padding: '40px', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    maxWidth: '400px',
                    width: '100%'
                }}
            >
                <h2 style={{ color: 'var(--text-color)', marginBottom: '24px', textAlign: 'center' }}>Volunteer Login</h2>
                {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                    <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                        Don't have an account? <Link to="/volunteer-portal/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
