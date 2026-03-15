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
import { ConsultancyProject } from "./types";

const COLLECTION = "consultancy_projects";

/**
 * Get All Consultancy Projects (Admin)
 */
export const getAllConsultancyProjects = async (): Promise<ConsultancyProject[]> => {
  try {
    const ref = collection(db, COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ConsultancyProject[];

  } catch (error: any) {
    console.error("Get all consultancy projects error:", error);
    throw new Error(error.message || "Failed to fetch consultancy projects");
  }
};


/**
 * Get Consultancy Project By ID
 */
export const getConsultancyProjectById = async (
  id: string
): Promise<ConsultancyProject | null> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as ConsultancyProject;

  } catch (error: any) {
    console.error("Get consultancy project error:", error);
    throw new Error(error.message || "Failed to fetch consultancy project");
  }
};


/**
 * Get Consultancy Projects of a User
 */
export const getUserConsultancyProjects = async (
  facultyRef: DocumentReference
): Promise<ConsultancyProject[]> => {

  try {

    const ref = collection(db, COLLECTION);

    const q = query(
      ref,
      where("principal_investigator_ref", "==", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ConsultancyProject[];

  } catch (error: any) {
    console.error("Get user consultancy projects error:", error);
    throw new Error(error.message || "Failed to fetch user consultancy projects");
  }
};


/**
 * Create Consultancy Project
 */
export const createConsultancyProject = async (
  id: string,
  data: Omit<ConsultancyProject, "id" | "created_at" | "updated_at">
): Promise<ConsultancyProject> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const record: ConsultancyProject = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, record);

    return record;

  } catch (error: any) {
    console.error("Create consultancy project error:", error);
    throw new Error(error.message || "Failed to create consultancy project");
  }
};


/**
 * Update Consultancy Project
 */
export const updateConsultancyProject = async (
  id: string,
  data: Partial<ConsultancyProject>
): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Update consultancy project error:", error);
    throw new Error(error.message || "Failed to update consultancy project");
  }
};


/**
 * Soft Delete Consultancy Project
 */
export const deleteConsultancyProject = async (id: string): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Delete consultancy project error:", error);
    throw new Error(error.message || "Failed to delete consultancy project");
  }
};