import React, { useEffect, useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { fetchAdminVolunteers, changeVolunteerRole } from '../../../services/volunteerApi';
import { useTranslation } from 'react-i18next';
import { getRoleLabel } from '../portalText';
import styles from '../VolunteerPortal.module.css';

const RoleManager = () => {
    const { t } = useTranslation('volunteerPortal');
    const { user } = useVolunteerAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        if (!user?.token) return;
        setLoading(true);
        setError('');
        try {
            const { items } = await fetchAdminVolunteers(user.token, 'approved');
            setUsers(items || []);
        } catch (err) {
            setError(err.message || t('admin.roles.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.token]);

    if (user?.role !== 'admin') {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>{t('admin.roles.title')}</h2>
                <p className={styles.errorBanner}>{t('common.permissionDenied')}</p>
            </section>
        );
    }

    const handleChangeRole = async (targetUserId, newRole) => {
        if (targetUserId === user.id && newRole !== 'admin') {
            if (!window.confirm(t('admin.roles.confirmOwnRole'))) return;
        }

        try {
            await changeVolunteerRole(user.token, targetUserId, newRole);
            setUsers((prev) =>
                prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            setError(err.message || t('admin.roles.changeError'));
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>{t('admin.roles.title')}</h2>
                    <p className={styles.panelDescription}>{t('admin.roles.description')}</p>
                </div>
            </div>

            {error && <p className={styles.errorBanner}>{error}</p>}

            {loading ? (
                <p className={styles.emptyState}>{t('admin.roles.loading')}</p>
            ) : (
                <div className={styles.taskList}>
                    {users.map((u) => (
                        <article key={u.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{u.name}</h3>
                                    <p className={styles.profileMeta}>{u.email}</p>
                                </div>
                                <span className={styles.chip}>{t('admin.roles.current', { role: getRoleLabel(t, u.role) })}</span>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>{t('admin.roles.role')}</label>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                    className={styles.selectInput}
                                >
                                    <option value="volunteer">{getRoleLabel(t, 'volunteer')}</option>
                                    <option value="manager">{getRoleLabel(t, 'manager')}</option>
                                    <option value="admin">{getRoleLabel(t, 'admin')}</option>
                                </select>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RoleManager;
