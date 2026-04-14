import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchAdminPastEvents, createPastEvent, updatePastEvent, deletePastEvent } from '../../../services/volunteerApi';
import { uploadImage } from '../../../services/uploadApi';
import { getAdminSaveErrorMessage, MAX_IMAGE_SIZE_MB, validateImageFile } from './uploadFeedback';
import styles from './PastEventsManager.module.css';


const PastEventsManager = () => {
  const { backendToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    date: '', tag: 'community', imageUrl: '',
    title_no: '', desc_no: '', title_en: '', desc_en: '', title_ua: '', desc_ua: ''
  });

  const load = async () => {
    if (!backendToken) return;
    setLoading(true);
    try {
      const { items } = await fetchAdminPastEvents(backendToken);
      setEvents((items || []).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) {
      console.error('Error fetching past events:', err);
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
    setFormData({ date: '', tag: 'community', imageUrl: '', title_no: '', desc_no: '', title_en: '', desc_en: '', title_ua: '', desc_ua: '' });
    setFile(null); setEditingId(null); setIsAdding(false); setFormError('');
  };

  const handleEdit = (ev) => {
    setFormData({
      date: ev.date || '', tag: ev.tag || 'community', imageUrl: ev.imageUrl || '',
      title_no: ev.locales?.no?.title || '', desc_no: ev.locales?.no?.desc || '',
      title_en: ev.locales?.en?.title || '', desc_en: ev.locales?.en?.desc || '',
      title_ua: ev.locales?.ua?.title || '', desc_ua: ev.locales?.ua?.desc || ''
    });
    setEditingId(ev.id); setIsAdding(true); setFile(null); setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!file && !editingId) { setFormError('Please select an image for the new past event.'); return; }
    setSaving(true);
    try {
      const previousImageUrl = formData.imageUrl;
      let finalImageUrl = formData.imageUrl;
      if (file) {
        finalImageUrl = await uploadImage(backendToken, file, null);
      }
      const payload = {
        imageUrl: finalImageUrl, date: formData.date, tag: formData.tag,
        locales: {
          no: { title: formData.title_no, desc: formData.desc_no },
          en: { title: formData.title_en, desc: formData.desc_en },
          ua: { title: formData.title_ua, desc: formData.desc_ua }
        }
      };
      if (editingId) {
        const { item } = await updatePastEvent(backendToken, editingId, payload);
        setEvents((prev) => prev.map((ev) => (ev.id === editingId ? item : ev)));
      } else {
        const { item } = await createPastEvent(backendToken, payload);
        setEvents((prev) => [item, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving past event:', err);
      setFormError(getAdminSaveErrorMessage(err, 'this past event'));
    }
    setSaving(false);
  };

  const handleDelete = async (ev) => {
    if (!window.confirm('Are you sure you want to delete this past event?')) return;
    try {
      await deletePastEvent(backendToken, ev.id);
      setEvents((prev) => prev.filter((e) => e.id !== ev.id));
    } catch (err) {
      console.error('Error deleting past event:', err);
      alert('Error deleting past event');
    }
  };

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Past Events (Hendelser)</h2>
        {!isAdding && (
          <button className={styles.addBtn} onClick={() => { resetForm(); setIsAdding(true); }}>+ Add Past Event</button>
        )}
      </div>

      {isAdding && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Edit Past Event' : 'Add Past Event'}</h3>
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
                {editingId && formData.imageUrl && !file && <p className={styles.helperText}>Current image will stay active until you upload a new one.</p>}
                <div className={styles.inputGroup}>
                  <label>Date String (e.g. "Dec 15, 2023")</label>
                  <input type="text" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Event Tag</label>
                  <select name="tag" value={formData.tag} onChange={handleInputChange}>
                    <option value="annual">Annual Highlight</option>
                    <option value="education">Education</option>
                    <option value="culture">Culture</option>
                    <option value="literature">Literature</option>
                    <option value="community">Community</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
              </div>
              <div className={styles.langSection}>
                <h4>Norsk (no)</h4>
                <div className={styles.inputGroup}><label>Title</label><input type="text" name="title_no" value={formData.title_no} onChange={handleInputChange} required /></div>
                <div className={styles.inputGroup}><label>Description</label><textarea name="desc_no" value={formData.desc_no} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.langSection}>
                <h4>English (en)</h4>
                <div className={styles.inputGroup}><label>Title</label><input type="text" name="title_en" value={formData.title_en} onChange={handleInputChange} required /></div>
                <div className={styles.inputGroup}><label>Description</label><textarea name="desc_en" value={formData.desc_en} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.langSection}>
                <h4>Українська (ua)</h4>
                <div className={styles.inputGroup}><label>Title</label><input type="text" name="title_ua" value={formData.title_ua} onChange={handleInputChange} required /></div>
                <div className={styles.inputGroup}><label>Description</label><textarea name="desc_ua" value={formData.desc_ua} onChange={handleInputChange} required /></div>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={saving}>
                {saving ? 'Saving...' : (editingId ? 'Update Past Event' : 'Save Past Event')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p>Loading past events...</p> : (
        <div className={styles.eventsList}>
          {events.map((ev) => (
            <div key={ev.id} className={styles.eventCard}>
              <img src={ev.imageUrl} alt={ev.locales?.en?.title} className={styles.eventImage} />
              <div className={styles.eventContent}>
                <span className={styles.eventTag}>{ev.tag}</span>
                <h4 className={styles.eventName}>{ev.locales?.en?.title} / {ev.locales?.ua?.title}</h4>
                <p className={styles.eventDate}>{ev.date}</p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(ev)} style={{ marginRight: '10px', padding: '6px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(ev)}>Delete</button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p>No past events found. Add one above.</p>}
        </div>
      )}
    </div>
  );
};

export default PastEventsManager;
