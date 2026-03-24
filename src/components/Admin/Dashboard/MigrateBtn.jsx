import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import eventsArray from '../../HomePage/Events/eventsArray';

import noEvents from '../../Locales/no/events.json';
import enEvents from '../../Locales/en/events.json';
import uaEvents from '../../Locales/ua/events.json';

const MigrateBtn = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMigrate = async () => {
        setLoading(true);
        setStatus("Starting migration...");
        try {
            for (let i = 0; i < eventsArray.length; i++) {
                const ev = eventsArray[i];
                setStatus(`Uploading image ${i + 1} of ${eventsArray.length}...`);
                
                // Fetch the image from the local webpack URL to get a Blob!
                const response = await fetch(ev.image);
                const blob = await response.blob();
                
                const eventCode = ev.nameKey.split('.')[0]; // e.g. 'easterEvent'
                const fileName = `events/legacy_${Date.now()}_${eventCode}.jpg`;
                const storageRef = ref(storage, fileName);
                
                await uploadBytes(storageRef, blob, { contentType: blob.type });
                const imageUrl = await getDownloadURL(storageRef);

                setStatus(`Saving document ${i + 1} of ${eventsArray.length}...`);

                // Create the document
                const eventDoc = {
                    imageUrl,
                    day: noEvents[eventCode].day,
                    time: ev.timeKey,
                    tagType: ev.tagType,
                    locales: {
                        no: { name: noEvents[eventCode].name, description: noEvents[eventCode].description },
                        en: { name: enEvents[eventCode].name, description: enEvents[eventCode].description },
                        ua: { name: uaEvents[eventCode].name, description: uaEvents[eventCode].description }
                    },
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, "events"), eventDoc);
            }
            setStatus("Success! All legacy events migrated.");
        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Legacy Data Migration</h3>
            <p>Click the button below to upload all 6 old events into your new Firebase database.</p>
            <button 
                onClick={handleMigrate} 
                disabled={loading}
                style={{ padding: '10px 20px', background: '#d97706', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
                {loading ? 'Migrating...' : 'Migrate Old Events'}
            </button>
            {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
        </div>
    );
};

export default MigrateBtn;
