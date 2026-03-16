import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/configs/firebase.config";
import { Partner, CreatePartnerData, UpdatePartnerData } from "./types";

const PARTNERS_COLLECTION = "partners";

export const createPartner = async (
  data: CreatePartnerData
): Promise<Partner> => {
  try {
    const partnersRef = collection(db, PARTNERS_COLLECTION);
    const docRef = await addDoc(partnersRef, {
      ...data,
      is_active: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const snap = await getDoc(docRef);
    return {
      id: snap.id,
      ...snap.data(),
    } as Partner;
  } catch (error: any) {
    console.error("Create partner error:", error);
    throw new Error(error.message || "Failed to create partner");
  }
};

export const getPartnerById = async (id: string): Promise<Partner | null> => {
  try {
    const partnerRef = doc(db, PARTNERS_COLLECTION, id);
    const snap = await getDoc(partnerRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Partner;
  } catch (error: any) {
    console.error("Get partner error:", error);
    throw new Error(error.message || "Failed to get partner");
  }
};

export const getAllPartners = async (): Promise<Partner[]> => {
  try {
    const partnersRef = collection(db, PARTNERS_COLLECTION);
    const snapshot = await getDocs(partnersRef);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Partner[];
  } catch (error: any) {
    console.error("Get all partners error:", error);
    throw new Error(error.message || "Failed to get partners");
  }
};

export const getActivePartners = async (): Promise<Partner[]> => {
  try {
    const partnersRef = collection(db, PARTNERS_COLLECTION);

    const q = query(partnersRef, where("is_active", "==", true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Partner[];
  } catch (error: any) {
    console.error("Get active partners error:", error);
    throw new Error(error.message || "Failed to get active partners");
  }
};

export const updatePartner = async (
  id: string,
  data: UpdatePartnerData
): Promise<void> => {
  try {
    const partnerRef = doc(db, PARTNERS_COLLECTION, id);

    await updateDoc(partnerRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Update partner error:", error);
    throw new Error(error.message || "Failed to update partner");
  }
};

export const deletePartner = async (id: string): Promise<void> => {
  try {
    const partnerRef = doc(db, PARTNERS_COLLECTION, id);
    await deleteDoc(partnerRef);
  } catch (error: any) {
    console.error("Delete partner error:", error);
    throw new Error(error.message || "Failed to delete partner");
  }
};

export const deactivatePartner = async (id: string): Promise<void> => {
  try {
    await updatePartner(id, { is_active: false });
  } catch (error: any) {
    console.error("Deactivate partner error:", error);
    throw new Error(error.message || "Failed to deactivate partner");
  }
};

export const activatePartner = async (id: string): Promise<void> => {
  try {
    await updatePartner(id, { is_active: true });
  } catch (error: any) {
    console.error("Activate partner error:", error);
    throw new Error(error.message || "Failed to activate partner");
  }
};
