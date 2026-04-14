import React, { useEffect, useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { fetchAdminVolunteers, reviewVolunteer } from '../../../services/volunteerApi';
import styles from '../VolunteerPortal.module.css';

const PendingApprovals = () => {
    const { user } = useVolunteerAuth();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState('');
    const [error, setError] = useState('');

    const canReview = user?.role === 'manager' || user?.role === 'admin';

    const fetchPendingUsers = async () => {
        if (!canReview || !user?.token) return;
        setLoading(true);
        setError('');
        try {
            const { items } = await fetchAdminVolunteers(user.token, 'pending');
            setPendingUsers(items || []);
        } catch (err) {
            setError(err.message || 'Unable to load pending registrations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canReview, user?.token]);

    if (!canReview) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Pending Approvals</h2>
                <p className={styles.errorBanner}>You do not have permission to access this section.</p>
            </section>
        );
    }

    const handleReview = async (userId, status) => {
        const targetUser = pendingUsers.find((u) => u.id === userId);
        if (status === 'rejected') {
            if (!window.confirm(`Reject registration for ${targetUser?.name || userId}?`)) return;
        }

        setActionId(userId);
        try {
            await reviewVolunteer(user.token, userId, status);
            setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            setError(err.message || `Failed to ${status} this volunteer.`);
        } finally {
            setActionId('');
        }
    };

    const formatDate = (ts) => {
        if (!ts?.seconds) return 'Recently';
        return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>Pending Approvals</h2>
                    <p className={styles.panelDescription}>Review new volunteer registrations before granting portal access.</p>
                </div>
                <button onClick={fetchPendingUsers} className={styles.ghostButton} disabled={loading}>
                    Refresh
                </button>
            </div>

            {error && <p className={styles.errorBanner}>{error}</p>}

            <div className={styles.taskList}>
                {loading ? (
                    <p className={styles.emptyState}>Loading registrations...</p>
                ) : pendingUsers.length === 0 ? (
                    <p className={styles.emptyState}>No pending registrations.</p>
                ) : (
                    pendingUsers.map((volunteer) => (
                        <article key={volunteer.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{volunteer.name}</h3>
                                    <p className={styles.profileMeta}>{volunteer.email}{volunteer.phone ? ` | ${volunteer.phone}` : ''}</p>
                                </div>
                                <span className={styles.badgeMedium}>Pending</span>
                            </div>

                            <p className={styles.helper}>Registered: {formatDate(volunteer.createdAt)}</p>

                            <div className={styles.actionRow}>
                                <button
                                    onClick={() => handleReview(volunteer.id, 'approved')}
                                    className={styles.successButton}
                                    disabled={actionId === volunteer.id}
                                >
                                    {actionId === volunteer.id ? 'Saving...' : 'Approve'}
                                </button>
                                <button
                                    onClick={() => handleReview(volunteer.id, 'rejected')}
                                    className={styles.dangerButton}
                                    disabled={actionId === volunteer.id}
                                >
                                    Reject
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
};

export default PendingApprovals;
