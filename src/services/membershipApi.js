const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxWBndJngKb0a24tw1UI9vXG7oqb74dU1KjEaS69wV5Xn0YPqQsQWDXIuN-XbeHWZJ_/exec';

export const submitMembershipData = async (data) => {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script usually requires no-cors for simple redirects
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
