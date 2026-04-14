import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { exchangeToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);

      // Exchange Firebase token for backend JWT and verify admin role
      const result = await exchangeToken(credentials.user);

      if (!result) {
        await signOut(auth);
        setError('This account does not have a matching backend profile. Contact the system administrator.');
        return;
      }

      const { user: backendUser } = result;
      if (backendUser.role !== 'manager' && backendUser.role !== 'admin') {
        await signOut(auth);
        setError('This account does not have access to the admin panel.');
        return;
      }

      navigate('/admin/dashboard');
    } catch (err) {
      if (auth.currentUser) {
        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error('Error clearing session after failed admin login:', signOutError);
        }
      }

      const message = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : (err.message || 'Failed to log in. Please check your credentials.');

      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={styles.heroCopy}>
        <span className={styles.badge}>Admin Workspace</span>
        <h1 className={styles.heroTitle}>MriJa Admin</h1>
        <p className={styles.heroText}>
          Manage public content, event registrations, courses, and reporting from one focused control panel.
        </p>
      </div>

      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>MriJa <span>Admin</span></h1>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email ID</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mrija.no"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button disabled={loading} type="submit" className={styles.loginBtn}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
