import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchAdminEvents, createEvent, updateEvent, deleteEvent } from '../../../services/volunteerApi';
import { uploadImage } from '../../../services/uploadApi';
import { getAdminSaveErrorMessage, MAX_IMAGE_SIZE_MB, validateImageFile } from './uploadFeedback';
import styles from './EventsManager.module.css';


const EventsManager = () => {
  const { backendToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    day: '', time: '', tagType: 'regular', imageUrl: '',
    name_no: '', desc_no: '', name_en: '', desc_en: '', name_ua: '', desc_ua: ''
  });

  const load = async () => {
    if (!backendToken) return;
    setLoading(true);
    try {
      const { items } = await fetchAdminEvents(backendToken);
      setEvents((items || []).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) {
      console.error('Error fetching events:', err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [backendToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateImageFile(selectedFile);
    if (validationError) { setFile(null); setFormError(validationError); e.target.value = ''; return; }
    setFormError('');
    setFile(selectedFile || null);
  };

  const resetForm = () => {
    setFormData({ day: '', time: '', tagType: 'regular', imageUrl: '', name_no: '', desc_no: '', name_en: '', desc_en: '', name_ua: '', desc_ua: '' });
    setFile(null); setEditingId(null); setIsAdding(false); setFormError('');
  };

  const handleEdit = (ev) => {
    setFormData({
      day: ev.day || '', time: ev.time || '', tagType: ev.tagType || 'regular', imageUrl: ev.imageUrl || '',
      name_no: ev.locales?.no?.name || '', desc_no: ev.locales?.no?.description || '',
      name_en: ev.locales?.en?.name || '', desc_en: ev.locales?.en?.description || '',
      name_ua: ev.locales?.ua?.name || '', desc_ua: ev.locales?.ua?.description || ''
    });
    setEditingId(ev.id); setIsAdding(true); setFile(null); setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!file && !editingId) { setFormError('Please select an image for the new event.'); return; }
    if (file && validateImageFile(file)) { setFormError(validateImageFile(file)); return; }
    setSaving(true);
    try {
      const previousImageUrl = formData.imageUrl;
      let finalImageUrl = formData.imageUrl;
      if (file) {
        finalImageUrl = await uploadImage(backendToken, file, null);
      }

      const payload = {
        imageUrl: finalImageUrl,
        day: formData.day,
        time: formData.time,
        tagType: formData.tagType,
        locales: {
          no: { name: formData.name_no, description: formData.desc_no },
          en: { name: formData.name_en, description: formData.desc_en },
          ua: { name: formData.name_ua, description: formData.desc_ua }
        }
      };

      if (editingId) {
        const { item } = await updateEvent(backendToken, editingId, payload);
        setEvents((prev) => prev.map((ev) => (ev.id === editingId ? item : ev)));
      } else {
        const { item } = await createEvent(backendToken, payload);
        setEvents((prev) => [item, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving event:', err);
      setFormError(getAdminSaveErrorMessage(err, 'this event'));
    }
    setSaving(false);
  };

  const handleDelete = async (ev) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(backendToken, ev.id);
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Error deleting event');
    }
  };

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Upcoming Events</h2>
        {!isAdding && (
          <button className={styles.addBtn} onClick={() => { resetForm(); setIsAdding(true); }}>
            + Add New Event
          </button>
        )}
      </div>

      {isAdding && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Edit Event' : 'Add Event'}</h3>
          <form onSubmit={handleSubmit}>
            {formError && <p className={styles.errorMessage}>{formError}</p>}
            <div className={styles.formGrid}>
              <div className={styles.langSection}>
                <h4>Common Details</h4>
                <div className={styles.inputGroup}>
                  <label>Event Image {editingId ? '(Optional, leave empty to keep current)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} required={!editingId} />
                  <p className={styles.helperText}>Use JPG, PNG, or WebP up to {MAX_IMAGE_SIZE_MB} MB.</p>
                </div>
                {editingId && formData.imageUrl && !file && (
                  <p className={styles.helperText}>Current image will stay active until you upload a new one.</p>
                )}
                <div className={styles.inputGroup}>
                  <label>Day / Date String (e.g. "20. Juni")</label>
                  <input type="text" name="day" value={formData.day} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Time String (e.g. "18:00 - 21:00")</label>
                  <input type="text" name="time" value={formData.time} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Event Type</label>
                  <select name="tagType" value={formData.tagType} onChange={handleInputChange}>
                    <option value="regular">Regular Event</option>
                    <option value="annual">Annual Highlight</option>
                  </select>
                </div>
              </div>

              <div className={styles.langSection}>
                <h4>Norsk (no)</h4>
                <div className={styles.inputGroup}><label>Name</label><input type="text" name="name_no" value={formData.name_no} onChange={handleInputChange} required /></div>
                <div className={styles.inputGroup}><label>Description</label><textarea name="desc_no" value={formData.desc_no} onChange={handleInputChange} required /></div>
              </div>

              <div className={styles.langSection}>
                <h4>English (en)</h4>
                <div className={styles.inputGroup}><label>Name</label><input type="text" name="name_en" value={formData.name_en} onChange={handleInputChange} required /></div>
                <div className={styles.inputGroup}><label>Description</label><textarea name="desc_en" value={formData.desc_en} onChange={handleInputChange} required /></div>
              </div>

              <div className={styles.langSection}>
                <h4>Українська (ua)</h4>
                <div className={styles.inputGroup}><label>Name</label><input type="text" name="name_ua" value={formData.name_ua} onChange={handleInputChange} required /></div>
                <div className={styles.inputGroup}><label>Description</label><textarea name="desc_ua" value={formData.desc_ua} onChange={handleInputChange} required /></div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={saving}>
                {saving ? 'Saving...' : (editingId ? 'Update Event' : 'Save Event')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className={styles.eventsList}>
          {events.map((ev) => (
            <div key={ev.id} className={styles.eventCard}>
              <img src={ev.imageUrl} alt={ev.locales?.en?.name} className={styles.eventImage} />
              <div className={styles.eventContent}>
                <span className={styles.eventTag}>{ev.tagType}</span>
                <h4 className={styles.eventName}>{ev.locales?.en?.name} / {ev.locales?.ua?.name}</h4>
                <p className={styles.eventDate}>{ev.day} | {ev.time}</p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(ev)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(ev)}>Delete</button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p>No events found. Add one above.</p>}
        </div>
      )}
    </div>
  );
};

export default EventsManager;
