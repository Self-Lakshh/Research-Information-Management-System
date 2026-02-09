import {
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    updateProfile,
    User as FirebaseUser,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/configs/firebase.config';

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

/**
 * Create new user account (Admin only)
 * Creates user with a temporary password and sends password reset email
 */
export const createUserAccount = async (
    email: string,
    displayName: string
): Promise<FirebaseUser> => {
    try {
        // Generate a temporary random password (user will set their own via reset link)
        const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);

        const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName });

        // Send password reset email so user can set their own password
        await sendPasswordResetEmail(auth, email);

        return user;
    } catch (error: any) {
        console.error('Create user error:', error);
        throw new Error(error.message || 'Failed to create user account');
    }
};

/**
 * Create user and send password reset link (Admin only)
 * This is the recommended way for admins to create users
 */
export const createUserWithResetLink = async (
    email: string,
    displayName: string
): Promise<{ user: FirebaseUser; resetLinkSent: boolean }> => {
    try {
        const user = await createUserAccount(email, displayName);

        return {
            user,
            resetLinkSent: true,
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
