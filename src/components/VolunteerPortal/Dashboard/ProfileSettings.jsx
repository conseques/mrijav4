import React, { useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { updateSkills, changePassword } from '../../../services/volunteerApi';
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

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passSaving, setPassSaving] = useState(false);
    const [passMessage, setPassMessage] = useState('');
    const [passError, setPassError] = useState('');

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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPassSaving(true);
        setPassMessage('');
        setPassError('');
        try {
            await changePassword(user.token, currentPassword, newPassword);
            setPassMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setPassError(err.message || 'Failed to change password.');
        } finally {
            setPassSaving(false);
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

            <div className={styles.panelTitleRow} style={{ marginTop: '40px' }}>
                <div>
                    <h2 className={styles.panelTitle}>Change Password</h2>
                    <p className={styles.panelDescription}>
                        Update your password to keep your account secure.
                    </p>
                </div>
            </div>

            {passMessage && <p className={styles.statusMessage} style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>{passMessage}</p>}
            {passError && <p className={styles.errorBanner} style={{ marginBottom: '12px' }}>{passError}</p>}

            <form onSubmit={handlePasswordChange} className={styles.authForm}>
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Current Password</label>
                    <input
                        type="password"
                        required
                        className={styles.fieldInput}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>New Password</label>
                    <input
                        type="password"
                        required
                        minLength="8"
                        className={styles.fieldInput}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                    />
                </div>
                <div className={styles.actionRow} style={{ marginTop: '10px' }}>
                    <button
                        type="submit"
                        disabled={passSaving || !currentPassword || !newPassword}
                        className={styles.primaryButton}
                    >
                        {passSaving ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ProfileSettings;
