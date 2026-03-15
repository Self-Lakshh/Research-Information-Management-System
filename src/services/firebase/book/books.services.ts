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
import { Book } from "./types";

const COLLECTION = "books";

/**
 * Get All Books (Admin)
 */
export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const ref = collection(db, COLLECTION);

    const q = query(ref, where("is_active", "==", true));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Book[];

  } catch (error: any) {
    console.error("Get all books error:", error);
    throw new Error(error.message || "Failed to fetch books");
  }
};


/**
 * Get Book By ID
 */
export const getBookById = async (
  id: string
): Promise<Book | null> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Book;

  } catch (error: any) {
    console.error("Get book error:", error);
    throw new Error(error.message || "Failed to fetch book");
  }
};


/**
 * Get Books of a User
 */
export const getUserBooks = async (
  facultyRef: DocumentReference
): Promise<Book[]> => {

  try {

    const ref = collection(db, COLLECTION);

    const q = query(
      ref,
      where("author", "==", facultyRef),
      where("is_active", "==", true)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Book[];

  } catch (error: any) {
    console.error("Get user books error:", error);
    throw new Error(error.message || "Failed to fetch user books");
  }
};


/**
 * Create Book
 */
export const createBook = async (
  id: string,
  data: Omit<Book, "id" | "created_at" | "updated_at">
): Promise<Book> => {

  try {

    const ref = doc(db, COLLECTION, id);

    const record: Book = {
      id,
      ...data,
      is_active: true,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(ref, record);

    return record;

  } catch (error: any) {
    console.error("Create book error:", error);
    throw new Error(error.message || "Failed to create book");
  }
};


/**
 * Update Book
 */
export const updateBook = async (
  id: string,
  data: Partial<Book>
): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      ...data,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Update book error:", error);
    throw new Error(error.message || "Failed to update book");
  }
};


/**
 * Soft Delete Book
 */
export const deleteBook = async (id: string): Promise<void> => {

  try {

    const ref = doc(db, COLLECTION, id);

    await updateDoc(ref, {
      is_active: false,
      updated_at: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("Delete book error:", error);
    throw new Error(error.message || "Failed to delete book");
  }
};