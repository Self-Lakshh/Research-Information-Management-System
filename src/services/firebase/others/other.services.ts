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
import { OtherEvent } from "./types";

const COLLECTION = "other_events";

/**
 * Get All Other Events (Admin)
 */
export const getAllOtherEvents = async (): Promise<OtherEvent[]> => {
  try {
    const ref = collection(db, COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as OtherEvent[];

  } catch (error: any) {
    console.error("Get all other events error:", error);
    throw new Error(error.message || "Failed to fetch other events");
  }
};


/**
 * Get Other Event By ID
 */
export const getOtherEventById = async (
  id: string
): Promise<OtherEvent | null> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as OtherEvent;

  } catch (error: any) {
    console.error("Get other event error:", error);
    throw new Error(error.message || "Failed to fetch other event");
  }
};


/**
 * Get Events of a User
 */
export const getUserOtherEvents = async (
  facultyRef: DocumentReference
): Promise<OtherEvent[]> => {

  try {

    const ref = collection(db, COLLECTION);

    const q = query(
      ref,
      where("involved_faculty_refs", "array-contains", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as OtherEvent[];

  } catch (error: any) {
    console.error("Get user other events error:", error);
    throw new Error(error.message || "Failed to fetch user other events");
  }
};


/**
 * Create Other Event
 */
export const createOtherEvent = async (
  id: string,
  data: Omit<OtherEvent, "id" | "created_at" | "updated_at">
): Promise<OtherEvent> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const record: OtherEvent = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, record);

    return record;

  } catch (error: any) {
    console.error("Create other event error:", error);
    throw new Error(error.message || "Failed to create other event");
  }
};


/**
 * Update Other Event
 */
export const updateOtherEvent = async (
  id: string,
  data: Partial<OtherEvent>
): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Update other event error:", error);
    throw new Error(error.message || "Failed to update other event");
  }
};


/**
 * Soft Delete Other Event
 */
export const deleteOtherEvent = async (id: string): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Delete other event error:", error);
    throw new Error(error.message || "Failed to delete other event");
  }
};