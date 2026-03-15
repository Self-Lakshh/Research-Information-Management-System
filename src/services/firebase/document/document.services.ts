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
import { DocumentFile } from "@/@types/rims.types";

const COLLECTION = "documents";

/**
 * Create a document record
 */
export const createDocument = async (
    id: string,
    data: Omit<DocumentFile, "id" | "created_at">
): Promise<DocumentFile> => {
    const ref = doc(db, COLLECTION, id);
    const record: DocumentFile = {
        id,
        ...data,
        created_at: Timestamp.now(),
    };
    await setDoc(ref, record);
    return record;
};

/**
 * Get document by ID
 */
export const getDocumentById = async (id: string): Promise<DocumentFile | null> => {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as DocumentFile;
};

/**
 * Update document status
 */
export const updateDocumentStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected",
    reviewedBy?: DocumentReference
) => {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, {
        status,
        reviewed_by: reviewedBy || null,
        review_date: serverTimestamp(),
    });
};
