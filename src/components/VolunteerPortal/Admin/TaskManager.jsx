import React, { useState, useEffect, useCallback } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { fetchTasks, createTask, deleteTask } from '../../../services/volunteerApi';
import { useTranslation } from 'react-i18next';
import { getSkillLabel, getUrgencyLabel } from '../portalText';
import styles from '../VolunteerPortal.module.css';

const TaskManager = () => {
    const { t } = useTranslation('volunteerPortal');
    const { user } = useVolunteerAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [marker, setMarker] = useState('');
    const [skillsString, setSkillsString] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const canManageTasks = user?.role === 'manager' || user?.role === 'admin';

    const loadTasks = useCallback(async () => {
        if (!user?.token || !canManageTasks) return;
        try {
            const { items } = await fetchTasks(user.token);
            setTasks(items || []);
        } catch (err) {
            setError(err.message || t('admin.tasks.loadError'));
        } finally {
            setLoading(false);
        }
    }, [user?.token, canManageTasks, t]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    if (!canManageTasks) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>{t('admin.tasks.title')}</h2>
                <p className={styles.errorBanner}>{t('common.permissionDenied')}</p>
            </section>
        );
    }

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
        setMarker('');
        setSkillsString('');
        setUrgency('Medium');
        setIsAdding(false);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const skillsArray = skillsString.split(',').map((s) => s.trim()).filter(Boolean);
            const { item } = await createTask(user.token, {
                title,
                description,
                date,
                location,
                marker: marker.trim(),
                skillsRequired: skillsArray,
                urgency
            });
            setTasks((prev) => [item, ...prev]);
            resetForm();
        } catch (err) {
            setError(err.message || t('admin.tasks.addError'));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm(t('admin.tasks.confirmDelete'))) return;
        setError('');
        try {
            await deleteTask(user.token, taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch (err) {
            setError(err.message || t('admin.tasks.deleteError'));
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>{t('admin.tasks.title')}</h2>
                    <p className={styles.panelDescription}>{t('admin.tasks.description')}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className={isAdding ? styles.ghostButton : styles.primaryButton}
                >
                    {isAdding ? t('admin.tasks.closeForm') : t('admin.tasks.newTask')}
                </button>
            </div>

            {error && <p className={styles.errorBanner}>{error}</p>}

            {isAdding && (
                <form onSubmit={handleAddTask} className={styles.sectionStack}>
                    <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>{t('admin.tasks.taskTitle')}</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.fieldInput} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>{t('admin.tasks.urgency')}</label>
                            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className={styles.selectInput}>
                                <option value="Low">{getUrgencyLabel(t, 'Low')}</option>
                                <option value="Medium">{getUrgencyLabel(t, 'Medium')}</option>
                                <option value="High">{getUrgencyLabel(t, 'High')}</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>{t('admin.tasks.descriptionLabel')}</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className={styles.fieldTextarea} />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>{t('admin.tasks.dateTime')}</label>
                            <input value={date} onChange={(e) => setDate(e.target.value)} required className={styles.fieldInput} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>{t('admin.tasks.location')}</label>
                            <input value={location} onChange={(e) => setLocation(e.target.value)} required className={styles.fieldInput} />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>{t('admin.tasks.marker')}</label>
                        <input
                            value={marker}
                            onChange={(e) => setMarker(e.target.value)}
                            placeholder={t('admin.tasks.markerPlaceholder')}
                            className={styles.fieldInput}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>{t('admin.tasks.skills')}</label>
                        <input
                            value={skillsString}
                            onChange={(e) => setSkillsString(e.target.value)}
                            placeholder={t('admin.tasks.skillsPlaceholder')}
                            className={styles.fieldInput}
                        />
                    </div>

                    <div className={styles.actionRow}>
                        <button type="submit" disabled={saving} className={styles.primaryButton}>
                            {saving ? t('common.saving') : t('admin.tasks.saveTask')}
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.taskList}>
                {loading ? (
                    <p className={styles.emptyState}>{t('admin.tasks.loading')}</p>
                ) : tasks.length === 0 ? (
                    <p className={styles.emptyState}>{t('admin.tasks.empty')}</p>
                ) : (
                    tasks.map((task) => (
                        <article key={task.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{task.title}</h3>
                                    <p className={styles.profileMeta}>{t('admin.tasks.applicants', { count: task.appliedUsers?.length || 0 })}</p>
                                    {task.marker ? <p className={styles.profileMeta}>{t('tasks.marker', { marker: task.marker })}</p> : null}
                                </div>
                                <span className={task.urgency === 'High' ? styles.badgeHigh : task.urgency === 'Low' ? styles.badgeLow : styles.badgeMedium}>
                                    {getUrgencyLabel(t, task.urgency)}
                                </span>
                            </div>

                            <div className={styles.metaList}>
                                <span className={styles.metaItem}>{task.date}</span>
                                <span className={styles.metaItem}>{task.location}</span>
                            </div>

                            <div className={styles.chipRow}>
                                {task.skillsRequired?.map((skill) => (
                                    <span key={skill} className={styles.chip}>{getSkillLabel(t, skill)}</span>
                                ))}
                            </div>

                            <div className={styles.actionRow}>
                                <button onClick={() => handleDeleteTask(task.id)} className={styles.dangerButton}>
                                    {t('common.delete')}
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
};

export default TaskManager;
