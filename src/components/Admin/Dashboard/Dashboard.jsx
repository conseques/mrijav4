import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

import EventsManager from './EventsManager';
import RegistrationsManager from './RegistrationsManager';
import PastEventsManager from './PastEventsManager';
import CoursesManager from './CoursesManager';
import ReportManager from './ReportManager';


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
            Upcoming Events
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'pastevents' ? styles.active : ''}`}
            onClick={() => setActiveTab('pastevents')}
          >
            Past Events
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'registrations' ? styles.active : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations
          </button>
          <button 
            className={`${styles.navBtn} ${activeTab === 'report' ? styles.active : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Detailed Report
          </button>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'events' && (
          <EventsManager />
        )}
        
        {activeTab === 'pastevents' && (
          <PastEventsManager />
        )}

        {activeTab === 'courses' && (
          <CoursesManager />
        )}

        {activeTab === 'registrations' && (
          <RegistrationsManager />
        )}

        {activeTab === 'report' && (
          <ReportManager />
        )}
      </main>

    </div>
  );
};

export default Dashboard;
