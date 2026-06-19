import * as admin from 'firebase-admin';

// Initialize Firebase Admin App if it hasn't been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    // We use default credentials in production, or if no service account is provided, 
    // we initialize an empty app to just verify ID tokens (which requires only projectId)
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
