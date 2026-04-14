import React, { useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { updateSkills } from '../../../services/volunteerApi';
import styles from '../VolunteerPortal.module.css';

const AVAILABLE_SKILLS = [
    'Driver (Has car)',
    'Translator (EN/UA)',
    'Translator (NO/UA)',
    'Event Helper',
    'Logistics',
    'IT Support',
    'First Aid',
    'Photography'
];

const ProfileSettings = () => {
    const { user, refreshUser } = useVolunteerAuth();
    const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const toggleSkill = (skill) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        setError('');
        try {
            await updateSkills(user.token, selectedSkills);
            await refreshUser();
            setMessage('Skills updated successfully.');
        } catch (err) {
            setError(err.message || 'Failed to save skills.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>Profile & Skills</h2>
                    <p className={styles.panelDescription}>
                        Keep your profile up to date so coordinators can match you with the right opportunities.
                    </p>
                </div>
            </div>

            {message && <p className={styles.statusMessage} style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>{message}</p>}
            {error && <p className={styles.errorBanner}>{error}</p>}

            <div className={styles.sectionStack}>
                <div className={styles.pillRow}>
                    {AVAILABLE_SKILLS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                            <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={isSelected ? `${styles.pillButton} ${styles.pillActive}` : styles.pillButton}
                            >
                                {skill}
                            </button>
                        );
                    })}
                </div>

                <div className={styles.actionRow}>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={styles.primaryButton}
                    >
                        {saving ? 'Saving...' : 'Save Skills'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProfileSettings;
