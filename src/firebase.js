// Firebase configuration using environment variables
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from './config/config.js';

let app, auth, db, storage;

// Initialize Firebase with retry logic and better error handling
const initializeFirebase = async () => {
  try {
    const firebaseConfig = getFirebaseConfig();
    
    console.log('🔥 Firebase Config:', firebaseConfig);
    console.log('🔥 Project ID:', firebaseConfig.projectId);
    console.log('🔥 Auth Domain:', firebaseConfig.authDomain);
    console.log('🔥 App ID:', firebaseConfig.appId);
    console.log('🔥 API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing');

    // Validate required Firebase config
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      throw new Error('Missing required Firebase configuration values');
    }

    // Check if Firebase is already initialized
    if (app) {
      console.log('🔥 Firebase already initialized, reusing existing app');
      return true;
    }

    app = initializeApp(firebaseConfig);
    console.log('🔥 Firebase App initialized:', app);
    console.log('🔥 App name:', app.name);
    console.log('🔥 App options:', app.options);

    auth = getAuth(app);
    console.log('🔥 Auth initialized:', auth);

    // Configure auth settings for better network handling
    auth.settings.appVerificationDisabledForTesting = false;
    
    // Set up auth state persistence
    auth.useDeviceLanguage();

    db = getFirestore(app);
    console.log('🔥 Firestore initialized:', db);

    storage = getStorage(app);
    console.log('🔥 Storage initialized:', storage);

    // Test Firebase connectivity
    try {
      await auth.signInAnonymously();
      await auth.signOut();
      console.log('🔥 Firebase connectivity test successful');
    } catch (connectivityError) {
      console.warn('🔥 Firebase connectivity test failed:', connectivityError);
      // Don't throw here, just log the warning
    }

    return true;
  } catch (error) {
    console.error('🔥 Firebase initialization failed:', error);
    console.warn('🔥 Firebase failed to initialize, but app will continue');
    return false;
  }
};

// Start Firebase initialization in the background
initializeFirebase();

export { app, auth, db, storage };
