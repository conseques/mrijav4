import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3KnOfvzBFoGhgJw3Zjz3uWQZR2e15ymo",
  authDomain: "mrija-web.firebaseapp.com",
  projectId: "mrija-web",
  storageBucket: "mrija-web.firebasestorage.app",
  messagingSenderId: "412424993671",
  appId: "1:412424993671:web:154a52f31b9b33e941f122",
  measurementId: "G-9YN16F4WV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
