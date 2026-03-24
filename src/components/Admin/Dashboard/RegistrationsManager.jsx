import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import styles from './RegistrationsManager.module.css';

const RegistrationsManager = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        const regs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        regs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setRegistrations(regs);
      } catch (err) {
        console.error("Error fetching registrations:", err);
      }
      setLoading(false);
    };

    fetchRegs();
  }, []);

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Event Registrations</h2>
      </div>

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
                <th>Event Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.createdAt ? new Date(reg.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                  <td className={styles.nameCell}>{reg.name}</td>
                  <td><a href={`mailto:${reg.email}`}>{reg.email}</a></td>
                  <td>{reg.phone}</td>
                  <td><span className={styles.eventBadge}>{reg.eventName}</span></td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.emptyState}>No registrations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManager;
