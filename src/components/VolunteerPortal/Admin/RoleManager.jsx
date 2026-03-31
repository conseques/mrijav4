import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';

const RoleManager = () => {
    const { profile } = useVolunteerAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Only fetch approved users
            const q = query(collection(db, 'volunteers'), where('status', '==', 'approved'));
            const querySnapshot = await getDocs(q);
            const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChangeRole = async (userId, newRole) => {
        // Prevent accidental self-demotion from admin role
        if (userId === useVolunteerAuth.currentUser?.uid && newRole !== 'admin') {
            if (!window.confirm("You are about to change your own role. Proceed?")) return;
        }

        try {
            const userRef = doc(db, 'volunteers', userId);
            await updateDoc(userRef, {
                role: newRole
            });
            // Update local state
            setUsers(prev => prev.map(user => user.id === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error("Error changing role", error);
            alert("Failed to change role.");
        }
    };

    if (profile?.role !== 'admin') {
        return <p style={{ color: 'red' }}>You do not have permission to access Role Manager. (Admin only)</p>;
    }

    if (loading) return <div>Loading users...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {users.map(user => (
                <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--outline-variant)', borderRadius: '12px', backgroundColor: 'var(--bg-color)' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-color)', marginBottom: '4px' }}>{user.name} <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'normal' }}>({user.email})</span></h4>
                        <p style={{ color: 'var(--primary-color)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Current: {user.role}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select 
                            value={user.role} 
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--container-bg)', color: 'var(--text-color)' }}
                        >
                            <option value="user">User (Needs Approval)</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoleManager;
