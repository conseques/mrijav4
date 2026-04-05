import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import styles from './RegistrationsManager.module.css';

const getTimestamp = (membership) => {
  if (membership?.createdAt?.seconds) {
    return membership.createdAt.seconds;
  }

  return 0;
};

const MembershipsManager = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'memberships'));
        const rows = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        rows.sort((a, b) => getTimestamp(b) - getTimestamp(a));
        setMemberships(rows);
      } catch (error) {
        console.error('Error fetching memberships:', error);
      }

      setLoading(false);
    };

    fetchMemberships();
  }, []);

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Memberships</h2>
      </div>

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
              {memberships.map((membership) => (
                <tr key={membership.id}>
                  <td>
                    {membership.createdAt
                      ? new Date(membership.createdAt.seconds * 1000).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className={styles.nameCell}>{membership.name || 'Vipps member'}</td>
                  <td>
                    {membership.email ? <a href={`mailto:${membership.email}`}>{membership.email}</a> : 'N/A'}
                  </td>
                  <td>{membership.phone || 'N/A'}</td>
                  <td>
                    <span className={styles.statusBadge}>{membership.paymentState || 'captured'}</span>
                  </td>
                  <td>
                    <span className={styles.amountText}>
                      {typeof membership.amountValue === 'number'
                        ? `${membership.amountValue / 100} ${membership.currency || 'NOK'}`
                        : `100 NOK`}
                    </span>
                  </td>
                  <td>
                    <span className={styles.sourceText}>{membership.source || 'vipps_epayment'}</span>
                  </td>
                  <td>
                    <p className={styles.referenceText}>{membership.paymentReference || membership.id}</p>
                    {membership.vippsSub ? (
                      <p className={styles.subtleText}>sub: {membership.vippsSub}</p>
                    ) : null}
                  </td>
                </tr>
              ))}
              {memberships.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>No memberships yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembershipsManager;
