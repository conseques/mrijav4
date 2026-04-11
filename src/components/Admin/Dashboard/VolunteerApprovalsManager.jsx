import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { BadgeCheck, Clock3, Mail, Phone, ShieldAlert, UserRound, XCircle } from 'lucide-react';
import { db } from '../../../firebase';
import styles from './VolunteerApprovalsManager.module.css';

const getTimestamp = (value) => {
  if (value?.seconds) {
    return value.seconds;
  }

  return 0;
};

const formatDate = (value) => {
  const seconds = getTimestamp(value);

  if (!seconds) {
    return 'Recently';
  }

  return new Date(seconds * 1000).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const VolunteerApprovalsManager = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchVolunteers = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const querySnapshot = await getDocs(collection(db, 'volunteers'));
      const volunteerData = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }));

      volunteerData.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
      setVolunteers(volunteerData);
    } catch (error) {
      console.error('Error fetching volunteer registrations:', error);
      setErrorMessage('Unable to load volunteer registrations right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const pendingVolunteers = useMemo(
    () => volunteers.filter((volunteer) => (volunteer.status || 'pending') === 'pending'),
    [volunteers]
  );

  const reviewedVolunteers = useMemo(
    () => volunteers.filter((volunteer) => (volunteer.status || 'pending') !== 'pending').slice(0, 8),
    [volunteers]
  );

  const stats = useMemo(() => ({
    total: volunteers.length,
    pending: volunteers.filter((volunteer) => (volunteer.status || 'pending') === 'pending').length,
    approved: volunteers.filter((volunteer) => volunteer.status === 'approved').length,
    rejected: volunteers.filter((volunteer) => volunteer.status === 'rejected').length
  }), [volunteers]);

  const handleStatusChange = async (volunteer, nextStatus) => {
    if (nextStatus === 'rejected') {
      const confirmed = window.confirm(`Reject volunteer registration for ${volunteer.name || volunteer.email}?`);
      if (!confirmed) {
        return;
      }
    }

    setActionId(volunteer.id);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const updateData = {
        status: nextStatus,
        reviewedAt: serverTimestamp()
      };

      if (nextStatus === 'approved') {
        updateData.role = volunteer.role && volunteer.role !== 'user' ? volunteer.role : 'volunteer';
      }

      await updateDoc(doc(db, 'volunteers', volunteer.id), updateData);

      setVolunteers((current) => current.map((item) => (
        item.id === volunteer.id
          ? {
              ...item,
              ...updateData,
              reviewedAt: { seconds: Math.floor(Date.now() / 1000) }
            }
          : item
      )));

      setStatusMessage(
        nextStatus === 'approved'
          ? `${volunteer.name || volunteer.email} has been approved for the volunteer portal.`
          : `${volunteer.name || volunteer.email} has been marked as rejected.`
      );
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      setErrorMessage('Failed to update this volunteer registration. Please try again.');
    } finally {
      setActionId('');
    }
  };

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Volunteer Forum Verification</h2>
          <p className={styles.description}>
            Review new volunteer registrations from the portal and decide who gets access to the internal workspace.
          </p>
        </div>
        <button type="button" className={styles.refreshBtn} onClick={fetchVolunteers} disabled={loading}>
          Refresh
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

        {loading ? (
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
                  <span className={styles.statusPill}>
                    <Clock3 size={14} />
                    <span>Pending</span>
                  </span>
                </div>

                <div className={styles.contactList}>
                  <a className={styles.contactItem} href={`mailto:${volunteer.email}`}>
                    <Mail size={16} />
                    <span>{volunteer.email}</span>
                  </a>
                  <a className={styles.contactItem} href={`tel:${volunteer.phone || ''}`}>
                    <Phone size={16} />
                    <span>{volunteer.phone || 'No phone provided'}</span>
                  </a>
                </div>

                <div className={styles.detailGrid}>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Current role</span>
                    <span className={styles.detailValue}>{volunteer.role || 'user'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Portal status</span>
                    <span className={styles.detailValue}>{volunteer.status || 'pending'}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Skills saved</span>
                    <span className={styles.detailValue}>{volunteer.skills?.length || 0}</span>
                  </div>
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Profile ID</span>
                    <span className={styles.detailValue}>{volunteer.id}</span>
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

        {loading ? (
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
                  <span className={volunteer.status === 'approved' ? styles.approvedBadge : styles.rejectedBadge}>
                    {volunteer.status === 'approved' ? <BadgeCheck size={14} /> : <ShieldAlert size={14} />}
                    <span>{volunteer.status}</span>
                  </span>
                </div>

                <div className={styles.reviewMeta}>
                  <span><UserRound size={14} /> Role: {volunteer.role || 'user'}</span>
                  <span><Clock3 size={14} /> Reviewed: {formatDate(volunteer.reviewedAt || volunteer.createdAt)}</span>
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
