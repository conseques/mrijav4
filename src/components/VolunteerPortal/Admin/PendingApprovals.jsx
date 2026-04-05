import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import styles from '../VolunteerPortal.module.css';

const PendingApprovals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'volunteers'), where('status', '==', 'pending'));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
            setPendingUsers(users);
        } catch (error) {
            console.error('Error fetching pending users', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (userId) => {
        try {
            const userRef = doc(db, 'volunteers', userId);
            await updateDoc(userRef, {
                status: 'approved',
                role: 'volunteer'
            });
            setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('Error approving user', error);
            alert('Failed to approve user.');
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm('Are you sure you want to reject this registration?')) return;

        try {
            const userRef = doc(db, 'volunteers', userId);
            await updateDoc(userRef, {
                status: 'rejected'
            });
            setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error('Error rejecting user', error);
            alert('Failed to reject user.');
        }
    };

    if (loading) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Pending Approvals</h2>
                <p className={styles.panelDescription}>Loading registrations...</p>
            </section>
        );
    }

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>Pending Approvals</h2>
                    <p className={styles.panelDescription}>Review new volunteer registrations before granting portal access.</p>
                </div>
            </div>

            <div className={styles.taskList}>
                {pendingUsers.length === 0 ? (
                    <p className={styles.emptyState}>No pending registrations.</p>
                ) : (
                    pendingUsers.map((user) => (
                        <article key={user.id} className={styles.taskCard}>
                            <div className={styles.taskTop}>
                                <div>
                                    <h3 className={styles.taskTitle}>{user.name}</h3>
                                    <p className={styles.profileMeta}>{user.email} | {user.phone}</p>
                                </div>
                                <span className={styles.badgeMedium}>Pending</span>
                            </div>

                            <p className={styles.helper}>
                                Registered: {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                            </p>

                            <div className={styles.actionRow}>
                                <button onClick={() => handleApprove(user.id)} className={styles.successButton}>
                                    Approve
                                </button>
                                <button onClick={() => handleReject(user.id)} className={styles.dangerButton}>
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
