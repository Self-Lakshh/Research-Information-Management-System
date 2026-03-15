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
} from "firebase/firestore";

import { db } from "@/configs/firebase.config";
import {
  User,
  UserRole,
  CreateUserData,
  UpdateUserData,
} from "./types";

const USERS_COLLECTION = "users";

/**
 * Create User
 */
export const createUser = async (
  uid: string,
  data: CreateUserData
): Promise<User> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    const userData: User = {
      id: uid,
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      address: data.address,
      user_role: data.user_role,
      designation: data.designation,
      faculty: data.faculty,
      is_active: true,
      created_at: serverTimestamp() as Timestamp,
      updated_at: serverTimestamp() as Timestamp,
    };

    await setDoc(userRef, userData);

    return userData;
  } catch (error: any) {
    console.error("Create user error:", error);
    throw new Error(error.message || "Failed to create user");
  }
};

/**
 * Get User By ID
 */
export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as User;
  } catch (error: any) {
    console.error("Get user error:", error);
    throw new Error(error.message || "Failed to get user");
  }
};

/**
 * Get All Users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as User[];
  } catch (error: any) {
    console.error("Get all users error:", error);
    throw new Error(error.message || "Failed to get users");
  }
};

/**
 * Get Users By Role
 */
export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);

    const q = query(usersRef, where("user_role", "==", role));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as User[];
  } catch (error: any) {
    console.error("Get users by role error:", error);
    throw new Error(error.message || "Failed to get users by role");
  }
};

/**
 * Get Active Users
 */
export const getActiveUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);

    const q = query(usersRef, where("is_active", "==", true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as User[];
  } catch (error: any) {
    console.error("Get active users error:", error);
    throw new Error(error.message || "Failed to get active users");
  }
};

/**
 * Update User
 */
export const updateUser = async (
  uid: string,
  data: UpdateUserData
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    await updateDoc(userRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    throw new Error(error.message || "Failed to update user");
  }
};

/**
 * Delete User
 */
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await deleteDoc(userRef);
  } catch (error: any) {
    console.error("Delete user error:", error);
    throw new Error(error.message || "Failed to delete user");
  }
};

/**
 * Deactivate User (Soft Delete)
 */
export const deactivateUser = async (uid: string): Promise<void> => {
  try {
    await updateUser(uid, { is_active: false });
  } catch (error: any) {
    console.error("Deactivate user error:", error);
    throw new Error(error.message || "Failed to deactivate user");
  }
};

/**
 * Activate User
 */
export const activateUser = async (uid: string): Promise<void> => {
  try {
    await updateUser(uid, { is_active: true });
  } catch (error: any) {
    console.error("Activate user error:", error);
    throw new Error(error.message || "Failed to activate user");
  }
};

/**
 * Check if User is Admin
 */
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const user = await getUserById(uid);
    return user?.user_role === "admin";
  } catch {
    return false;
  }
};

/**
 * Search Users
 */
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);

    const searchLower = searchTerm.toLowerCase();

    return (
      snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as User[]
    ).filter((user) => {
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.faculty?.toLowerCase().includes(searchLower)
      );
    });
  } catch (error: any) {
    console.error("Search users error:", error);
    throw new Error(error.message || "Failed to search users");
  }
};