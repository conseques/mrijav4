import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const PendingApprovals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'volunteers'), where('status', '==', 'pending'));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingUsers(users);
        } catch (error) {
            console.error("Error fetching pending users", error);
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
            // Update local state to remove the approved user
            setPendingUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error approving user", error);
            alert("Failed to approve user.");
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm("Are you sure you want to reject this registration?")) return;
        try {
            const userRef = doc(db, 'volunteers', userId);
            await updateDoc(userRef, {
                status: 'rejected'
            });
            setPendingUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error rejecting user", error);
            alert("Failed to reject user.");
        }
    };

    if (loading) return <div>Loading pending registrations...</div>;

    if (pendingUsers.length === 0) {
        return <p style={{ color: 'var(--text-muted)' }}>No pending registrations.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingUsers.map(user => (
                <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--outline-variant)', borderRadius: '12px', backgroundColor: 'var(--bg-color)' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-color)', marginBottom: '4px' }}>{user.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>{user.email} | {user.phone}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Registered: {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApprove(user.id)} style={{ padding: '8px 16px', backgroundColor: '#34A853', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Approve
                        </button>
                        <button onClick={() => handleReject(user.id)} style={{ padding: '8px 16px', backgroundColor: '#EA4335', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PendingApprovals;
