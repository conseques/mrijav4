import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

import EventsManager from './EventsManager';
import RegistrationsManager from './RegistrationsManager';
import MigrateBtn from './MigrateBtn';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>MriJa <span>Admin</span></h2>
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navBtn} ${activeTab === 'events' ? styles.active : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events Manager
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'registrations' ? styles.active : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations
          </button>
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'events' && (
          <>
            <MigrateBtn />
            <EventsManager />
          </>
        )}
        
        {activeTab === 'registrations' && (
          <RegistrationsManager />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
