import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { fetchAdminMemberships } from '../../../services/volunteerApi';
import styles from './RegistrationsManager.module.css';

const formatDate = (ts) => {
  if (!ts?.seconds) return 'N/A';
  return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const MembershipsManager = () => {
  const { backendToken } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!backendToken) return;
    fetchAdminMemberships(backendToken)
      .then(({ items }) => setMemberships(items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [backendToken]);

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Memberships</h2>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {loading ? (
        <p>Loading memberships...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.id}>
                  <td>{formatDate(m.createdAt)}</td>
                  <td className={styles.nameCell}>{m.name || 'Vipps member'}</td>
                  <td>{m.email ? <a href={`mailto:${m.email}`}>{m.email}</a> : 'N/A'}</td>
                  <td>{m.phone || 'N/A'}</td>
                  <td><span className={styles.statusBadge}>{m.paymentState || 'captured'}</span></td>
                  <td>
                    <span className={styles.amountText}>
                      {typeof m.amountValue === 'number'
                        ? `${m.amountValue / 100} ${m.currency || 'NOK'}`
                        : '100 NOK'}
                    </span>
                  </td>
                  <td><span className={styles.sourceText}>{m.source || 'vipps_epayment'}</span></td>
                  <td>
                    <p className={styles.referenceText}>{m.paymentReference || m.id}</p>
                    {m.vippsSub ? <p className={styles.subtleText}>sub: {m.vippsSub}</p> : null}
                  </td>
                </tr>
              ))}
              {memberships.length === 0 && (
                <tr><td colSpan="8" className={styles.emptyState}>No memberships yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembershipsManager;
