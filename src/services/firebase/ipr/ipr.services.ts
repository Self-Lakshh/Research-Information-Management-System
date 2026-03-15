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
import { IPR } from "./types";

const IPR_COLLECTION = "ipr";

/**
 * Get All IPR (Admin)
 */
export const getAllIPR = async (): Promise<IPR[]> => {
  try {
    const ref = collection(db, IPR_COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as IPR[];
  } catch (error: any) {
    console.error("Get all IPR error:", error);
    throw new Error(error.message || "Failed to fetch IPR records");
  }
};

/**
 * Get IPR by ID
 */
export const getIPRById = async (iprId: string): Promise<IPR | null> => {
  try {
    const ref = doc(db, IPR_COLLECTION, iprId);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as IPR;
  } catch (error: any) {
    console.error("Get IPR error:", error);
    throw new Error(error.message || "Failed to fetch IPR");
  }
};

/**
 * Get all IPR of a User
 */
export const getUserIPR = async (
  facultyRef: DocumentReference
): Promise<IPR[]> => {
  try {
    const ref = collection(db, IPR_COLLECTION);

    const q = query(
      ref,
      where("faculty_ref", "==", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as IPR[];
  } catch (error: any) {
    console.error("Get user IPR error:", error);
    throw new Error(error.message || "Failed to fetch user IPR");
  }
};

/**
 * Create IPR
 */
export const createIPR = async (
  id: string,
  data: Omit<IPR, "id" | "created_at" | "updated_at">
): Promise<IPR> => {
  try {
    const ref = doc(db, IPR_COLLECTION, id);

    const iprData: IPR = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, iprData);

    return iprData;
  } catch (error: any) {
    console.error("Create IPR error:", error);
    throw new Error(error.message || "Failed to create IPR");
  }
};

/**
 * Update IPR
 */
export const updateIPR = async (
  iprId: string,
  data: Partial<IPR>
): Promise<void> => {
  try {
    const ref = doc(db, IPR_COLLECTION, iprId);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Update IPR error:", error);
    throw new Error(error.message || "Failed to update IPR");
  }
};

/**
 * Soft Delete IPR
 */
export const deleteIPR = async (iprId: string): Promise<void> => {
  try {
    const ref = doc(db, IPR_COLLECTION, iprId);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Delete IPR error:", error);
    throw new Error(error.message || "Failed to delete IPR");
  }
};