import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Clock3, Mail, Phone, RefreshCw, ShieldAlert, UserRound, XCircle, Trash2 } from 'lucide-react';
import { useAdminBackendToken } from '../../../hooks/useAdminBackendToken';
import { fetchAdminVolunteers, reviewVolunteer, deleteVolunteer } from '../../../services/volunteerApi';
import styles from './VolunteerApprovalsManager.module.css';

const formatDate = (ts) => {
  if (!ts?.seconds) return 'Recently';
  return new Date(ts.seconds * 1000).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const VolunteerApprovalsManager = () => {
  const { backendToken, loading: tokenLoading, error: tokenError } = useAdminBackendToken();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchVolunteers = async () => {
    if (!backendToken) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const { items } = await fetchAdminVolunteers(backendToken);
      setVolunteers(items || []);
    } catch (error) {
      console.error('Error fetching volunteer registrations:', error);
      setErrorMessage('Unable to load volunteer registrations right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendToken) {
      fetchVolunteers();
    } else if (!tokenLoading) {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendToken, tokenLoading]);

  const pendingVolunteers = useMemo(
    () => volunteers.filter((v) => v.status === 'pending'),
    [volunteers]
  );

  const reviewedVolunteers = useMemo(
    () => volunteers.filter((v) => v.status !== 'pending').slice(0, 8),
    [volunteers]
  );

  const stats = useMemo(() => ({
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === 'pending').length,
    approved: volunteers.filter((v) => v.status === 'approved').length,
    rejected: volunteers.filter((v) => v.status === 'rejected').length
  }), [volunteers]);

  const handleStatusChange = async (volunteer, nextStatus) => {
    if (nextStatus === 'rejected') {
      const confirmed = window.confirm(`Reject volunteer registration for ${volunteer.name || volunteer.email}?`);
      if (!confirmed) return;
    }

    setActionId(volunteer.id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const { item } = await reviewVolunteer(backendToken, volunteer.id, nextStatus);

      setVolunteers((current) =>
        current.map((v) => (v.id === volunteer.id ? item : v))
      );

      setStatusMessage(
        nextStatus === 'approved'
          ? `${volunteer.name || volunteer.email} has been approved for the volunteer portal.`
          : `${volunteer.name || volunteer.email} has been marked as rejected.`
      );
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      setErrorMessage(error.message || 'Failed to update this volunteer registration. Please try again.');
    } finally {
      setActionId('');
    }
  };

  const handleDeleteVolunteer = async (volunteer) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete ${volunteer.name || volunteer.email}? This action cannot be undone.`);
    if (!confirmed) return;

    setActionId(volunteer.id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      await deleteVolunteer(backendToken, volunteer.id);
      
      setVolunteers((current) => current.filter((v) => v.id !== volunteer.id));

      setStatusMessage(`${volunteer.name || volunteer.email} has been permanently deleted.`);
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      setErrorMessage(error.message || 'Failed to delete this volunteer. Please try again.');
    } finally {
      setActionId('');
    }
  };

  // Show token acquisition error (e.g. admin email not in backend)
  if (tokenError) {
    return (
      <div className={styles.managerContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Volunteer Forum Verification</h2>
        </div>
        <p className={styles.errorMessage}>
          Backend authentication failed: {tokenError}.<br />
          Make sure your Firebase admin email has a matching backend account with manager or admin role.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Volunteer Forum Verification</h2>
          <p className={styles.description}>
            Review new volunteer registrations from the portal and decide who gets access to the internal workspace.
          </p>
        </div>
        <button type="button" className={styles.refreshBtn} onClick={fetchVolunteers} disabled={loading || tokenLoading}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Total Profiles</span>
          <strong className={styles.statValue}>{stats.total}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Pending Review</span>
          <strong className={styles.statValue}>{stats.pending}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Approved</span>
          <strong className={styles.statValue}>{stats.approved}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Rejected</span>
          <strong className={styles.statValue}>{stats.rejected}</strong>
        </article>
      </div>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Pending Applications</h3>
            <p className={styles.sectionText}>Approve trusted volunteers or reject registrations that should not receive portal access.</p>
          </div>
          <span className={styles.pendingBadge}>{pendingVolunteers.length} waiting</span>
        </div>

        {loading || tokenLoading ? (
          <p className={styles.emptyState}>Loading volunteer registrations...</p>
        ) : pendingVolunteers.length === 0 ? (
          <p className={styles.emptyState}>No volunteer registrations are waiting for review.</p>
        ) : (
          <div className={styles.applicationGrid}>
            {pendingVolunteers.map((volunteer) => (
              <article key={volunteer.id} className={styles.applicationCard}>
                <div className={styles.cardTop}>
                  <div>
                    <h4 className={styles.applicantName}>{volunteer.name || 'Volunteer applicant'}</h4>
                    <p className={styles.metaLine}>Registered {formatDate(volunteer.createdAt)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={styles.statusPill}>
                      <Clock3 size={14} />
                      <span>Pending</span>
                    </span>
                    <button
                      type="button"
                      className={styles.deleteIconBtn}
                      onClick={() => handleDeleteVolunteer(volunteer)}
                      disabled={actionId === volunteer.id}
                      title="Delete profile"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.contactList}>
                  <a className={styles.contactItem} href={`mailto:${volunteer.email}`}>
                    <Mail size={16} />
                    <span>{volunteer.email}</span>
                  </a>
                  {volunteer.phone && (
                    <a className={styles.contactItem} href={`tel:${volunteer.phone}`}>
                      <Phone size={16} />
                      <span>{volunteer.phone}</span>
                    </a>
                  )}
                </div>

                <div className={styles.detailGrid}>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Current role</span>
                    <span className={styles.detailValue}>{volunteer.role || 'user'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Portal status</span>
                    <span className={styles.detailValue}>{volunteer.status}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Skills saved</span>
                    <span className={styles.detailValue}>{volunteer.skills?.length || 0}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Profile ID</span>
                    <span className={styles.detailValue}>{volunteer.id.slice(0, 8)}…</span>
                  </div>
                </div>

                <div className={styles.actionRow}>
                  <button
                    type="button"
                    className={styles.approveBtn}
                    onClick={() => handleStatusChange(volunteer, 'approved')}
                    disabled={actionId === volunteer.id}
                  >
                    <BadgeCheck size={16} />
                    <span>{actionId === volunteer.id ? 'Saving...' : 'Approve'}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.rejectBtn}
                    onClick={() => handleStatusChange(volunteer, 'rejected')}
                    disabled={actionId === volunteer.id}
                  >
                    <XCircle size={16} />
                    <span>{actionId === volunteer.id ? 'Saving...' : 'Reject'}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Recently Reviewed</h3>
            <p className={styles.sectionText}>A quick view of the latest approved or rejected volunteer registrations.</p>
          </div>
        </div>

        {loading || tokenLoading ? (
          <p className={styles.emptyState}>Loading review history...</p>
        ) : reviewedVolunteers.length === 0 ? (
          <p className={styles.emptyState}>No volunteer applications have been reviewed yet.</p>
        ) : (
          <div className={styles.reviewList}>
            {reviewedVolunteers.map((volunteer) => (
              <article key={volunteer.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div>
                    <h4 className={styles.reviewName}>{volunteer.name || volunteer.email}</h4>
                    <p className={styles.metaLine}>{volunteer.email}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={volunteer.status === 'approved' ? styles.approvedBadge : styles.rejectedBadge}>
                      {volunteer.status === 'approved' ? <BadgeCheck size={14} /> : <ShieldAlert size={14} />}
                      <span>{volunteer.status}</span>
                    </span>
                    <button
                      type="button"
                      className={styles.deleteIconBtn}
                      onClick={() => handleDeleteVolunteer(volunteer)}
                      disabled={actionId === volunteer.id}
                      title="Permanently Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.reviewMeta}>
                  <span><UserRound size={14} /> Role: {volunteer.role || 'user'}</span>
                  <span><Clock3 size={14} /> Updated: {formatDate(volunteer.updatedAt || volunteer.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VolunteerApprovalsManager;
