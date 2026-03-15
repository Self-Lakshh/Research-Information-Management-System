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
} from "firebase/firestore"

import { db } from "@/configs/firebase.config"
import { Journal } from "./types"

const COLLECTION = "journals"

/* Get All (Admin) */
export const getAllJournals = async (): Promise<Journal[]> => {
 const ref = collection(db, COLLECTION)

 const q = query(ref, where("is_active", "==", true))

 const snap = await getDocs(q)

 return snap.docs.map(d => ({
  id: d.id,
  ...d.data()
 })) as Journal[]
}

/* Get By ID */
export const getJournalById = async (id: string): Promise<Journal | null> => {
 const ref = doc(db, COLLECTION, id)

 const snap = await getDoc(ref)

 if (!snap.exists()) return null

 return {
  id: snap.id,
  ...snap.data()
 } as Journal
}

/* Get Journals of User */
export const getUserJournals = async (
 facultyRef: DocumentReference
): Promise<Journal[]> => {

 const ref = collection(db, COLLECTION)

 const q = query(
  ref,
  where("authors", "array-contains", facultyRef),
  where("is_active", "==", true)
 )

 const snap = await getDocs(q)

 return snap.docs.map(d => ({
  id: d.id,
  ...d.data()
 })) as Journal[]
}

/* Create */
export const createJournal = async (
 id: string,
 data: Omit<Journal, "id" | "created_at" | "updated_at">
): Promise<Journal> => {

 const ref = doc(db, COLLECTION, id)

 const record: Journal = {
  id,
  ...data,
  is_active: true,
  created_at: Timestamp.now(),
  updated_at: Timestamp.now()
 }

 await setDoc(ref, record)

 return record
}

/* Update */
export const updateJournal = async (
 id: string,
 data: Partial<Journal>
) => {

 const ref = doc(db, COLLECTION, id)

 await updateDoc(ref, {
  ...data,
  updated_at: serverTimestamp()
 })
}

/* Soft Delete */
export const deleteJournal = async (id: string) => {

 const ref = doc(db, COLLECTION, id)

 await updateDoc(ref, {
  is_active: false,
  updated_at: serverTimestamp()
 })
}