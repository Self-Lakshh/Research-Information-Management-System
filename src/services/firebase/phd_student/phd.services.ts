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
import { PhDStudent } from "./types";

const COLLECTION = "phd_students";

/**
 * Get All PhD Students (Admin)
 */
export const getAllPhDStudents = async (): Promise<PhDStudent[]> => {
  try {
    const ref = collection(db, COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as PhDStudent[];

  } catch (error: any) {
    console.error("Get all PhD students error:", error);
    throw new Error(error.message || "Failed to fetch PhD students");
  }
};


/**
 * Get PhD Student By ID
 */
export const getPhDStudentById = async (
  id: string
): Promise<PhDStudent | null> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as PhDStudent;

  } catch (error: any) {
    console.error("Get PhD student error:", error);
    throw new Error(error.message || "Failed to fetch PhD student");
  }
};


/**
 * Get PhD Students of a Faculty
 */
export const getUserPhDStudents = async (
  facultyRef: DocumentReference
): Promise<PhDStudent[]> => {

  try {

    const ref = collection(db, COLLECTION);

    const q = query(
      ref,
      where("faculty_ref", "==", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as PhDStudent[];

  } catch (error: any) {
    console.error("Get user PhD students error:", error);
    throw new Error(error.message || "Failed to fetch user PhD students");
  }
};


/**
 * Create PhD Student Record
 */
export const createPhDStudent = async (
  id: string,
  data: Omit<PhDStudent, "id" | "created_at" | "updated_at">
): Promise<PhDStudent> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const record: PhDStudent = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, record);

    return record;

  } catch (error: any) {
    console.error("Create PhD student error:", error);
    throw new Error(error.message || "Failed to create PhD student");
  }
};


/**
 * Update PhD Student
 */
export const updatePhDStudent = async (
  id: string,
  data: Partial<PhDStudent>
): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Update PhD student error:", error);
    throw new Error(error.message || "Failed to update PhD student");
  }
};


/**
 * Soft Delete PhD Student
 */
export const deletePhDStudent = async (id: string): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Delete PhD student error:", error);
    throw new Error(error.message || "Failed to delete PhD student");
  }
};