import React, { useState, useEffect, useCallback } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { fetchTasks, createTask, deleteTask } from '../../../services/volunteerApi';
import styles from '../VolunteerPortal.module.css';

const TaskManager = () => {
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
            setError(err.message || 'Unable to load tasks.');
        } finally {
            setLoading(false);
        }
    }, [user?.token, canManageTasks]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    if (!canManageTasks) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Manage Tasks</h2>
                <p className={styles.errorBanner}>You do not have permission to access this section.</p>
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
            setError(err.message || 'Failed to add task.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        setError('');
        try {
            await deleteTask(user.token, taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch (err) {
            setError(err.message || 'Failed to delete task.');
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>Manage Tasks</h2>
                    <p className={styles.panelDescription}>Create new volunteer tasks and keep the board up to date.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={isAdding ? styles.ghostButton : styles.primaryButton}
                >
                    {isAdding ? 'Close Form' : 'New Task'}
                </button>
            </div>

            {error && <p className={styles.errorBanner}>{error}</p>}

            {isAdding && (
                <form onSubmit={handleAddTask} className={styles.sectionStack}>
                    <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Task Title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.fieldInput} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Urgency</label>
                            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className={styles.selectInput}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className={styles.fieldTextarea} />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Date & Time</label>
                            <input value={date} onChange={(e) => setDate(e.target.value)} required className={styles.fieldInput} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Location</label>
                            <input value={location} onChange={(e) => setLocation(e.target.value)} required className={styles.fieldInput} />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Marker Label (optional)</label>
                        <input
                            value={marker}
                            onChange={(e) => setMarker(e.target.value)}
                            placeholder="Zone A / Driver Team / Booth 03"
                            className={styles.fieldInput}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Required Skills (comma-separated)</label>
                        <input
                            value={skillsString}
                            onChange={(e) => setSkillsString(e.target.value)}
                            placeholder="Translator, Driver, Event Helper"
                            className={styles.fieldInput}
                        />
                    </div>

                    <div className={styles.actionRow}>
                        <button type="submit" disabled={saving} className={styles.primaryButton}>
                            {saving ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.taskList}>
                {loading ? (
                    <p className={styles.emptyState}>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className={styles.emptyState}>No tasks currently available.</p>
                ) : (
                    tasks.map((task) => (
                        <article key={task.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{task.title}</h3>
                                    <p className={styles.profileMeta}>Applicants: {task.appliedUsers?.length || 0}</p>
                                    {task.marker ? <p className={styles.profileMeta}>Marker: {task.marker}</p> : null}
                                </div>
                                <span className={task.urgency === 'High' ? styles.badgeHigh : task.urgency === 'Low' ? styles.badgeLow : styles.badgeMedium}>
                                    {task.urgency}
                                </span>
                            </div>

                            <div className={styles.metaList}>
                                <span className={styles.metaItem}>{task.date}</span>
                                <span className={styles.metaItem}>{task.location}</span>
                            </div>

                            <div className={styles.chipRow}>
                                {task.skillsRequired?.map((skill) => (
                                    <span key={skill} className={styles.chip}>{skill}</span>
                                ))}
                            </div>

                            <div className={styles.actionRow}>
                                <button onClick={() => handleDeleteTask(task.id)} className={styles.dangerButton}>
                                    Delete
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
