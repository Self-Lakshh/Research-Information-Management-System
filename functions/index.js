/**
 * Cloud Functions for RIMS User Management
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Admin SDK
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

/**
 * Creates a user account via Admin SDK and sends a password reset link.
 * Can only be called by an Admin user.
 * 
 * Data: {
 *   email: string,
 *   name: string,
 *   role: 'admin' | 'user',
 *   faculty: string,
 *   designation?: string,
 *   phone_number?: string
 * }
 */
exports.adminCreateUser = functions.https.onCall(async (data, context) => {
    // 1. Verify Authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    const callerUid = context.auth.uid;

    try {
        // 2. Verify Caller is Admin
        const callerDoc = await db.collection('users').doc(callerUid).get();
        if (!callerDoc.exists) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Caller user profile not found.'
            );
        }

        const callerData = callerDoc.data();
        if (callerData.user_role !== 'admin') {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Only admins can create new users.'
            );
        }

        // 3. Extract and Validate Input Data
        const { email, name, role, ...otherData } = data;

        if (!email || !name) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Email and Name are required.'
            );
        }

        // 4. Create Authentication User
        // We create the user without a password initially (or a random one)
        const userRecord = await auth.createUser({
            email,
            displayName: name,
            emailVerified: false,
            disabled: false
        });

        const newUid = userRecord.uid;

        // 5. Generate Password Reset Link
        const resetLink = await auth.generatePasswordResetLink(email);

        // 6. Create Firestore Document
        const newUserProfile = {
            uid: newUid,
            name,
            email,
            user_role: role || 'user',
            is_active: true,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            created_by: callerUid,
            ...otherData
            // faculty, designation, phone_number, etc.
        };

        await db.collection('users').doc(newUid).set(newUserProfile);

        // 7. Return Result
        // Ideally, you should email this link via an email provider (SendGrid, etc.)
        // Since we don't have one configured, we return the link to the client 
        // (so the admin can copy/send it manually if needed, or just for verification)
        return {
            success: true,
            uid: newUid,
            message: `User ${email} created successfully.`,
            resetLink: resetLink
        };

    } catch (error) {
        console.error('Error in adminCreateUser:', error);

        // Handle specific Firebase Auth errors
        if (error.code === 'auth/email-already-exists') {
            throw new functions.https.HttpsError(
                'already-exists',
                'The email address is already in use by another account.'
            );
        }

        // Re-throw HttpsErrors
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        // Generic error
        throw new functions.https.HttpsError(
            'internal',
            'An internal error occurred while creating the user.',
            error.message
        );
    }
});
