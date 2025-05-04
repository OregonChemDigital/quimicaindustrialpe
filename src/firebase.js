import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let analytics = null;
let db;

try {
    // First check if Firebase is already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
        app = getApp();
    } else {
        app = initializeApp(firebaseConfig);
    }

    // Initialize Firestore
    db = getFirestore(app);

    // Initialize analytics if supported and in browser environment
    if (typeof window !== 'undefined') {
        isSupported().then(supported => {
            if (supported) {
                try {
                    analytics = getAnalytics(app);
                } catch (analyticsError) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Analytics initialization error:', analyticsError);
                    }
                }
            }
        });
    }
} catch (error) {
    if (process.env.NODE_ENV === 'development') {
        console.error('Firebase initialization error:', error);
    }
    // Don't throw the error in production
    if (process.env.NODE_ENV === 'development') {
        throw error;
    }
}

export { app, analytics, db }; 