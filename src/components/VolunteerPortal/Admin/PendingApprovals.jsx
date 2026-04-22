import React, { useEffect, useState } from 'react';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import { fetchAdminVolunteers, reviewVolunteer } from '../../../services/volunteerApi';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../portalText';
import styles from '../VolunteerPortal.module.css';

const PendingApprovals = () => {
    const { t, i18n } = useTranslation('volunteerPortal');
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
            setError(err.message || t('admin.pending.loadError'));
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
                <h2 className={styles.panelTitle}>{t('admin.pending.title')}</h2>
                <p className={styles.errorBanner}>{t('common.permissionDenied')}</p>
            </section>
        );
    }

    const handleReview = async (userId, status) => {
        const targetUser = pendingUsers.find((u) => u.id === userId);
        if (status === 'rejected') {
            if (!window.confirm(t('admin.pending.confirmReject', { name: targetUser?.name || t('admin.pending.fallbackName') }))) return;
        }

        setActionId(userId);
        try {
            await reviewVolunteer(user.token, userId, status);
            setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            setError(err.message || t('admin.pending.reviewError', { status }));
        } finally {
            setActionId('');
        }
    };

    const formatDate = (ts) => {
        if (!ts?.seconds) return t('common.recently');
        return new Date(ts.seconds * 1000).toLocaleDateString(getDateLocale(i18n.language), {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>{t('admin.pending.title')}</h2>
                    <p className={styles.panelDescription}>{t('admin.pending.description')}</p>
                </div>
                <button onClick={fetchPendingUsers} className={styles.ghostButton} disabled={loading}>
                    {t('common.refresh')}
                </button>
            </div>

            {error && <p className={styles.errorBanner}>{error}</p>}

            <div className={styles.taskList}>
                {loading ? (
                    <p className={styles.emptyState}>{t('admin.pending.loading')}</p>
                ) : pendingUsers.length === 0 ? (
                    <p className={styles.emptyState}>{t('admin.pending.empty')}</p>
                ) : (
                    pendingUsers.map((volunteer) => (
                        <article key={volunteer.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{volunteer.name}</h3>
                                    <p className={styles.profileMeta}>{volunteer.email}{volunteer.phone ? ` | ${volunteer.phone}` : ''}</p>
                                </div>
                                <span className={styles.badgeMedium}>{t('admin.pending.status')}</span>
                            </div>

                            <p className={styles.helper}>{t('admin.pending.registered', { date: formatDate(volunteer.createdAt) })}</p>

                            <div className={styles.actionRow}>
                                <button
                                    onClick={() => handleReview(volunteer.id, 'approved')}
                                    className={styles.successButton}
                                    disabled={actionId === volunteer.id}
                                >
                                    {actionId === volunteer.id ? t('common.saving') : t('admin.pending.approve')}
                                </button>
                                <button
                                    onClick={() => handleReview(volunteer.id, 'rejected')}
                                    className={styles.dangerButton}
                                    disabled={actionId === volunteer.id}
                                >
                                    {t('admin.pending.reject')}
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
