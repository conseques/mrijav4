import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchAdminRegistrations } from '../../../services/volunteerApi';
import styles from './RegistrationsManager.module.css';

const formatDate = (ts) => {
  if (!ts?.seconds) return 'N/A';
  return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const RegistrationsManager = () => {
  const { backendToken } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!backendToken) return;
    fetchAdminRegistrations(backendToken)
      .then(({ items }) => setRegistrations(items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [backendToken]);

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Event Registrations</h2>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {loading ? (
        <p>Loading registrations...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Source</th>
                <th>Status</th>
                <th>Registration</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{formatDate(reg.createdAt)}</td>
                  <td className={styles.nameCell}>{reg.name}</td>
                  <td><a href={`mailto:${reg.email}`}>{reg.email}</a></td>
                  <td>{reg.phone || 'N/A'}</td>
                  <td><span className={styles.typeBadge}>{reg.type || 'event'}</span></td>
                  <td><span className={styles.sourceText}>{reg.source || 'website'}</span></td>
                  <td><span className={styles.statusBadge}>{reg.paymentState || 'registered'}</span></td>
                  <td>
                    <span className={styles.eventBadge}>{reg.eventName}</span>
                    {reg.paymentReference ? <p className={styles.referenceText}>{reg.paymentReference}</p> : null}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr><td colSpan="8" className={styles.emptyState}>No registrations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManager;
