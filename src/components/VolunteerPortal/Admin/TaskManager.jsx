import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import styles from '../VolunteerPortal.module.css';

const TaskManager = () => {
    const { profile } = useVolunteerAuth();
    const [tasks, setTasks] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [marker, setMarker] = useState('');
    const [skillsString, setSkillsString] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [saving, setSaving] = useState(false);
    const canManageTasks = profile?.role === 'manager' || profile?.role === 'admin';

    useEffect(() => {
        if (!canManageTasks) {
            setTasks([]);
            return undefined;
        }

        const unsubscribe = onSnapshot(collection(db, 'volunteerTasks'), (snapshot) => {
            const tasksData = [];
            snapshot.forEach((docSnap) => {
                tasksData.push({ id: docSnap.id, ...docSnap.data() });
            });
            tasksData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setTasks(tasksData);
        });
        return () => unsubscribe();
    }, [canManageTasks]);

    if (!canManageTasks) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Manage Tasks</h2>
                <p className={styles.errorBanner}>You do not have permission to access this section.</p>
            </section>
        );
    }

    const handleAddTask = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const skillsArray = skillsString.split(',').map((skill) => skill.trim()).filter(Boolean);
            await addDoc(collection(db, 'volunteerTasks'), {
                title,
                description,
                date,
                location,
                marker: marker.trim(),
                skillsRequired: skillsArray,
                urgency,
                appliedUsers: [],
                createdAt: serverTimestamp()
            });

            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            setMarker('');
            setSkillsString('');
            setUrgency('Medium');
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await deleteDoc(doc(db, 'volunteerTasks', taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
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
                        <label className={styles.fieldLabel}>Required Skills</label>
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
                {tasks.length === 0 ? (
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
