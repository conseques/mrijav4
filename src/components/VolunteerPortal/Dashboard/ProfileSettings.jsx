import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useVolunteerAuth } from '../../../context/VolunteerAuthContext';

const AVAILABLE_SKILLS = [
    "Driver (Has car)",
    "Translator (EN/UA)",
    "Translator (NO/UA)",
    "Event Helper",
    "Logistics",
    "IT Support",
    "First Aid",
    "Photography"
];

const ProfileSettings = () => {
    const { currentUser, profile } = useVolunteerAuth();
    const [selectedSkills, setSelectedSkills] = useState(profile?.skills || []);
    const [saving, setSaving] = useState(false);

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const userRef = doc(db, 'volunteers', currentUser.uid);
            await updateDoc(userRef, {
                skills: selectedSkills
            });
            alert("Skills updated successfully!");
        } catch (error) {
            console.error("Error saving skills", error);
            alert("Failed to save skills.");
        }
        setSaving(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--container-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '8px' }}>Manage Skills</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Select the areas where you can help out. This helps admins assign the right tasks.</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                {AVAILABLE_SKILLS.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                        <button 
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            style={{ 
                                padding: '8px 16px', 
                                border: '1px solid',
                                borderColor: isSelected ? 'var(--primary-color)' : 'var(--outline-variant)',
                                backgroundColor: isSelected ? 'var(--primary-color)' : 'transparent',
                                color: isSelected ? 'white' : 'var(--text-color)',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            {skill}
                        </button>
                    )
                })}
            </div>

            <button 
                onClick={handleSave} 
                disabled={saving}
                style={{ 
                    alignSelf: 'flex-start',
                    padding: '10px 24px', 
                    backgroundColor: saving ? 'var(--outline-variant)' : 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: saving ? 'not-allowed' : 'pointer'
                }}
            >
                {saving ? 'Saving...' : 'Save Skills'}
            </button>
        </div>
    );
};

export default ProfileSettings;
