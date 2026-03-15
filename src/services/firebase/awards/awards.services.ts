import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  DocumentReference
} from "firebase/firestore";

import { db } from "@/configs/firebase.config";
import { Award } from "./types";

const COLLECTION = "awards";

/**
 * Get All Awards (Admin)
 */
export const getAllAwards = async (): Promise<Award[]> => {
  try {
    const ref = collection(db, COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Award[];

  } catch (error: any) {
    console.error("Get all awards error:", error);
    throw new Error(error.message || "Failed to fetch awards");
  }
};


/**
 * Get Award By ID
 */
export const getAwardById = async (
  id: string
): Promise<Award | null> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Award;

  } catch (error: any) {
    console.error("Get award error:", error);
    throw new Error(error.message || "Failed to fetch award");
  }
};


/**
 * Get Awards of a User
 */
export const getUserAwards = async (
  facultyRef: DocumentReference
): Promise<Award[]> => {

  try {

    const ref = collection(db, COLLECTION);

    const q = query(
      ref,
      where("recipient_ref", "==", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Award[];

  } catch (error: any) {
    console.error("Get user awards error:", error);
    throw new Error(error.message || "Failed to fetch user awards");
  }
};


/**
 * Create Award
 */
export const createAward = async (
  id: string,
  data: Omit<Award, "id" | "created_at" | "updated_at">
): Promise<Award> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const record: Award = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, record);

    return record;

  } catch (error: any) {
    console.error("Create award error:", error);
    throw new Error(error.message || "Failed to create award");
  }
};


/**
 * Update Award
 */
export const updateAward = async (
  id: string,
  data: Partial<Award>
): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Update award error:", error);
    throw new Error(error.message || "Failed to update award");
  }
};


/**
 * Soft Delete Award
 */
export const deleteAward = async (id: string): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Delete award error:", error);
    throw new Error(error.message || "Failed to delete award");
  }
};