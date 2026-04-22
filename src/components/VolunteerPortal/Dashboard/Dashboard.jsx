import React, { useState, useEffect, useCallback } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    ClipboardList,
    UserRound,
    BriefcaseBusiness,
    ShieldCheck,
    Settings2,
    UsersRound
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchTasks, fetchMyTasks, applyToTask } from '../../../services/volunteerApi';

import PendingApprovals from '../Admin/PendingApprovals';
import RoleManager from '../Admin/RoleManager';
import TaskManager from '../Admin/TaskManager';
import ProfileSettings from './ProfileSettings';
import PortalTopActions from '../PortalTopActions';
import { getRoleLabel, getSkillLabel, getUrgencyLabel } from '../portalText';
import styles from '../VolunteerPortal.module.css';

const TASKS_POLL_INTERVAL = 30_000; // 30 seconds

const getUrgencyClass = (urgency) => {
    if (urgency === 'High') return styles.badgeHigh;
    if (urgency === 'Low') return styles.badgeLow;
    return styles.badgeMedium;
};

const TaskCard = ({ task, hasApplied, applyingId, onApply, t }) => {
    const urgencyLabel = getUrgencyLabel(t, task.urgency);

    return (
    <article className={styles.taskCard}>
        <div className={styles.taskTop}>
            <div>
                <h3 className={styles.taskTitle}>{task.title}</h3>
            </div>
            <span className={getUrgencyClass(task.urgency)}>
                {t('tasks.priority', { urgency: urgencyLabel })}
            </span>
        </div>

        <p className={styles.taskDescription}>{task.description}</p>

        <div className={styles.metaList}>
            <span className={styles.metaItem}>{t('tasks.when', { date: task.date })}</span>
            <span className={styles.metaItem}>{t('tasks.where', { location: task.location })}</span>
            {task.marker ? <span className={styles.metaItem}>{t('tasks.marker', { marker: task.marker })}</span> : null}
        </div>

        <div className={styles.chipRow}>
            {task.skillsRequired?.length ? (
                task.skillsRequired.map((skill) => (
                    <span key={skill} className={styles.chip}>{getSkillLabel(t, skill)}</span>
                ))
            ) : (
                <span className={styles.chip}>{t('tasks.generalSupport')}</span>
            )}
        </div>

        <div className={styles.actionRow}>
            <button
                onClick={() => onApply(task.id)}
                disabled={hasApplied || applyingId === task.id}
                className={hasApplied ? styles.statusButtonApplied : styles.statusButton}
            >
                {hasApplied && <CheckCircle size={16} />}
                {hasApplied ? t('tasks.applied') : (applyingId === task.id ? t('tasks.applying') : t('tasks.apply'))}
            </button>
        </div>
    </article>
    );
};

const Dashboard = () => {
    const { t } = useTranslation('volunteerPortal');
    const { user, logout } = useVolunteerAuth();
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
            setTasksError(t('tasks.loadError'));
        }
    }, [isApproved, user?.token, t]);

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
            setTasksError(error.message || t('tasks.applyError'));
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
                <PortalTopActions />
                <div className={styles.pendingCard}>
                    <span className={styles.statusPill}>{t('status.rejectedPill')}</span>
                    <h2 className={styles.authTitle}>{t('status.rejectedTitle')}</h2>
                    <p className={styles.authText}>
                        {t('status.rejectedText')}
                    </p>
                    <div className={styles.actionRow}>
                        <button onClick={handleLogout} className={styles.ghostButton}>{t('common.logout')}</button>
                    </div>
                </div>
            </div>
        );
    }

    if (user.status !== 'approved') {
        return (
            <div className={styles.portalPage}>
                <PortalTopActions />
                <div className={styles.pendingCard}>
                    <span className={styles.statusPill}>{t('status.pendingPill')}</span>
                    <h2 className={styles.authTitle}>{t('status.pendingTitle')}</h2>
                    <p className={styles.authText}>
                        {t('status.pendingText', { name: user.name || t('status.fallbackName') })}
                    </p>
                    <p className={styles.helper}>{t('status.pendingHelper')}</p>
                    <div className={styles.actionRow}>
                        <button onClick={handleLogout} className={styles.ghostButton}>{t('common.logout')}</button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Approved dashboard ──────────────────────────────────────────────────

    const myTasks = tasks.filter((t) => myTaskIds.has(t.id));

    const volunteerMenu = [
        { id: 'tasks', label: t('dashboard.navigation.availableTasks'), Icon: ClipboardList },
        { id: 'my_tasks', label: t('dashboard.navigation.myTasks'), Icon: BriefcaseBusiness },
        { id: 'profile', label: t('dashboard.navigation.profileSkills'), Icon: UserRound }
    ];

    const adminMenu = [
        { id: 'manage_tasks', label: t('dashboard.adminTools.manageTasks'), Icon: Settings2 },
        { id: 'pending', label: t('dashboard.adminTools.pendingApprovals'), Icon: UsersRound },
        { id: 'roles', label: t('dashboard.adminTools.assignRoles'), Icon: ShieldCheck }
    ];

    const renderMainPanel = () => {
        if (activeTab === 'tasks') {
            return (
                <section className={styles.panel}>
                    <div className={styles.panelTitleRow}>
                        <div>
                            <h2 className={styles.panelTitle}>{t('tasks.title')}</h2>
                            <p className={styles.panelDescription}>{t('tasks.description')}</p>
                        </div>
                    </div>

                    {tasksError && <p className={styles.errorBanner}>{tasksError}</p>}

                    <div className={styles.taskList}>
                        {tasks.length === 0 ? (
                            <p className={styles.emptyState}>{t('tasks.empty')}</p>
                        ) : (
                            tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    hasApplied={myTaskIds.has(task.id)}
                                    applyingId={applyingId}
                                    onApply={handleApply}
                                    t={t}
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
                            <h2 className={styles.panelTitle}>{t('tasks.myTitle')}</h2>
                            <p className={styles.panelDescription}>{t('tasks.myDescription')}</p>
                        </div>
                    </div>

                    <div className={styles.taskList}>
                        {myTasks.length === 0 ? (
                            <p className={styles.emptyState}>{t('tasks.myEmpty')}</p>
                        ) : (
                            myTasks.map((task) => (
                                <article key={task.id} className={styles.taskCard}>
                                    <div className={styles.taskTop}>
                                        <h3 className={styles.taskTitle}>{task.title}</h3>
                                        <span className={styles.statusButtonApplied}>{t('tasks.applied')}</span>
                                    </div>
                                    <div className={styles.metaList}>
                                        <span className={styles.metaItem}>{t('tasks.when', { date: task.date })}</span>
                                        <span className={styles.metaItem}>{t('tasks.where', { location: task.location })}</span>
                                        {task.marker ? <span className={styles.metaItem}>{t('tasks.marker', { marker: task.marker })}</span> : null}
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
                    <h2 className={styles.panelTitle}>{t('dashboard.adminTools.pendingApprovals')}</h2>
                    <p className={styles.errorBanner}>{t('common.permissionDenied')}</p>
                </section>
            );
        }

        if (activeTab === 'roles') {
            return isManager ? <RoleManager /> : (
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>{t('admin.roles.title')}</h2>
                    <p className={styles.errorBanner}>{t('common.permissionDenied')}</p>
                </section>
            );
        }

        if (activeTab === 'manage_tasks') {
            return isManager ? <TaskManager /> : (
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>{t('dashboard.adminTools.manageTasks')}</h2>
                    <p className={styles.errorBanner}>{t('common.permissionDenied')}</p>
                </section>
            );
        }

        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>{t('dashboard.unavailableTitle')}</h2>
                <p className={styles.panelDescription}>{t('dashboard.unavailableDescription')}</p>
            </section>
        );
    };

    return (
        <div className={styles.portalPage}>
            <PortalTopActions />

            <div className={styles.portalShell}>
                <header className={styles.portalHeader}>
                    <div className={styles.portalHeaderCopy}>
                        <span className={styles.portalEyebrow}>{t('dashboard.eyebrow')}</span>
                        <h1 className={styles.portalTitle}>{t('dashboard.title', { name: user?.name?.split(' ')[0] || t('dashboard.fallbackName') })}</h1>
                        <p className={styles.portalSubtitle}>
                            {t('dashboard.subtitle')}
                        </p>
                    </div>

                    <div className={styles.portalActionGroup}>
                        <button onClick={handleLogout} className={styles.ghostButton}>{t('common.logout')}</button>
                    </div>
                </header>

                <div className={styles.metricGrid}>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{tasks.length}</span>
                        <span className={styles.metricLabel}>{t('dashboard.metrics.openTasks')}</span>
                    </div>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{myTasks.length}</span>
                        <span className={styles.metricLabel}>{t('dashboard.metrics.myTasks')}</span>
                    </div>
                    <div className={styles.metricCard}>
                        <span className={styles.metricValue}>{user?.skills?.length || 0}</span>
                        <span className={styles.metricLabel}>{t('dashboard.metrics.listedSkills')}</span>
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
                                    <h2 className={styles.panelTitle}>{t('dashboard.navigation.title')}</h2>
                                    <p className={styles.panelDescription}>{t('dashboard.navigation.description')}</p>
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
                                <span className={styles.adminBadge}>{t('dashboard.profileCard.badge')}</span>
                                <h3 className={styles.profileName}>{user?.name}</h3>
                                <p className={styles.profileMeta}>
                                    {t('dashboard.profileCard.role')} <span style={{ textTransform: 'capitalize' }}>{getRoleLabel(t, user?.role || 'volunteer')}</span>
                                </p>
                                <div className={styles.chipRow}>
                                    {user?.skills?.length ? (
                                        user.skills.map((skill) => (
                                            <span key={skill} className={styles.chip}>{getSkillLabel(t, skill)}</span>
                                        ))
                                    ) : (
                                        <p className={styles.emptyState}>{t('dashboard.profileCard.noSkills')}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {isManager && (
                            <section className={styles.panel}>
                                <div className={styles.panelTitleRow}>
                                    <div>
                                        <h2 className={styles.panelTitle}>{t('dashboard.adminTools.title')}</h2>
                                        <p className={styles.panelDescription}>{t('dashboard.adminTools.description')}</p>
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
