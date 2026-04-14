import React, { useState, useEffect, useCallback } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun,
    Moon,
    CheckCircle,
    ClipboardList,
    UserRound,
    BriefcaseBusiness,
    ShieldCheck,
    Settings2,
    UsersRound
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { fetchTasks, fetchMyTasks, applyToTask } from '../../../services/volunteerApi';

import PendingApprovals from '../Admin/PendingApprovals';
import RoleManager from '../Admin/RoleManager';
import TaskManager from '../Admin/TaskManager';
import ProfileSettings from './ProfileSettings';
import styles from '../VolunteerPortal.module.css';

const TASKS_POLL_INTERVAL = 30_000; // 30 seconds

const getUrgencyClass = (urgency) => {
    if (urgency === 'High') return styles.badgeHigh;
    if (urgency === 'Low') return styles.badgeLow;
    return styles.badgeMedium;
};

const TaskCard = ({ task, hasApplied, applyingId, onApply }) => (
    <article className={styles.taskCard}>
        <div className={styles.taskTop}>
            <div>
                <h3 className={styles.taskTitle}>{task.title}</h3>
            </div>
            <span className={getUrgencyClass(task.urgency)}>{task.urgency} priority</span>
        </div>

        <p className={styles.taskDescription}>{task.description}</p>

        <div className={styles.metaList}>
            <span className={styles.metaItem}>When: {task.date}</span>
            <span className={styles.metaItem}>Where: {task.location}</span>
            {task.marker ? <span className={styles.metaItem}>Marker: {task.marker}</span> : null}
        </div>

        <div className={styles.chipRow}>
            {task.skillsRequired?.length ? (
                task.skillsRequired.map((skill) => (
                    <span key={skill} className={styles.chip}>{skill}</span>
                ))
            ) : (
                <span className={styles.chip}>General support</span>
            )}
        </div>

        <div className={styles.actionRow}>
            <button
                onClick={() => onApply(task.id)}
                disabled={hasApplied || applyingId === task.id}
                className={hasApplied ? styles.statusButtonApplied : styles.statusButton}
            >
                {hasApplied && <CheckCircle size={16} />}
                {hasApplied ? 'Applied' : (applyingId === task.id ? 'Applying...' : 'Apply for Task')}
            </button>
        </div>
    </article>
);

const Dashboard = () => {
    const { user, logout } = useVolunteerAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const [tasks, setTasks] = useState([]);
    const [myTaskIds, setMyTaskIds] = useState(new Set());
    const [applyingId, setApplyingId] = useState(null);
    const [tasksError, setTasksError] = useState('');

    const isApproved = user?.status === 'approved';
    const isManager = user?.role === 'manager' || user?.role === 'admin';

    const loadTasks = useCallback(async () => {
        if (!isApproved || !user?.token) return;

        try {
            const [allTasksRes, myTasksRes] = await Promise.all([
                fetchTasks(user.token),
                fetchMyTasks(user.token)
            ]);
            setTasks(allTasksRes.items || []);
            setMyTaskIds(new Set((myTasksRes.items || []).map((t) => t.id)));
            setTasksError('');
        } catch (err) {
            console.error('Error loading tasks:', err);
            setTasksError('Unable to load tasks right now. Please try again shortly.');
        }
    }, [isApproved, user?.token]);

    // Initial load + polling
    useEffect(() => {
        loadTasks();
        const interval = setInterval(loadTasks, TASKS_POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [loadTasks]);

    const handleApply = async (taskId) => {
        if (!user?.token || myTaskIds.has(taskId)) return;

        setApplyingId(taskId);
        setTasksError('');
        try {
            await applyToTask(user.token, taskId);
            setMyTaskIds((prev) => new Set([...prev, taskId]));
        } catch (error) {
            setTasksError(error.message || 'Failed to apply for this task. Please try again.');
        }
        setApplyingId(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/volunteer-portal/login');
    };

    if (!user) {
        return null;
    }

    // ─── Status screens ──────────────────────────────────────────────────────

    if (user.status === 'rejected') {
        return (
            <div className={styles.portalPage}>
                <div className={styles.pendingCard}>
                    <span className={styles.statusPill}>Rejected</span>
                    <h2 className={styles.authTitle}>Registration Rejected</h2>
                    <p className={styles.authText}>
                        Your volunteer application is currently rejected. If you think this is a mistake, please contact the MriJa admin team.
                    </p>
                    <div className={styles.actionRow}>
                        <button onClick={handleLogout} className={styles.ghostButton}>Log Out</button>
                    </div>
                </div>
            </div>
        );
    }

    if (user.status !== 'approved') {
        return (
            <div className={styles.portalPage}>
                <div className={styles.pendingCard}>
                    <span className={styles.statusPill}>Pending Review</span>
                    <h2 className={styles.authTitle}>Registration Pending</h2>
                    <p className={styles.authText}>
                        Thank you for registering, {user.name || 'volunteer'}. Your profile is currently under review by the administrators.
                        Once approved, you will get full access to tasks, profile settings, and internal coordination tools.
                    </p>
                    <p className={styles.helper}>We use this step to keep the volunteer space safe and organised for everyone.</p>
                    <div className={styles.actionRow}>
                        <button onClick={handleLogout} className={styles.ghostButton}>Log Out</button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Approved dashboard ──────────────────────────────────────────────────

    const myTasks = tasks.filter((t) => myTaskIds.has(t.id));

    const volunteerMenu = [
        { id: 'tasks', label: 'Available Tasks', Icon: ClipboardList },
        { id: 'my_tasks', label: 'My Tasks', Icon: BriefcaseBusiness },
        { id: 'profile', label: 'Profile & Skills', Icon: UserRound }
    ];

    const adminMenu = [
        { id: 'manage_tasks', label: 'Manage Tasks', Icon: Settings2 },
        { id: 'pending', label: 'Pending Approvals', Icon: UsersRound },
        { id: 'roles', label: 'Assign Roles', Icon: ShieldCheck }
    ];

    const renderMainPanel = () => {
        if (activeTab === 'tasks') {
            return (
                <section className={styles.panel}>
                    <div className={styles.panelTitleRow}>
                        <div>
                            <h2 className={styles.panelTitle}>Available Tasks</h2>
                            <p className={styles.panelDescription}>Choose where you can help right now and apply directly from the task card.</p>
                        </div>
                    </div>

                    {tasksError && <p className={styles.errorBanner}>{tasksError}</p>}

                    <div className={styles.taskList}>
                        {tasks.length === 0 ? (
                            <p className={styles.emptyState}>No tasks are available right now.</p>
                        ) : (
                            tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    hasApplied={myTaskIds.has(task.id)}
                                    applyingId={applyingId}
                                    onApply={handleApply}
                                />
                            ))
                        )}
                    </div>
                </section>
            );
        }

        if (activeTab === 'my_tasks') {
            return (
                <section className={styles.panel}>
                    <div className={styles.panelTitleRow}>
                        <div>
                            <h2 className={styles.panelTitle}>My Assigned Tasks</h2>
                            <p className={styles.panelDescription}>Everything you have applied for or are currently helping with.</p>
                        </div>
                    </div>

                    <div className={styles.taskList}>
                        {myTasks.length === 0 ? (
                            <p className={styles.emptyState}>You haven't applied for any tasks yet.</p>
                        ) : (
                            myTasks.map((task) => (
                                <article key={task.id} className={styles.taskCard}>
                                    <div className={styles.taskTop}>
                                        <h3 className={styles.taskTitle}>{task.title}</h3>
                                        <span className={styles.statusButtonApplied}>Applied</span>
                                    </div>
                                    <div className={styles.metaList}>
                                        <span className={styles.metaItem}>When: {task.date}</span>
                                        <span className={styles.metaItem}>Where: {task.location}</span>
                                        {task.marker ? <span className={styles.metaItem}>Marker: {task.marker}</span> : null}
                                    </div>
                                    <p className={styles.taskDescription}>{task.description}</p>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            );
        }

        if (activeTab === 'profile') {
            return <ProfileSettings />;
        }

        if (activeTab === 'pending') {
            return isManager ? <PendingApprovals /> : (
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>Pending Approvals</h2>
                    <p className={styles.errorBanner}>You do not have permission to access this section.</p>
                </section>
            );
        }

        if (activeTab === 'roles') {
            return isManager ? <RoleManager /> : (
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>Role Manager</h2>
                    <p className={styles.errorBanner}>You do not have permission to access this section.</p>
                </section>
            );
        }

        if (activeTab === 'manage_tasks') {
            return isManager ? <TaskManager /> : (
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>Manage Tasks</h2>
                    <p className={styles.errorBanner}>You do not have permission to access this section.</p>
                </section>
            );
        }

        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Unavailable Section</h2>
                <p className={styles.panelDescription}>Please choose one of the available workspace tabs.</p>
            </section>
        );
    };

    return (
        <div className={styles.portalPage}>
            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
                {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <div className={styles.portalShell}>
                <header className={styles.portalHeader}>
                    <div className={styles.portalHeaderCopy}>
                        <span className={styles.portalEyebrow}>Volunteer Dashboard</span>
                        <h1 className={styles.portalTitle}>Hei, {user?.name?.split(' ')[0] || 'Volunteer'}</h1>
                        <p className={styles.portalSubtitle}>
                            Track tasks, update your availability, and coordinate with the MriJa team from one place.
                        </p>
                    </div>

                    <div className={styles.portalActionGroup}>
                        <button onClick={handleLogout} className={styles.ghostButton}>Log Out</button>
                    </div>
                </header>

                <div className={styles.metricGrid}>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{tasks.length}</span>
                        <span className={styles.metricLabel}>Open Tasks</span>
                    </div>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{myTasks.length}</span>
                        <span className={styles.metricLabel}>My Tasks</span>
                    </div>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{user?.skills?.length || 0}</span>
                        <span className={styles.metricLabel}>Listed Skills</span>
                    </div>
                </div>

                <div className={styles.portalGrid}>
                    <div className={styles.portalMain}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                            >
                                {renderMainPanel()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <aside className={styles.portalAside}>
                        <section className={styles.panel}>
                            <div className={styles.panelTitleRow}>
                                <div>
                                    <h2 className={styles.panelTitle}>Navigation</h2>
                                    <p className={styles.panelDescription}>Switch between your tasks, skills, and admin tools.</p>
                                </div>
                            </div>

                            <div className={styles.menuList}>
                                {volunteerMenu.map(({ id, label, Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={activeTab === id ? styles.menuButtonActive : styles.menuButton}
                                    >
                                        <span>{label}</span>
                                        <Icon size={16} />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={`${styles.panel} ${styles.panelAccent}`}>
                            <div className={styles.sectionStack}>
                                <span className={styles.adminBadge}>Profile</span>
                                <h3 className={styles.profileName}>{user?.name}</h3>
                                <p className={styles.profileMeta}>
                                    Role: <span style={{ textTransform: 'capitalize' }}>{user?.role || 'volunteer'}</span>
                                </p>
                                <div className={styles.chipRow}>
                                    {user?.skills?.length ? (
                                        user.skills.map((skill) => (
                                            <span key={skill} className={styles.chip}>{skill}</span>
                                        ))
                                    ) : (
                                        <p className={styles.emptyState}>No skills added yet.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {isManager && (
                            <section className={styles.panel}>
                                <div className={styles.panelTitleRow}>
                                    <div>
                                        <h2 className={styles.panelTitle}>Admin Tools</h2>
                                        <p className={styles.panelDescription}>Manager actions for tasks, approvals, and roles.</p>
                                    </div>
                                </div>

                                <div className={styles.menuList}>
                                    {adminMenu.map(({ id, label, Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={activeTab === id ? styles.menuButtonActive : styles.menuButton}
                                        >
                                            <span>{label}</span>
                                            <Icon size={16} />
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
