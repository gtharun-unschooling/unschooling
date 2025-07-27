// Firebase configuration using environment variables
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from './config/config';

const firebaseConfig = getFirebaseConfig();

console.log('🔥 Firebase Config:', firebaseConfig);
console.log('🔥 Project ID:', firebaseConfig.projectId);
console.log('🔥 Auth Domain:', firebaseConfig.authDomain);
console.log('🔥 App ID:', firebaseConfig.appId);
console.log('🔥 API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing');

const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase App initialized:', app);
console.log('🔥 App name:', app.name);
console.log('🔥 App options:', app.options);

const auth = getAuth(app);
console.log('🔥 Auth initialized:', auth);

const db = getFirestore(app);
console.log('🔥 Firestore initialized:', db);

const storage = getStorage(app);
console.log('🔥 Storage initialized:', storage);

export { app, auth, db, storage };
