import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import styles from './PastEventsManager.module.css';
import { getAdminSaveErrorMessage, MAX_IMAGE_SIZE_MB, removeStoredImage, UPLOAD_TIMEOUT_MESSAGE, validateImageFile } from './uploadFeedback';

const PastEventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  // Form State
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    tag: 'community',
    imageUrl: '', // for keeping track of existing image during edit
    title_no: '', desc_no: '',
    title_en: '', desc_en: '',
    title_ua: '', desc_ua: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "past_events"));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort local since we might not have an index yet
      eventsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setEvents(eventsData);
    } catch (err) {
      console.error("Error fetching past events:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateImageFile(selectedFile);

    if (validationError) {
      setFile(null);
      setFormError(validationError);
      e.target.value = '';
      return;
    }

    setFormError('');
    setFile(selectedFile || null);
  };

  const resetForm = () => {
    setFormData({
      date: '', tag: 'community', imageUrl: '',
      title_no: '', desc_no: '', title_en: '', desc_en: '', title_ua: '', desc_ua: ''
    });
    setFile(null);
    setEditingId(null);
    setIsAdding(false);
    setFormError('');
  };

  const handleEdit = (eventObj) => {
    setFormData({
      date: eventObj.date || '',
      tag: eventObj.tag || 'community',
      imageUrl: eventObj.imageUrl || '',
      title_no: eventObj.locales?.no?.title || '', desc_no: eventObj.locales?.no?.desc || '',
      title_en: eventObj.locales?.en?.title || '', desc_en: eventObj.locales?.en?.desc || '',
      title_ua: eventObj.locales?.ua?.title || '', desc_ua: eventObj.locales?.ua?.desc || ''
    });
    setEditingId(eventObj.id);
    setIsAdding(true);
    setFile(null); // File is only needed if they want to change the image
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!file && !editingId) {
      setFormError("Please select an image for the new past event.");
      return;
    }

    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setFormError(validationError);
        return;
      }
    }

    if (editingId && !file && !formData.imageUrl) {
      setFormError("Please upload an image before updating this past event.");
      return;
    }
    
    setSaving(true);
    try {
      const previousImageUrl = formData.imageUrl;
      let finalImageUrl = formData.imageUrl;
      
      // If user selected a new file, upload it
      if (file) {
        const storageRef = ref(storage, `past_events/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytes(storageRef, file);
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(UPLOAD_TIMEOUT_MESSAGE)), 15000));
        await Promise.race([uploadTask, timeout]);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const eventDocData = {
        imageUrl: finalImageUrl,
        date: formData.date,
        tag: formData.tag,
        locales: {
          no: { title: formData.title_no, desc: formData.desc_no },
          en: { title: formData.title_en, desc: formData.desc_en },
          ua: { title: formData.title_ua, desc: formData.desc_ua }
        }
      };

      if (editingId) {
        // Update existing document
        await updateDoc(doc(db, "past_events", editingId), eventDocData);
      } else {
        // Create new document
        eventDocData.createdAt = serverTimestamp();
        await addDoc(collection(db, "past_events"), eventDocData);
      }

      if (editingId && file && previousImageUrl && previousImageUrl !== finalImageUrl) {
        try {
          await removeStoredImage(storage, previousImageUrl);
        } catch (cleanupError) {
          console.warn("Past event updated, but old image cleanup failed:", cleanupError);
        }
      }
      
      resetForm();
      fetchEvents();

    } catch (err) {
      console.error("Error saving past event:", err);
      setFormError(getAdminSaveErrorMessage(err, 'this past event'));
    }
    setSaving(false);
  };

  const handleDelete = async (eventObj) => {
    if (window.confirm("Are you sure you want to delete this past event?")) {
      try {
        await deleteDoc(doc(db, "past_events", eventObj.id));
        try {
          await removeStoredImage(storage, eventObj.imageUrl);
        } catch (cleanupError) {
          console.warn("Past event deleted, but image cleanup failed:", cleanupError);
        }
        fetchEvents();
      } catch (err) {
        console.error("Error deleting past event:", err);
        alert("Error deleting past event");
      }
    }
  };

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Past Events (Hendelser)</h2>
        {!isAdding && (
          <button className={styles.addBtn} onClick={() => { resetForm(); setIsAdding(true); }}>
            + Add Past Event
          </button>
        )}
      </div>

      {isAdding && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Edit Past Event' : 'Add Past Event'}</h3>
          <form onSubmit={handleSubmit}>
            {formError && <p className={styles.errorMessage}>{formError}</p>}
            <div className={styles.formGrid}>
              
              {/* Common Details */}
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

              {/* Norwegian */}
              <div className={styles.langSection}>
                <h4>Norsk (no)</h4>
                <div className={styles.inputGroup}>
                  <label>Title</label>
                  <input type="text" name="title_no" value={formData.title_no} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea name="desc_no" value={formData.desc_no} onChange={handleInputChange} required />
                </div>
              </div>

              {/* English */}
              <div className={styles.langSection}>
                <h4>English (en)</h4>
                <div className={styles.inputGroup}>
                  <label>Title</label>
                  <input type="text" name="title_en" value={formData.title_en} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea name="desc_en" value={formData.desc_en} onChange={handleInputChange} required />
                </div>
              </div>

              {/* Ukrainian */}
              <div className={styles.langSection}>
                <h4>Українська (ua)</h4>
                <div className={styles.inputGroup}>
                  <label>Title</label>
                  <input type="text" name="title_ua" value={formData.title_ua} onChange={handleInputChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea name="desc_ua" value={formData.desc_ua} onChange={handleInputChange} required />
                </div>
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

      {loading ? (
        <p>Loading past events...</p>
      ) : (
        <div className={styles.eventsList}>
          {events.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <img src={event.imageUrl} alt={event.locales?.en?.title} className={styles.eventImage} />
              <div className={styles.eventContent}>
                <span className={styles.eventTag}>{event.tag}</span>
                <h4 className={styles.eventName}>{event.locales?.en?.title} / {event.locales?.ua?.title}</h4>
                <p className={styles.eventDate}>{event.date}</p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(event)} style={{marginRight: '10px', padding: '6px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(event)}>Delete</button>
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
