import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';
import styles from '../VolunteerPortal.module.css';

const RoleManager = () => {
    const { profile, currentUser } = useVolunteerAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'volunteers'), where('status', '==', 'approved'));
            const querySnapshot = await getDocs(q);
            const fetchedUsers = querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangeRole = async (userId, newRole) => {
        if (userId === currentUser?.uid && newRole !== 'admin') {
            if (!window.confirm('You are about to change your own role. Proceed?')) return;
        }

        try {
            const userRef = doc(db, 'volunteers', userId);
            await updateDoc(userRef, {
                role: newRole
            });
            setUsers((prev) => prev.map((user) => (
                user.id === userId ? { ...user, role: newRole } : user
            )));
        } catch (error) {
            console.error('Error changing role', error);
            alert('Failed to change role.');
        }
    };

    if (profile?.role !== 'admin') {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Role Manager</h2>
                <p className={styles.errorBanner}>You do not have permission to access this section.</p>
            </section>
        );
    }

    if (loading) {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>Role Manager</h2>
                <p className={styles.panelDescription}>Loading users...</p>
            </section>
        );
    }

    return (
        <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
                <div>
                    <h2 className={styles.panelTitle}>Role Manager</h2>
                    <p className={styles.panelDescription}>Adjust permissions for approved volunteers, managers, and admins.</p>
                </div>
            </div>

            <div className={styles.taskList}>
                {users.map((user) => (
                    <article key={user.id} className={styles.taskCard}>
                        <div className={styles.taskTop}>
                            <div>
                                <h3 className={styles.taskTitle}>{user.name}</h3>
                                <p className={styles.profileMeta}>{user.email}</p>
                            </div>
                            <span className={styles.chip}>Current: {user.role}</span>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Role</label>
                            <select
                                value={user.role}
                                onChange={(e) => handleChangeRole(user.id, e.target.value)}
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
        </section>
    );
};

export default RoleManager;
