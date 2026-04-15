const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, getIdToken } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyA3KnOfvzBFoGhgJw3Zjz3uWQZR2e15ymo",
  authDomain: "mrija-web.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function run() {
  try {
    console.log("1. Signing in to Firebase...");
    const cred = await signInWithEmailAndPassword(auth, 'svatoslavgg@gmail.com', 'AZSXqw1324');
    const idToken = await getIdToken(cred.user);
    console.log("2. Got Firebase Token. Length:", idToken.length);

    console.log("3. Calling https://api.mrija.no/api/auth/exchange");
    const res = await fetch('https://api.mrija.no/api/auth/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    });

    const data = await res.json();
    console.log("4. Response status:", res.status);
    console.log("5. Response data:", data);
  } catch (err) {
    console.error("TEST FAILED:", err);
  }
}
run();
