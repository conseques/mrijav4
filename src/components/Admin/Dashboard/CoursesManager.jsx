import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import styles from './CoursesManager.module.css'; // Will reuse EventsManager styling or create new
import { getAdminSaveErrorMessage, MAX_IMAGE_SIZE_MB, removeStoredImage, UPLOAD_TIMEOUT_MESSAGE, validateImageFile } from './uploadFeedback';

const CoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

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

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateImageFile(selectedFile);

    if (validationError) {
      setImageFile(null);
      setFormError(`Course image: ${validationError}`);
      e.target.value = '';
      return;
    }

    setFormError('');
    setImageFile(selectedFile || null);
  };

  const handleTeacherChange = (e) => {
    const selectedFile = e.target.files[0];
    const validationError = validateImageFile(selectedFile);

    if (validationError) {
      setTeacherFile(null);
      setFormError(`Teacher photo: ${validationError}`);
      e.target.value = '';
      return;
    }

    setFormError('');
    setTeacherFile(selectedFile || null);
  };

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
    setFormError('');
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
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!editingId && (!imageFile || !teacherFile)) {
      setFormError("Please select both a course image and a teacher photo for new courses.");
      return;
    }

    const imageValidationError = validateImageFile(imageFile);
    if (imageValidationError) {
      setFormError(`Course image: ${imageValidationError}`);
      return;
    }

    const teacherValidationError = validateImageFile(teacherFile);
    if (teacherValidationError) {
      setFormError(`Teacher photo: ${teacherValidationError}`);
      return;
    }

    if (editingId && !imageFile && !formData.imageUrl) {
      setFormError("Please upload a course image before updating this course.");
      return;
    }

    if (editingId && !teacherFile && !formData.teacherPhotoUrl) {
      setFormError("Please upload a teacher photo before updating this course.");
      return;
    }
    
    setSaving(true);
    try {
      const previousImageUrl = formData.imageUrl;
      const previousTeacherUrl = formData.teacherPhotoUrl;
      let finalImageUrl = formData.imageUrl;
      let finalTeacherUrl = formData.teacherPhotoUrl;
      
      if (imageFile) {
        const storageRef = ref(storage, `courses/${Date.now()}_${imageFile.name}`);
        const uploadTask = uploadBytes(storageRef, imageFile);
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(UPLOAD_TIMEOUT_MESSAGE)), 15000));
        await Promise.race([uploadTask, timeout]);
        finalImageUrl = await getDownloadURL(storageRef);
      }
      
      if (teacherFile) {
        const storageRef = ref(storage, `teachers/${Date.now()}_${teacherFile.name}`);
        const uploadTask = uploadBytes(storageRef, teacherFile);
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(UPLOAD_TIMEOUT_MESSAGE)), 15000));
        await Promise.race([uploadTask, timeout]);
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

      if (editingId && imageFile && previousImageUrl && previousImageUrl !== finalImageUrl) {
        try {
          await removeStoredImage(storage, previousImageUrl);
        } catch (cleanupError) {
          console.warn("Course updated, but old course image cleanup failed:", cleanupError);
        }
      }

      if (editingId && teacherFile && previousTeacherUrl && previousTeacherUrl !== finalTeacherUrl) {
        try {
          await removeStoredImage(storage, previousTeacherUrl);
        } catch (cleanupError) {
          console.warn("Course updated, but old teacher photo cleanup failed:", cleanupError);
        }
      }
      
      resetForm();
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
      setFormError(getAdminSaveErrorMessage(err, 'this course'));
    }
    setSaving(false);
  };

  const handleDelete = async (courseObj) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", courseObj.id));
        try {
          await removeStoredImage(storage, courseObj.imageUrl);
          await removeStoredImage(storage, courseObj.teacherPhotoUrl);
        } catch (cleanupError) {
          console.warn("Course deleted, but image cleanup failed:", cleanupError);
        }
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
            {formError && <p className={styles.errorMessage}>{formError}</p>}
            <div className={styles.formGrid}>
              
              <div className={styles.langSection}>
                <h4>Common Details</h4>
                <div className={styles.inputGroup}>
                  <label>Course Image {editingId ? '(Optional)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} required={!editingId} />
                  <p className={styles.helperText}>Use JPG, PNG, or WebP up to {MAX_IMAGE_SIZE_MB} MB.</p>
                </div>
                {editingId && formData.imageUrl && !imageFile && (
                  <p className={styles.helperText}>Current course image will stay active until you upload a new one.</p>
                )}
                <div className={styles.inputGroup}>
                  <label>Teacher Photo {editingId ? '(Optional)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={handleTeacherChange} className={styles.fileInput} required={!editingId} />
                  <p className={styles.helperText}>Use JPG, PNG, or WebP up to {MAX_IMAGE_SIZE_MB} MB.</p>
                </div>
                {editingId && formData.teacherPhotoUrl && !teacherFile && (
                  <p className={styles.helperText}>Current teacher photo will stay active until you upload a new one.</p>
                )}
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
                <button className={styles.editBtn} onClick={() => handleEdit(course)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(course)}>Delete</button>
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
