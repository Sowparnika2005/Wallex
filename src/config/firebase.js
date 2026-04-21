// ============================================
// WALLEX — FIREBASE CONFIGURATION
// ============================================
// 
// HOW TO SET UP FIREBASE (Step-by-step):
//
// 1. Go to https://console.firebase.google.com
// 2. Click "Create a project" (or "Add project")
// 3. Enter project name: "Wallex" → Click Continue
// 4. Disable Google Analytics (optional) → Click Create Project
// 5. Once created, click the Web icon (</>) to add a web app
// 6. Register app name: "Wallex Web" → Click Register
// 7. Copy the firebaseConfig object and replace the placeholder below
//
// ENABLE AUTHENTICATION:
// 8. In Firebase Console sidebar → Build → Authentication
// 9. Click "Get started"
// 10. Go to "Sign-in method" tab
// 11. Enable "Email/Password" provider → Save
//
// SET UP FIRESTORE:
// 12. In Firebase Console sidebar → Build → Firestore Database
// 13. Click "Create database"
// 14. Choose "Start in test mode" (for development)
// 15. Select your preferred region → Click Enable
//
// FIRESTORE SECURITY RULES (for production):
// 16. Go to Firestore → Rules tab and paste:
//
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /users/{userId}/{document=**} {
//         allow read, write: if request.auth != null && request.auth.uid == userId;
//       }
//     }
//   }
//
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️  REPLACE these with your actual Firebase config
// You get these values from Firebase Console → Project Settings → Your apps
const firebaseConfig = {
  apiKey: "AIzaSyD3GYEpBeQVOjMqcXfRcTe3e7a7adrd3NE",
  authDomain: "fintrack-a9f65.firebaseapp.com",
  projectId: "fintrack-a9f65",
  storageBucket: "fintrack-a9f65.firebasestorage.app",
  messagingSenderId: "593871279207",
  appId: "1:593871279207:web:93172fd7f0dda3419a30c2",
  measurementId: "G-TRV6GQQM4P"
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;
};

// Initialize Firebase
let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase not configured. Running in demo mode.', error.message);
}

export { auth, db };
export default app;
