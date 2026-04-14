import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchAdminCourses, createCourse, updateCourse, deleteCourse } from '../../../services/volunteerApi';
import { uploadImage } from '../../../services/uploadApi';
import { getAdminSaveErrorMessage, MAX_IMAGE_SIZE_MB, validateImageFile } from './uploadFeedback';
import styles from './CoursesManager.module.css';


const CoursesManager = () => {
  const { backendToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [formData, setFormData] = useState({
    phone: '', imageUrl: '', teacherPhotoUrl: '',
    name_no: '', desc_no: '', levels_no: '', duration_no: '', teacherName_no: '', teacherInfo_no: '', location_no: '',
    name_en: '', desc_en: '', levels_en: '', duration_en: '', teacherName_en: '', teacherInfo_en: '', location_en: '',
    name_ua: '', desc_ua: '', levels_ua: '', duration_ua: '', teacherName_ua: '', teacherInfo_ua: '', location_ua: ''
  });

  const load = async () => {
    if (!backendToken) return;
    setLoading(true);
    try {
      const { items } = await fetchAdminCourses(backendToken);
      setCourses((items || []).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [backendToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickFile = (setter, prefix) => (e) => {
    const f = e.target.files[0];
    const err = validateImageFile(f);
    if (err) { setter(null); setFormError(`${prefix}: ${err}`); e.target.value = ''; return; }
    setFormError('');
    setter(f || null);
  };

  const resetForm = () => {
    setFormData({ phone: '', imageUrl: '', teacherPhotoUrl: '', name_no: '', desc_no: '', levels_no: '', duration_no: '', teacherName_no: '', teacherInfo_no: '', location_no: '', name_en: '', desc_en: '', levels_en: '', duration_en: '', teacherName_en: '', teacherInfo_en: '', location_en: '', name_ua: '', desc_ua: '', levels_ua: '', duration_ua: '', teacherName_ua: '', teacherInfo_ua: '', location_ua: '' });
    setImageFile(null); setTeacherFile(null); setEditingId(null); setIsAdding(false); setFormError('');
  };

  const handleEdit = (c) => {
    setFormData({
      phone: c.phone || '', imageUrl: c.imageUrl || '', teacherPhotoUrl: c.teacherPhotoUrl || '',
      name_no: c.locales?.no?.name || '', desc_no: c.locales?.no?.desc || '', levels_no: c.locales?.no?.levels || '', duration_no: c.locales?.no?.duration || '', teacherName_no: c.locales?.no?.teacherName || '', teacherInfo_no: c.locales?.no?.teacherInfo || '', location_no: c.locales?.no?.location || '',
      name_en: c.locales?.en?.name || '', desc_en: c.locales?.en?.desc || '', levels_en: c.locales?.en?.levels || '', duration_en: c.locales?.en?.duration || '', teacherName_en: c.locales?.en?.teacherName || '', teacherInfo_en: c.locales?.en?.teacherInfo || '', location_en: c.locales?.en?.location || '',
      name_ua: c.locales?.ua?.name || '', desc_ua: c.locales?.ua?.desc || '', levels_ua: c.locales?.ua?.levels || '', duration_ua: c.locales?.ua?.duration || '', teacherName_ua: c.locales?.ua?.teacherName || '', teacherInfo_ua: c.locales?.ua?.teacherInfo || '', location_ua: c.locales?.ua?.location || ''
    });
    setEditingId(c.id); setIsAdding(true); setImageFile(null); setTeacherFile(null); setFormError('');
  };

  const uploadIfNew = async (file) => {
    if (!file) return null;
    return uploadImage(backendToken, file, null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!editingId && (!imageFile || !teacherFile)) { setFormError('Please select both a course image and a teacher photo for new courses.'); return; }
    setSaving(true);
    try {
      const prevImg = formData.imageUrl;
      const prevTeacher = formData.teacherPhotoUrl;
      const newImg = await uploadIfNew(imageFile);
      const newTeacher = await uploadIfNew(teacherFile);
      const finalImageUrl = newImg || prevImg;
      const finalTeacherUrl = newTeacher || prevTeacher;

      const payload = {
        imageUrl: finalImageUrl, teacherPhotoUrl: finalTeacherUrl, phone: formData.phone,
        locales: {
          no: { name: formData.name_no, desc: formData.desc_no, levels: formData.levels_no, duration: formData.duration_no, teacherName: formData.teacherName_no, teacherInfo: formData.teacherInfo_no, location: formData.location_no },
          en: { name: formData.name_en, desc: formData.desc_en, levels: formData.levels_en, duration: formData.duration_en, teacherName: formData.teacherName_en, teacherInfo: formData.teacherInfo_en, location: formData.location_en },
          ua: { name: formData.name_ua, desc: formData.desc_ua, levels: formData.levels_ua, duration: formData.duration_ua, teacherName: formData.teacherName_ua, teacherInfo: formData.teacherInfo_ua, location: formData.location_ua }
        }
      };

      if (editingId) {
        const { item } = await updateCourse(backendToken, editingId, payload);
        setCourses((prev) => prev.map((c) => (c.id === editingId ? item : c)));
      } else {
        const { item } = await createCourse(backendToken, payload);
        setCourses((prev) => [item, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving course:', err);
      setFormError(getAdminSaveErrorMessage(err, 'this course'));
    }
    setSaving(false);
  };

  const handleDelete = async (c) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(backendToken, c.id);
      setCourses((prev) => prev.filter((co) => co.id !== c.id));
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Error deleting course');
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
          <button className={styles.addBtn} onClick={() => { resetForm(); setIsAdding(true); }}>+ Add New Course</button>
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
                  <input type="file" accept="image/*" onChange={pickFile(setImageFile, 'Course image')} className={styles.fileInput} required={!editingId} />
                  <p className={styles.helperText}>Use JPG, PNG, or WebP up to {MAX_IMAGE_SIZE_MB} MB.</p>
                </div>
                {editingId && formData.imageUrl && !imageFile && <p className={styles.helperText}>Current course image will stay active until you upload a new one.</p>}
                <div className={styles.inputGroup}>
                  <label>Teacher Photo {editingId ? '(Optional)' : '(Required)'}</label>
                  <input type="file" accept="image/*" onChange={pickFile(setTeacherFile, 'Teacher photo')} className={styles.fileInput} required={!editingId} />
                  <p className={styles.helperText}>Use JPG, PNG, or WebP up to {MAX_IMAGE_SIZE_MB} MB.</p>
                </div>
                {editingId && formData.teacherPhotoUrl && !teacherFile && <p className={styles.helperText}>Current teacher photo will stay active until you upload a new one.</p>}
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

      {loading ? <p>Loading courses...</p> : (
        <div className={styles.eventsList}>
          {courses.map((c) => (
            <div key={c.id} className={styles.eventCard}>
              <img src={c.imageUrl} alt={c.locales?.en?.name} className={styles.eventImage} />
              <div className={styles.eventContent}>
                <h4 className={styles.eventName}>{c.locales?.en?.name} / {c.locales?.ua?.name}</h4>
                <p className={styles.eventDate}>Teacher: {c.locales?.en?.teacherName}</p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(c)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(c)}>Delete</button>
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
