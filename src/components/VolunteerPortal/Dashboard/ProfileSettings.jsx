import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { updateSkills, changePassword } from '../../../services/volunteerApi';
import { AVAILABLE_SKILL_OPTIONS, getSkillLabel } from '../portalText';
import styles from '../VolunteerPortal.module.css';

const ProfileSettings = () => {
    const { t } = useTranslation('volunteerPortal');
    const navigate = useNavigate();
    const { user, refreshUser, logout } = useVolunteerAuth();
    const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            setMessage(t('profile.skillsUpdated'));
        } catch (err) {
            setError(err.message || t('profile.skillsError'));
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPassMessage('');
        setPassError('');

        if (newPassword !== confirmPassword) {
            setPassError(t('profile.passwordMismatch'));
            return;
        }

        if (currentPassword === newPassword) {
            setPassError(t('profile.passwordSame'));
            return;
        }

        setPassSaving(true);
        try {
            await changePassword(user.token, currentPassword, newPassword);
            setPassMessage(t('profile.passwordUpdated'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            window.setTimeout(() => {
                logout();
                navigate('/volunteer-portal/login', {
                    replace: true,
                    state: { passwordChanged: true }
                });
            }, 1200);
        } catch (err) {
            setPassError(err.message || t('profile.passwordError'));
        } finally {
            setPassSaving(false);
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>{t('profile.title')}</h2>
                    <p className={styles.panelDescription}>
                        {t('profile.description')}
                    </p>
                </div>
            </div>

            {message && <p className={styles.statusMessage}>{message}</p>}
            {error && <p className={styles.errorBanner}>{error}</p>}

            <div className={styles.sectionStack}>
                <div className={styles.pillRow}>
                    {AVAILABLE_SKILL_OPTIONS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill.value);
                        return (
                            <button
                                key={skill.value}
                                type="button"
                                onClick={() => toggleSkill(skill.value)}
                                className={isSelected ? `${styles.pillButton} ${styles.pillActive}` : styles.pillButton}
                            >
                                {getSkillLabel(t, skill.value)}
                            </button>
                        );
                    })}
                </div>

                <div className={styles.actionRow}>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className={styles.primaryButton}
                    >
                        {saving ? t('common.saving') : t('profile.saveSkills')}
                    </button>
                </div>
            </div>

            <div className={styles.panelTitleRow} style={{ marginTop: '40px' }}>
                <div>
                    <h2 className={styles.panelTitle}>{t('profile.changePasswordTitle')}</h2>
                    <p className={styles.panelDescription}>
                        {t('profile.changePasswordDescription')}
                    </p>
                </div>
            </div>

            {passMessage && <p className={styles.statusMessage}>{passMessage}</p>}
            {passError && <p className={styles.errorBanner} style={{ marginBottom: '12px' }}>{passError}</p>}

            <form onSubmit={handlePasswordChange} className={styles.authForm}>
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t('profile.currentPassword')}</label>
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
                    <label className={styles.fieldLabel}>{t('profile.newPassword')}</label>
                    <input
                        type="password"
                        required
                        minLength="8"
                        className={styles.fieldInput}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t('profile.newPasswordPlaceholder')}
                    />
                </div>
                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t('profile.confirmPassword')}</label>
                    <input
                        type="password"
                        required
                        minLength="8"
                        className={styles.fieldInput}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('profile.confirmPasswordPlaceholder')}
                    />
                </div>
                <div className={styles.actionRow} style={{ marginTop: '10px' }}>
                    <button
                        type="submit"
                        disabled={passSaving || !currentPassword || !newPassword || !confirmPassword}
                        className={styles.primaryButton}
                    >
                        {passSaving ? t('profile.updatingPassword') : t('profile.updatePassword')}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ProfileSettings;
