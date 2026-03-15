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
    DocumentReference,
} from "firebase/firestore";
import { db } from "@/configs/firebase.config";
import { Media } from "@/@types/rims.types";

const COLLECTION = "media";

/**
 * Create a media record
 */
export const createMedia = async (
    id: string,
    data: Omit<Media, "id">
): Promise<Media> => {
    const ref = doc(db, COLLECTION, id);
    const record: Media = {
        id,
        ...data,
        status: "active",
    };
    await setDoc(ref, record);
    return record;
};

/**
 * Get media by ID
 */
export const getMediaById = async (id: string): Promise<Media | null> => {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Media;
};

/**
 * Update media status
 */
export const updateMediaStatus = async (id: string, status: "active" | "inactive") => {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { status, updated_at: serverTimestamp() });
};
