import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import styles from './EventsManager.module.css';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    tagType: 'regular',
    imageUrl: '', // for keeping track of existing image during edit
    name_no: '', desc_no: '',
    name_en: '', desc_en: '',
    name_ua: '', desc_ua: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort local since we might not have an index yet
      eventsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
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
      day: '', time: '', tagType: 'regular', imageUrl: '',
      name_no: '', desc_no: '', name_en: '', desc_en: '', name_ua: '', desc_ua: ''
    });
    setFile(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (eventObj) => {
    setFormData({
      day: eventObj.day || '',
      time: eventObj.time || '',
      tagType: eventObj.tagType || 'regular',
      imageUrl: eventObj.imageUrl || '',
      name_no: eventObj.locales?.no?.name || '', desc_no: eventObj.locales?.no?.description || '',
      name_en: eventObj.locales?.en?.name || '', desc_en: eventObj.locales?.en?.description || '',
      name_ua: eventObj.locales?.ua?.name || '', desc_ua: eventObj.locales?.ua?.description || ''
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
        const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const eventDocData = {
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
        // Update existing document
        await updateDoc(doc(db, "events", editingId), eventDocData);
      } else {
        // Create new document
        eventDocData.createdAt = serverTimestamp();
        await addDoc(collection(db, "events"), eventDocData);
      }
      
      resetForm();
      fetchEvents();

    } catch (err) {
      console.error("Error saving event:", err);
      alert("Error saving event. See console.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", id));
        fetchEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
        alert("Error deleting event");
      }
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

              {/* Norwegian */}
              <div className={styles.langSection}>
                <h4>Norsk (no)</h4>
                <div className={styles.inputGroup}>
                  <label>Name</label>
                  <input type="text" name="name_no" value={formData.name_no} onChange={handleInputChange} required />
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
                  <label>Name</label>
                  <input type="text" name="name_en" value={formData.name_en} onChange={handleInputChange} required />
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
                  <label>Name</label>
                  <input type="text" name="name_ua" value={formData.name_ua} onChange={handleInputChange} required />
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
          {events.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <img src={event.imageUrl} alt={event.locales?.en?.name} className={styles.eventImage} />
              <div className={styles.eventContent}>
                <span className={styles.eventTag}>{event.tagType}</span>
                <h4 className={styles.eventName}>{event.locales?.en?.name} / {event.locales?.ua?.name}</h4>
                <p className={styles.eventDate}>{event.day} | {event.time}</p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(event)} style={{marginRight: '10px', padding: '6px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(event.id)}>Delete</button>
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
