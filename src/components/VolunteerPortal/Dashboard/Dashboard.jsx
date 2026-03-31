import React, { useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

import PendingApprovals from '../Admin/PendingApprovals';
import RoleManager from '../Admin/RoleManager';
import ProfileSettings from './ProfileSettings';

const mockTasks = [
    {
        id: 1,
        title: "Assistant for Norwegian Course A1",
        description: "Help the main teacher coordinate the A1 class, answer simple questions, and manage the attendance limit.",
        date: "Every Saturday, 12:30",
        location: "Drammen Library",
        skillsRequired: ["Norwegian", "Teaching"],
        urgency: "High"
    },
    {
        id: 2,
        title: "Event Photographer",
        description: "Take photos and short videos during our upcoming cultural event. The material will be used for our social media.",
        date: "Next Friday, 18:00",
        location: "Main Hall",
        skillsRequired: ["Photography", "Social Media"],
        urgency: "Medium"
    },
    {
        id: 3,
        title: "Logistics Helper for Donations",
        description: "Help sorting, packing, and preparing boxes of warm clothes for the upcoming dispatch to Ukraine.",
        date: "Sunday, 10:00",
        location: "Warehouse",
        skillsRequired: ["Logistics", "Physical Work"],
        urgency: "High"
    }
];

const Dashboard = () => {
    const { currentUser, profile, loading } = useVolunteerAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/volunteer-portal/login');
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>Loading...</div>;
    }

    if (!currentUser) {
        // Redirection should ideally be handled by a ProtectedRoute wrapper, 
        // but adding an extra check here just in case.
        navigate('/volunteer-portal/login');
        return null;
    }

    if (profile?.status === 'pending') {
        return (
            <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: 'var(--container-bg)', 
                        padding: '40px', 
                        borderRadius: '16px', 
                        maxWidth: '500px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    <h2 style={{ color: 'var(--text-color)', marginBottom: '16px' }}>Registration Pending</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                        Thank you for registering, {profile.name}! Your account is currently under review by our administrators. 
                        Once approved, you will have full access to the Volunteer Portal to view tasks and manage your schedule.
                    </p>
                    <div style={{ padding: '20px', backgroundColor: 'rgba(254, 208, 0, 0.1)', border: '1px solid var(--secondary-color)', borderRadius: '8px', marginBottom: '24px' }}>
                        <p style={{ fontWeight: '600', color: 'var(--text-color)' }}>Current Status: <span style={{ color: 'var(--secondary-color)' }}>Pending Review</span></p>
                    </div>
                    <button onClick={handleLogout} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'transparent', color: 'var(--text-color)', cursor: 'pointer', transition: '0.2s' }}>
                        Log Out
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: 'var(--text-color)', fontSize: '32px', fontWeight: 'bold' }}>Volunteer Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Toggle theme">
                            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                        <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer' }}>
                            Log Out
                        </button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {activeTab === 'tasks' && (
                            <section style={{ backgroundColor: 'var(--container-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h2 style={{ color: 'var(--text-color)', marginBottom: '16px' }}>Available Tasks</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {mockTasks.map(task => (
                                        <div key={task.id} style={{ padding: '16px', border: '1px solid var(--outline-variant)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h3 style={{ color: 'var(--primary-color)', fontSize: '18px', margin: 0 }}>{task.title}</h3>
                                                <span style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '8px', backgroundColor: task.urgency === 'High' ? 'var(--badge-bg)' : 'transparent', color: task.urgency === 'High' ? '#c62828' : 'var(--text-color)', border: task.urgency === 'High' ? '1px solid #ffcdd2' : '1px solid var(--outline-variant)', fontWeight: 'bold' }}>
                                                    {task.urgency} Priority
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-color)', fontSize: '14px', margin: 0 }}>{task.description}</p>
                                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}><strong>When:</strong> {task.date}</p>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}><strong>Where:</strong> {task.location}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                                {task.skillsRequired.map(skill => (
                                                    <span key={skill} style={{ padding: '2px 8px', backgroundColor: 'var(--badge-bg)', border: '1px solid var(--badge-border)', borderRadius: '6px', fontSize: '12px', color: 'var(--badge-text)' }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <button style={{ marginTop: '12px', alignSelf: 'flex-start', padding: '8px 16px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                                Apply for Task
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {activeTab === 'profile' && <ProfileSettings />}
                        {activeTab === 'pending' && <PendingApprovals />}
                        {activeTab === 'roles' && <RoleManager />}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <section style={{ backgroundColor: 'var(--container-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '18px' }}>Your Profile</h3>
                            <p style={{ color: 'var(--text-color)', fontWeight: '600', marginBottom: '4px' }}>{profile?.name}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Role: <span style={{ textTransform: 'capitalize' }}>{profile?.role || 'volunteer'}</span></p>

                            <button onClick={() => setActiveTab('profile')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: activeTab === 'profile' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--text-color)', cursor: 'pointer', textAlign: 'left', marginBottom: '16px', transition: '0.2s' }}>
                                Edit Skills
                            </button>

                            <h4 style={{ color: 'var(--text-color)', fontSize: '14px', marginBottom: '8px' }}>Active Skills</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {profile?.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <span key={index} style={{ padding: '4px 8px', backgroundColor: 'var(--badge-bg)', border: '1px solid var(--badge-border)', borderRadius: '6px', fontSize: '12px', color: 'var(--badge-text)' }}>
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No skills added yet.</p>
                                )}
                            </div>
                        </section>

                        {(profile?.role === 'manager' || profile?.role === 'admin') && (
                            <section style={{ backgroundColor: 'var(--container-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--primary-color)' }}>
                                <h3 style={{ color: 'var(--primary-color)', marginBottom: '12px', fontSize: '18px' }}>Admin Tools</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button onClick={() => setActiveTab('pending')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: activeTab === 'pending' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'pending' ? 'white' : 'var(--text-color)', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}>
                                        Manage Pending Approvals
                                    </button>
                                    <button onClick={() => setActiveTab('roles')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: activeTab === 'roles' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'roles' ? 'white' : 'var(--text-color)', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}>
                                        Assign Roles
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
