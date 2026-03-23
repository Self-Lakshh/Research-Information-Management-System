import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    const missing = [];
    if (!projectId) missing.push('FIREBASE_PROJECT_ID');
    if (!clientEmail) missing.push('FIREBASE_CLIENT_EMAIL');
    if (!privateKeyRaw) missing.push('FIREBASE_PRIVATE_KEY');
    throw new Error(`Cloud-Admin error: Missing required environment variables on Netlify: ${missing.join(', ')}. ` +
                    `Ensure they are set in Site settings -> Environment variables.`);
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export { admin };
