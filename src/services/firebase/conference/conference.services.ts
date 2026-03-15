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
import { Conference } from "./types";

const COLLECTION = "conferences";

/**
 * Get All Conference Records (Admin)
 */
export const getAllConference = async (): Promise<Conference[]> => {
  try {
    const ref = collection(db, COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Conference[];

  } catch (error: any) {
    console.error("Get all conference error:", error);
    throw new Error(error.message || "Failed to fetch conferences");
  }
};


/**
 * Get Conference By ID
 */
export const getConferenceById = async (
  id: string
): Promise<Conference | null> => {
  try {
    const ref = doc(db, COLLECTION, id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Conference;

  } catch (error: any) {
    console.error("Get conference error:", error);
    throw new Error(error.message || "Failed to fetch conference");
  }
};


/**
 * Get Conferences of a User
 */
export const getUserConference = async (
  facultyRef: DocumentReference
): Promise<Conference[]> => {

  try {

    const ref = collection(db, COLLECTION);

    const q = query(
      ref,
      where("authors", "array-contains", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Conference[];

  } catch (error: any) {
    console.error("Get user conferences error:", error);
    throw new Error(error.message || "Failed to fetch user conferences");
  }
};


/**
 * Create Conference Record
 */
export const createConference = async (
  id: string,
  data: Omit<Conference, "id" | "created_at" | "updated_at">
): Promise<Conference> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const record: Conference = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, record);

    return record;

  } catch (error: any) {
    console.error("Create conference error:", error);
    throw new Error(error.message || "Failed to create conference");
  }
};


/**
 * Update Conference Record
 */
export const updateConference = async (
  id: string,
  data: Partial<Conference>
): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Update conference error:", error);
    throw new Error(error.message || "Failed to update conference");
  }
};


/**
 * Soft Delete Conference
 */
export const deleteConference = async (id: string): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Delete conference error:", error);
    throw new Error(error.message || "Failed to delete conference");
  }
};