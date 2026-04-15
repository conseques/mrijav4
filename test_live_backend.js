require('dotenv').config({ path: 'backend/.env' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, getIdToken } = require('firebase/auth');

// Initialize Firebase (using local config just to mock the frontend)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "mrija4.firebaseapp.com",
};
// wait I don't have the config here but I can check src/firebase.js
