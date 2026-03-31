import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create Volunteer Profile document
            await setDoc(doc(db, 'volunteers', user.uid), {
                name,
                email,
                phone,
                status: 'pending', // Requires admin approval
                role: 'user', // Default role until approved
                skills: [], // E.g. 'Driver', 'Translator'
                createdAt: serverTimestamp()
            });

            navigate('/volunteer-portal');
        } catch (err) {
            setError(err.message || "Registration failed.");
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    backgroundColor: 'var(--container-bg)', 
                    padding: '40px', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    maxWidth: '430px',
                    width: '100%'
                }}
            >
                <h2 style={{ color: 'var(--text-color)', marginBottom: '12px', textAlign: 'center' }}>Become a Volunteer</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center', fontSize: '14px' }}>
                    Join MriJa's volunteer network! After registration, an admin will review your profile to grant access to tasks.
                </p>
                {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                    <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                        Register
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                        Already have an account? <Link to="/volunteer-portal/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
