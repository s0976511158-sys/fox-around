import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initialData } from '../src/data/initialData.js';

const firebaseConfig = {
  projectId: "fox-around",
  appId: "1:1002691177555:web:64c499796cba4181c52aa6",
  storageBucket: "fox-around.firebasestorage.app",
  apiKey: "AIzaSyDXVZwvfFHoqn6LufG0cMOR1OGo1xDoFpQ",
  authDomain: "fox-around.firebaseapp.com",
  messagingSenderId: "1002691177555",
  measurementId: "G-4L9P0NMEFF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('Seeding initialData to Firestore project fox-around...');
  try {
    const mainDoc = doc(db, 'siteData', 'main');
    await setDoc(mainDoc, {
      ...initialData,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Successfully seeded initialData to Cloud Firestore siteData/main!');
  } catch (err) {
    console.error('❌ Error seeding Firestore:', err);
  }
}

seed().then(() => process.exit(0));
