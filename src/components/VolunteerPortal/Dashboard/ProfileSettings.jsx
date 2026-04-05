import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
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
    const { currentUser, profile } = useVolunteerAuth();
    const [selectedSkills, setSelectedSkills] = useState(profile?.skills || []);
    const [saving, setSaving] = useState(false);

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((currentSkill) => currentSkill !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const userRef = doc(db, 'volunteers', currentUser.uid);
            await updateDoc(userRef, {
                skills: selectedSkills
            });
            alert('Skills updated successfully!');
        } catch (error) {
            console.error('Error saving skills', error);
            alert('Failed to save skills.');
        }
        setSaving(false);
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
