import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import styles from './VolunteerTasksManager.module.css';

const initialFormState = {
  title: '',
  description: '',
  date: '',
  location: '',
  marker: '',
  skillsString: '',
  urgency: 'Medium'
};

const getCreatedAtSeconds = (task) => task?.createdAt?.seconds || 0;

const VolunteerTasksManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'volunteerTasks'),
      (snapshot) => {
        const rows = snapshot.docs.map((taskDoc) => ({
          id: taskDoc.id,
          ...taskDoc.data()
        }));

        rows.sort((a, b) => getCreatedAtSeconds(b) - getCreatedAtSeconds(a));
        setTasks(rows);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading volunteer tasks:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setFormError('');
    setIsAdding(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      const skillsRequired = formData.skillsString
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      await addDoc(collection(db, 'volunteerTasks'), {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date.trim(),
        location: formData.location.trim(),
        marker: formData.marker.trim(),
        urgency: formData.urgency,
        skillsRequired,
        appliedUsers: [],
        createdAt: serverTimestamp()
      });

      resetForm();
    } catch (error) {
      console.error('Error adding volunteer task:', error);
      setFormError('Unable to create this task right now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm('Delete this volunteer task?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'volunteerTasks', taskId));
    } catch (error) {
      console.error('Error deleting volunteer task:', error);
      setFormError('Unable to delete this task right now. Please try again.');
    }
  };

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Volunteer Tasks</h2>
          <p className={styles.description}>
            Create assignments for volunteers, attach markers, and keep the shared task board up to date.
          </p>
        </div>
        {!isAdding && (
          <button type="button" className={styles.addBtn} onClick={() => setIsAdding(true)}>
            + New Task
          </button>
        )}
      </div>

      {formError && !isAdding ? <p className={styles.errorMessage}>{formError}</p> : null}

      {isAdding && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Create Volunteer Task</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            {formError && <p className={styles.errorMessage}>{formError}</p>}

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Task Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Urgency</label>
                <select name="urgency" value={formData.urgency} onChange={handleInputChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Date / Time</label>
                <input name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Marker Label (optional)</label>
                <input
                  name="marker"
                  value={formData.marker}
                  onChange={handleInputChange}
                  placeholder="Zone A / Driver Team / Booth 03"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Required Skills (comma separated)</label>
                <input
                  name="skillsString"
                  value={formData.skillsString}
                  onChange={handleInputChange}
                  placeholder="Translator, Driver, Setup"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={saving}>
                {saving ? 'Saving...' : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.listCard}>
        {loading ? (
          <p className={styles.emptyState}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className={styles.emptyState}>No volunteer tasks found.</p>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <article key={task.id} className={styles.taskCard}>
                <div className={styles.taskTop}>
                  <div>
                    <h4 className={styles.taskTitle}>{task.title}</h4>
                    <p className={styles.taskMeta}>
                      {task.date} | {task.location}
                    </p>
                  </div>
                  <div className={styles.badgeRow}>
                    {task.marker ? <span className={styles.markerBadge}>{task.marker}</span> : null}
                    <span className={styles.priorityBadge}>{task.urgency || 'Medium'}</span>
                  </div>
                </div>

                <p className={styles.taskDescription}>{task.description}</p>

                <div className={styles.taskFooter}>
                  <span className={styles.applicants}>Applicants: {task.appliedUsers?.length || 0}</span>
                  <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerTasksManager;
