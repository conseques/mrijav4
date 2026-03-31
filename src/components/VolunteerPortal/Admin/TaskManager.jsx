import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [skillsString, setSkillsString] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'volunteerTasks'), (snapshot) => {
            const tasksData = [];
            snapshot.forEach((doc) => {
                tasksData.push({ id: doc.id, ...doc.data() });
            });
            // Sort by createdAt usually, but here we just reverse
            setTasks(tasksData.reverse());
        });
        return () => unsubscribe();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const skillsArray = skillsString.split(',').map(s => s.trim()).filter(Boolean);
            await addDoc(collection(db, 'volunteerTasks'), {
                title,
                description,
                date,
                location,
                skillsRequired: skillsArray,
                urgency,
                appliedUsers: [],
                createdAt: serverTimestamp()
            });
            
            // Reset form
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            setSkillsString('');
            setUrgency('Medium');
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteDoc(doc(db, 'volunteerTasks', taskId));
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    return (
        <section style={{ backgroundColor: 'var(--container-bg)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: 'var(--text-color)', margin: 0 }}>Manage Tasks</h2>
                <button 
                    onClick={() => setIsAdding(!isAdding)} 
                    style={{ padding: '8px 16px', backgroundColor: isAdding ? 'var(--outline-variant)' : 'var(--primary-color)', color: isAdding ? 'var(--text-color)' : 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isAdding ? 'Cancel' : '+ New Task'}
                </button>
            </div>

            {isAdding && (
                <div style={{ padding: '16px', border: '1px solid var(--outline-variant)', borderRadius: '12px', marginBottom: '24px', backgroundColor: 'var(--bg-color)' }}>
                    <h3 style={{ color: 'var(--text-color)', marginBottom: '16px', fontSize: '18px' }}>Create New Task</h3>
                    <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)' }} />
                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)', fontFamily: 'inherit' }} />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" placeholder="Date & Time (e.g. Saturday, 12:30)" value={date} onChange={e => setDate(e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)' }} />
                            <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)' }} />
                        </div>
                        <input type="text" placeholder="Required Skills (comma separated)" value={skillsString} onChange={e => setSkillsString(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)' }} />
                        
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <label style={{ color: 'var(--text-color)' }}>Urgency:</label>
                            <select value={urgency} onChange={e => setUrgency(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)', paddingRight: '10px' }}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <button type="submit" disabled={saving} style={{ marginTop: '8px', alignSelf: 'flex-start', padding: '10px 24px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                            {saving ? 'Saving...' : 'Save Task'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No tasks currently available.</p>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--outline-variant)', borderRadius: '12px' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-color)', margin: '0 0 4px 0' }}>{task.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>ID: {task.id} | Applied: {task.appliedUsers ? task.appliedUsers.length : 0}</p>
                            </div>
                            <button onClick={() => handleDeleteTask(task.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default TaskManager;
