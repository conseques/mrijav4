import React, { useMemo, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  History,
  BookOpen,
  ClipboardList,
  BadgeCheck,
  BarChart3,
  HardDrive,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './Dashboard.module.css';

import EventsManager from './EventsManager';
import RegistrationsManager from './RegistrationsManager';
import MembershipsManager from './MembershipsManager';
import PastEventsManager from './PastEventsManager';
import CoursesManager from './CoursesManager';
import ReportManager from './ReportManager';
import StorageMaintenance from './StorageMaintenance';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const tabs = useMemo(() => ([
    { id: 'events', label: 'Upcoming Events', description: 'Manage new event listings and translations.', Icon: CalendarDays, component: <EventsManager /> },
    { id: 'pastevents', label: 'Past Events', description: 'Keep the archive of community highlights updated.', Icon: History, component: <PastEventsManager /> },
    { id: 'courses', label: 'Courses', description: 'Edit course offerings, teachers, and details.', Icon: BookOpen, component: <CoursesManager /> },
    { id: 'storage', label: 'Storage', description: 'Scan Firebase Storage and clean orphaned uploads that still consume quota.', Icon: HardDrive, component: <StorageMaintenance /> },
    { id: 'registrations', label: 'Registrations', description: 'Review sign-ups and contact details for events.', Icon: ClipboardList, component: <RegistrationsManager /> },
    { id: 'memberships', label: 'Memberships', description: 'Track confirmed Vipps memberships and payment references.', Icon: BadgeCheck, component: <MembershipsManager /> },
    { id: 'report', label: 'Detailed Report', description: 'Update fundraising metrics and public report data.', Icon: BarChart3, component: <ReportManager /> }
  ]), []);

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <span className={styles.brandBadge}>Admin Workspace</span>
          <h2 className={styles.logo}>MriJa <span>Admin</span></h2>
          <p className={styles.sidebarText}>A focused control room for events, registrations, courses, and public reporting.</p>
        </div>

        <nav className={styles.nav}>
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`${styles.navBtn} ${activeTab === id ? styles.active : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <span>{label}</span>
              <Icon size={16} />
            </button>
          ))}
        </nav>

        <div className={styles.sidebarActions}>
          <button onClick={toggleTheme} className={styles.utilityBtn} aria-label="Toggle theme">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? 'Light' : 'Dark'} mode</span>
          </button>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarCopy}>
            <span className={styles.topbarEyebrow}>MriJa Operations</span>
            <h1 className={styles.pageTitle}>{currentTab.label}</h1>
            <p className={styles.pageDescription}>{currentTab.description}</p>
          </div>
        </header>

        <div className={styles.contentShell}>
          {currentTab.component}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
