import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || "demo-key",
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
let app;
let analytics = null;
let db;

// Initialize Firebase synchronously
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
        // Initialize analytics synchronously
        try {
            analytics = getAnalytics(app);
        } catch (analyticsError) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Analytics initialization error:', analyticsError);
            }
        }
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
