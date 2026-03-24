import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import styles from './PastEventsManager.module.css';

const PastEventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '', tag: 'community', imageUrl: '',
      title_no: '', desc_no: '', title_en: '', desc_en: '', title_ua: '', desc_ua: ''
    });
    setFile(null);
    setEditingId(null);
    setIsAdding(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editingId) {
      alert("Please select an image for the new event.");
      return;
    }
    
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      // If user selected a new file, upload it
      if (file) {
        const storageRef = ref(storage, `past_events/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
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
      
      resetForm();
      fetchEvents();

    } catch (err) {
      console.error("Error saving past event:", err);
      alert("Error saving past event. See console.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this past event?")) {
      try {
        await deleteDoc(doc(db, "past_events", id));
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
            <div className={styles.formGrid}>
              
              {/* Common Details */}
              <div className={styles.langSection}>
                <h4>Common Details</h4>
                <div className={styles.inputGroup}>
                  <label>Event Image {editingId ? '(Optional, leave empty to keep current)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} required={!editingId} />
                </div>
                {editingId && formData.imageUrl && !file && (
                   <p style={{fontSize:'12px', color:'#666'}}>Current Image active.</p>
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
                <button className={styles.deleteBtn} onClick={() => handleDelete(event.id)}>Delete</button>
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
