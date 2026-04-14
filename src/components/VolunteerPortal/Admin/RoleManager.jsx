import React, { useEffect, useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { fetchAdminVolunteers, changeVolunteerRole } from '../../../services/volunteerApi';
import styles from '../VolunteerPortal.module.css';

const RoleManager = () => {
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
            setError(err.message || 'Unable to load users.');
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
                <h2 className={styles.panelTitle}>Role Manager</h2>
                <p className={styles.errorBanner}>You do not have permission to access this section.</p>
            </section>
        );
    }

    const handleChangeRole = async (targetUserId, newRole) => {
        if (targetUserId === user.id && newRole !== 'admin') {
            if (!window.confirm('You are about to change your own role. Proceed?')) return;
        }

        try {
            await changeVolunteerRole(user.token, targetUserId, newRole);
            setUsers((prev) =>
                prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            setError(err.message || 'Failed to change role.');
        }
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>Role Manager</h2>
                    <p className={styles.panelDescription}>Adjust permissions for approved volunteers, managers, and admins.</p>
                </div>
            </div>

            {error && <p className={styles.errorBanner}>{error}</p>}

            {loading ? (
                <p className={styles.emptyState}>Loading users...</p>
            ) : (
                <div className={styles.taskList}>
                    {users.map((u) => (
                        <article key={u.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{u.name}</h3>
                                    <p className={styles.profileMeta}>{u.email}</p>
                                </div>
                                <span className={styles.chip}>Current: {u.role}</span>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Role</label>
                                <select
                                    value={u.role}
                                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                    className={styles.selectInput}
                                >
                                    <option value="volunteer">Volunteer</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
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
