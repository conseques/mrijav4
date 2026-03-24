import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3KnOfvzBFoGhgJw3Zjz3uWQZR2e15ymo",
  authDomain: "mrija-web.firebaseapp.com",
  projectId: "mrija-web",
  storageBucket: "mrija-web.firebasestorage.app",
  messagingSenderId: "412424993671",
  appId: "1:412424993671:web:154a52f31b9b33e941f122",
  measurementId: "G-9YN16F4WV7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const no = JSON.parse(fs.readFileSync('./src/components/Locales/no/courses.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./src/components/Locales/en/courses.json', 'utf8'));
const ua = JSON.parse(fs.readFileSync('./src/components/Locales/ua/courses.json', 'utf8'));

const coursesToMigrate = [
    {
        imageUrl: '/courses/norskkurs.jpg',
        teacherPhotoUrl: '/teachers/Vladimir.jpg',
        phone: 'Ikke oppgitt',
        key: 'norskKursA1',
        locationKey: 'drammenLibrary'
    },
    {
        imageUrl: '/courses/norskkursB1.jpg',
        teacherPhotoUrl: '/teachers/Valentina.jpg',
        phone: '468 207 24',
        key: 'norskKursB1',
        locationKey: 'TBA' // This was hardcoded in course.js
    },
    {
        imageUrl: '/courses/digitalverden.jpg',
        teacherPhotoUrl: '/teachers/Sviatoslav.jpg',
        phone: '912 548 07',
        key: 'digitalVerden',
        locationKey: 'drammenLibrary'
    },
    {
        imageUrl: '/courses/YogaKurs.jpg', // YogaKurs didn't exist strictly inside course array image but Yoga array did. Assuming it is YogaKurs.jpg
        teacherPhotoUrl: '/teachers/YogaTeacher.jpg',
        phone: '972 833 24',
        key: 'yogaCourse',
        locationKey: 'drammenLibrary'
    }
];

function getLocationText(langData, locKey) {
   if (locKey === 'TBA') return 'TBA / Etter avtale';
   return langData[locKey] || locKey;
}

async function migrate() {
    console.log("Starting courses migration...");
    for (const c of coursesToMigrate) {
        console.log("Migrating", c.key);
        
        const courseDoc = {
            imageUrl: c.imageUrl,
            teacherPhotoUrl: c.teacherPhotoUrl,
            phone: c.phone,
            locales: {
                no: { 
                  name: no[c.key]?.name || '', 
                  desc: no[c.key]?.description || '', 
                  levels: no[c.key]?.levels || '', 
                  duration: no[c.key]?.duration || '', 
                  teacherName: no[c.key]?.teacherName || '', 
                  teacherInfo: no[c.key]?.teacherInfo || '', 
                  location: getLocationText(no, c.locationKey)
                },
                en: { 
                  name: en[c.key]?.name || '', 
                  desc: en[c.key]?.description || '', 
                  levels: en[c.key]?.levels || '', 
                  duration: en[c.key]?.duration || '', 
                  teacherName: en[c.key]?.teacherName || '', 
                  teacherInfo: en[c.key]?.teacherInfo || '', 
                  location: getLocationText(en, c.locationKey)
                },
                ua: { 
                  name: ua[c.key]?.name || '', 
                  desc: ua[c.key]?.description || '', 
                  levels: ua[c.key]?.levels || '', 
                  duration: ua[c.key]?.duration || '', 
                  teacherName: ua[c.key]?.teacherName || '', 
                  teacherInfo: ua[c.key]?.teacherInfo || '', 
                  location: getLocationText(ua, c.locationKey)
                }
            },
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "courses"), courseDoc);
    }
    console.log("Success! Courses migrated.");
    process.exit(0);
}

migrate().catch(err => {
    console.error("Failed:", err.message);
    process.exit(1);
});
