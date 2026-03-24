import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import styles from './CoursesManager.module.css'; // Will reuse EventsManager styling or create new

const CoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    imageUrl: '',
    teacherPhotoUrl: '',
    
    // Norsk
    name_no: '', desc_no: '', levels_no: '', duration_no: '', teacherName_no: '', teacherInfo_no: '', location_no: '',
    // English
    name_en: '', desc_en: '', levels_en: '', duration_en: '', teacherName_en: '', teacherInfo_en: '', location_en: '',
    // Ukrainian
    name_ua: '', desc_ua: '', levels_ua: '', duration_ua: '', teacherName_ua: '', teacherInfo_ua: '', location_ua: ''
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      coursesData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => { if (e.target.files[0]) setImageFile(e.target.files[0]); };
  const handleTeacherChange = (e) => { if (e.target.files[0]) setTeacherFile(e.target.files[0]); };

  const resetForm = () => {
    setFormData({
      phone: '', imageUrl: '', teacherPhotoUrl: '',
      name_no: '', desc_no: '', levels_no: '', duration_no: '', teacherName_no: '', teacherInfo_no: '', location_no: '',
      name_en: '', desc_en: '', levels_en: '', duration_en: '', teacherName_en: '', teacherInfo_en: '', location_en: '',
      name_ua: '', desc_ua: '', levels_ua: '', duration_ua: '', teacherName_ua: '', teacherInfo_ua: '', location_ua: ''
    });
    setImageFile(null);
    setTeacherFile(null);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (courseObj) => {
    setFormData({
      phone: courseObj.phone || '',
      imageUrl: courseObj.imageUrl || '',
      teacherPhotoUrl: courseObj.teacherPhotoUrl || '',
      
      name_no: courseObj.locales?.no?.name || '', desc_no: courseObj.locales?.no?.desc || '', levels_no: courseObj.locales?.no?.levels || '', duration_no: courseObj.locales?.no?.duration || '', teacherName_no: courseObj.locales?.no?.teacherName || '', teacherInfo_no: courseObj.locales?.no?.teacherInfo || '', location_no: courseObj.locales?.no?.location || '',
      name_en: courseObj.locales?.en?.name || '', desc_en: courseObj.locales?.en?.desc || '', levels_en: courseObj.locales?.en?.levels || '', duration_en: courseObj.locales?.en?.duration || '', teacherName_en: courseObj.locales?.en?.teacherName || '', teacherInfo_en: courseObj.locales?.en?.teacherInfo || '', location_en: courseObj.locales?.en?.location || '',
      name_ua: courseObj.locales?.ua?.name || '', desc_ua: courseObj.locales?.ua?.desc || '', levels_ua: courseObj.locales?.ua?.levels || '', duration_ua: courseObj.locales?.ua?.duration || '', teacherName_ua: courseObj.locales?.ua?.teacherName || '', teacherInfo_ua: courseObj.locales?.ua?.teacherInfo || '', location_ua: courseObj.locales?.ua?.location || ''
    });
    setEditingId(courseObj.id);
    setIsAdding(true);
    setImageFile(null);
    setTeacherFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && (!imageFile || !teacherFile)) {
      alert("Please select both a course image and a teacher photo for new courses.");
      return;
    }
    
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      let finalTeacherUrl = formData.teacherPhotoUrl;
      
      if (imageFile) {
        const storageRef = ref(storage, `courses/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }
      
      if (teacherFile) {
        const storageRef = ref(storage, `teachers/${Date.now()}_${teacherFile.name}`);
        await uploadBytes(storageRef, teacherFile);
        finalTeacherUrl = await getDownloadURL(storageRef);
      }

      const courseDocData = {
        imageUrl: finalImageUrl,
        teacherPhotoUrl: finalTeacherUrl,
        phone: formData.phone,
        locales: {
          no: { name: formData.name_no, desc: formData.desc_no, levels: formData.levels_no, duration: formData.duration_no, teacherName: formData.teacherName_no, teacherInfo: formData.teacherInfo_no, location: formData.location_no },
          en: { name: formData.name_en, desc: formData.desc_en, levels: formData.levels_en, duration: formData.duration_en, teacherName: formData.teacherName_en, teacherInfo: formData.teacherInfo_en, location: formData.location_en },
          ua: { name: formData.name_ua, desc: formData.desc_ua, levels: formData.levels_ua, duration: formData.duration_ua, teacherName: formData.teacherName_ua, teacherInfo: formData.teacherInfo_ua, location: formData.location_ua }
        }
      };

      if (editingId) {
        await updateDoc(doc(db, "courses", editingId), courseDocData);
      } else {
        courseDocData.createdAt = serverTimestamp();
        await addDoc(collection(db, "courses"), courseDocData);
      }
      
      resetForm();
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Error saving course.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", id));
        fetchCourses();
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Error deleting course");
      }
    }
  };

  const renderLangFields = (lang, prefix) => (
    <div className={styles.langSection}>
      <h4>{lang}</h4>
      <div className={styles.inputGroup}><label>Course Name</label><input type="text" name={`name_${prefix}`} value={formData[`name_${prefix}`]} onChange={handleInputChange} required /></div>
      <div className={styles.inputGroup}><label>Description</label><textarea name={`desc_${prefix}`} value={formData[`desc_${prefix}`]} onChange={handleInputChange} required /></div>
      <div className={styles.inputGroup}><label>Level (e.g. A1 / Support)</label><input type="text" name={`levels_${prefix}`} value={formData[`levels_${prefix}`]} onChange={handleInputChange} required /></div>
      <div className={styles.inputGroup}><label>Duration (e.g. 1.5 hours)</label><input type="text" name={`duration_${prefix}`} value={formData[`duration_${prefix}`]} onChange={handleInputChange} required /></div>
      <div className={styles.inputGroup}><label>Teacher Name</label><input type="text" name={`teacherName_${prefix}`} value={formData[`teacherName_${prefix}`]} onChange={handleInputChange} required /></div>
      <div className={styles.inputGroup}><label>Teacher Info</label><textarea name={`teacherInfo_${prefix}`} value={formData[`teacherInfo_${prefix}`]} onChange={handleInputChange} required /></div>
      <div className={styles.inputGroup}><label>Location (e.g. Drammen Library)</label><input type="text" name={`location_${prefix}`} value={formData[`location_${prefix}`]} onChange={handleInputChange} required /></div>
    </div>
  );

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Courses</h2>
        {!isAdding && (
          <button className={styles.addBtn} onClick={() => { resetForm(); setIsAdding(true); }}>
            + Add New Course
          </button>
        )}
      </div>

      {isAdding && (
        <div className={styles.formCard}>
          <h3>{editingId ? 'Edit Course' : 'Add Course'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              
              <div className={styles.langSection}>
                <h4>Common Details</h4>
                <div className={styles.inputGroup}>
                  <label>Course Image {editingId ? '(Optional)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} required={!editingId} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Teacher Photo {editingId ? '(Optional)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={handleTeacherChange} className={styles.fileInput} required={!editingId} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Contact Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>

              {renderLangFields('Norsk (no)', 'no')}
              {renderLangFields('English (en)', 'en')}
              {renderLangFields('Українська (ua)', 'ua')}

            </div>
            
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={saving}>
                {saving ? 'Saving...' : (editingId ? 'Update Course' : 'Save Course')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className={styles.eventsList}>
          {courses.map(course => (
            <div key={course.id} className={styles.eventCard}>
              <img src={course.imageUrl} alt={course.locales?.en?.name} className={styles.eventImage} />
              <div className={styles.eventContent}>
                <h4 className={styles.eventName}>{course.locales?.en?.name} / {course.locales?.ua?.name}</h4>
                <p className={styles.eventDate}>Teacher: {course.locales?.en?.teacherName}</p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(course)} style={{marginRight: '10px', padding: '6px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(course.id)}>Delete</button>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p>No courses found. Add one above.</p>}
        </div>
      )}
    </div>
  );
};

export default CoursesManager;
