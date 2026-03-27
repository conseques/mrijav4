import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxWBndJngKb0a24tw1UI9vXG7oqb74dU1KjEaS69wV5Xn0YPqQsQWDXIuN-XbeHWZJ_/exec';

export const submitMembershipData = async (data) => {
    try {
        // 1. Save to Firestore
        await addDoc(collection(db, "registrations"), {
            name: data.name,
            email: data.email,
            phone: data.phone,
            eventName: "Membership (Вступ до спілки)", // Using eventName field for consistency in Admin Panel
            type: "membership",
            createdAt: serverTimestamp()
        });

        // 2. Original Webhook call
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'website_membership_form'
            }),
        });
        return { success: true };
    } catch (error) {
        console.error('Error submitting membership data:', error);
        return { success: false, error };
    }
};
