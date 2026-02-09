import {
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    updateProfile,
    User as FirebaseUser,
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import { auth, app } from '@/configs/firebase.config';

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        console.error('Sign in error:', error);
        throw new Error(error.message || 'Failed to sign in');
    }
};

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        console.error('Sign out error:', error);
        throw new Error(error.message || 'Failed to sign out');
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error('Password reset error:', error);
        throw new Error(error.message || 'Failed to send password reset email');
    }
};

import { httpsCallable } from 'firebase/functions';
import { functions } from '@/configs/firebase.config';

/**
 * Interface for Admin Create User response
 */
interface AdminCreateUserResponse {
    success: boolean;
    uid: string;
    message: string;
    resetLink?: string;
}

/**
 * Interface for User Data passed to the cloud function
 */
interface CreateUserData {
    email: string;
    name: string;
    role: string;
    faculty?: string;
    designation?: string;
    phone_number?: string;
}

/**
 * Create user via Cloud Function (Admin only)
 * REVERTED: Cloud Functions require Blaze plan. Using client-side creation for now.
 */
export const createUserByAdmin = async (
    data: CreateUserData
): Promise<{ user: { uid: string; email: string }; resetLink?: string }> => {
    // FALLBACK: Use client-side creation (same logic as createUserAccount used to have)
    // This is less secure but works on Spark plan.

    let secondaryApp: any = null;
    try {
        const { initializeApp, deleteApp } = await import('firebase/app');
        const config = app.options;
        secondaryApp = initializeApp(config, 'Secondary');

        const secondaryAuth = getAuth(secondaryApp);

        // Generate a temporary random password
        const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "Aa1!";

        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, tempPassword);
        const user = userCredential.user;

        await updateProfile(user, { displayName: data.name });

        // Send password reset email
        try {
            console.log(`Attempting to send password reset email to ${data.email}...`);
            await sendPasswordResetEmail(secondaryAuth, data.email);
            console.log(`Password reset email sent successfully to ${data.email}`);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
        }

        await signOut(secondaryAuth);

        // Clean up
        if (secondaryApp) {
            const { deleteApp } = await import('firebase/app');
            await deleteApp(secondaryApp);
        }

        return {
            user: {
                uid: user.uid,
                email: data.email
            },
            // Client-side flow sends email directly, so we don't return a link.
            resetLink: undefined
        };

    } catch (error: any) {
        console.error('Create user by admin error:', error);
        if (secondaryApp) {
            const { deleteApp } = await import('firebase/app');
            await deleteApp(secondaryApp);
        }
        throw new Error(error.message || 'Failed to create user via admin function');
    }
    /* 
        // ORIGINAL CLOUD FUNCTION CALL (Commented out for Spark Plan)
        try {
            const adminCreateUser = httpsCallable<CreateUserData, AdminCreateUserResponse>(functions, 'adminCreateUser');
            const result = await adminCreateUser(data);
            
            console.log('Cloud function response:', result.data);
    
            return {
                user: {
                    uid: result.data.uid,
                    email: data.email
                },
                resetLink: result.data.resetLink
            };
        } catch (error: any) {
            console.error('Create user by admin error:', error);
            throw new Error(error.message || 'Failed to create user via admin function');
        }
    */
};

/**
 * @deprecated Use createUserByAdmin instead. This function is kept for signature compatibility during refactor but now calls the cloud function.
 */
export const createUserWithResetLink = async (
    email: string,
    displayName: string,
    additionalData?: { faculty?: string; designation?: string; phone_number?: string; role?: string }
): Promise<{ user: any; resetLinkSent: boolean }> => {
    try {
        const result = await createUserByAdmin({
            email,
            name: displayName,
            role: additionalData?.role || 'user',
            ...additionalData
        });

        // Map response to match expected return type as closely as possible
        return {
            user: result.user,
            resetLinkSent: !!result.resetLink,
        };
    } catch (error: any) {
        console.error('Create user with reset link error:', error);
        throw new Error(error.message || 'Failed to create user and send reset link');
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
}): Promise<void> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        await updateProfile(user, data);
    } catch (error: any) {
        console.error('Update profile error:', error);
        throw new Error(error.message || 'Failed to update profile');
    }
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseUser | null => {
    return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Get current user ID token
 */
export const getUserToken = async (): Promise<string | null> => {
    try {
        const user = auth.currentUser;
        if (!user) return null;
        return await user.getIdToken();
    } catch (error: any) {
        console.error('Get token error:', error);
        return null;
    }
};
