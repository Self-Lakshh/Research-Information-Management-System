import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/configs/firebase.config';
import { User, CreateUserData, UpdateUserData } from '@/@types/rims.types';

const USERS_COLLECTION = 'users';

/**
 * Create a new user document in Firestore
 */
export const createUser = async (uid: string, data: CreateUserData): Promise<User> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);

        const userData: User = {
            uid,
            email: data.email,
            name: data.name,
            user_role: data.user_role,
            phone_number: data.phone_number,
            address: data.address,
            designation: data.designation,
            department: data.department,
            is_active: true,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        };

        await setDoc(userRef, userData);
        return userData;
    } catch (error: any) {
        console.error('Create user error:', error);
        throw new Error(error.message || 'Failed to create user');
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (uid: string): Promise<User | null> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return null;
        }

        return userSnap.data() as User;
    } catch (error: any) {
        console.error('Get user error:', error);
        throw new Error(error.message || 'Failed to get user');
    }
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const querySnapshot = await getDocs(usersRef);

        return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error: any) {
        console.error('Get all users error:', error);
        throw new Error(error.message || 'Failed to get users');
    }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: 'user' | 'admin'): Promise<User[]> => {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(usersRef, where('user_role', '==', role));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error: any) {
        console.error('Get users by role error:', error);
        throw new Error(error.message || 'Failed to get users by role');
    }
};

/**
 * Get active users only
 */
export const getActiveUsers = async (): Promise<User[]> => {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(usersRef, where('is_active', '==', true));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error: any) {
        console.error('Get active users error:', error);
        throw new Error(error.message || 'Failed to get active users');
    }
};

/**
 * Update user data
 */
export const updateUser = async (uid: string, data: UpdateUserData): Promise<void> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);

        await updateDoc(userRef, {
            ...data,
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Update user error:', error);
        throw new Error(error.message || 'Failed to update user');
    }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (uid: string): Promise<void> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await deleteDoc(userRef);
    } catch (error: any) {
        console.error('Delete user error:', error);
        throw new Error(error.message || 'Failed to delete user');
    }
};

/**
 * Deactivate user (soft delete)
 */
export const deactivateUser = async (uid: string): Promise<void> => {
    try {
        await updateUser(uid, { is_active: false });
    } catch (error: any) {
        console.error('Deactivate user error:', error);
        throw new Error(error.message || 'Failed to deactivate user');
    }
};

/**
 * Activate user
 */
export const activateUser = async (uid: string): Promise<void> => {
    try {
        await updateUser(uid, { is_active: true });
    } catch (error: any) {
        console.error('Activate user error:', error);
        throw new Error(error.message || 'Failed to activate user');
    }
};

/**
 * Check if user is admin
 */
export const isUserAdmin = async (uid: string): Promise<boolean> => {
    try {
        const user = await getUserById(uid);
        return user?.user_role === 'admin';
    } catch (error) {
        return false;
    }
};

/**
 * Search users by name or email
 */
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const querySnapshot = await getDocs(usersRef);

        const searchLower = searchTerm.toLowerCase();

        return querySnapshot.docs
            .map(doc => doc.data() as User)
            .filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                (user.department && user.department.toLowerCase().includes(searchLower))
            );
    } catch (error: any) {
        console.error('Search users error:', error);
        throw new Error(error.message || 'Failed to search users');
    }
};
