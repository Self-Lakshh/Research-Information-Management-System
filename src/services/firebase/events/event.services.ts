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
import { EventRecord, CreateEventData, UpdateEventData } from "./types";

const EVENTS_COLLECTION = "events";

export const createEvent = async (
  data: CreateEventData
): Promise<EventRecord> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const docRef = await addDoc(eventsRef, {
      ...data,
      is_active: true,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    const snap = await getDoc(docRef);
    return {
      id: snap.id,
      ...snap.data(),
    } as EventRecord;
  } catch (error: any) {
    console.error("Create event error:", error);
    throw new Error(error.message || "Failed to create event");
  }
};

export const getEventById = async (id: string): Promise<EventRecord | null> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    const snap = await getDoc(eventRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as EventRecord;
  } catch (error: any) {
    console.error("Get event error:", error);
    throw new Error(error.message || "Failed to get event");
  }
};

export const getAllEvents = async (): Promise<EventRecord[]> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const snapshot = await getDocs(eventsRef);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EventRecord[];
  } catch (error: any) {
    console.error("Get all events error:", error);
    throw new Error(error.message || "Failed to get events");
  }
};

export const getActiveEvents = async (): Promise<EventRecord[]> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);

    const q = query(eventsRef, where("is_active", "==", true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EventRecord[];
  } catch (error: any) {
    console.error("Get active events error:", error);
    throw new Error(error.message || "Failed to get active events");
  }
};

export const updateEvent = async (
  id: string,
  data: UpdateEventData
): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);

    await updateDoc(eventRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error: any) {
    console.error("Update event error:", error);
    throw new Error(error.message || "Failed to update event");
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(eventRef);
  } catch (error: any) {
    console.error("Delete event error:", error);
    throw new Error(error.message || "Failed to delete event");
  }
};

export const deactivateEvent = async (id: string): Promise<void> => {
  try {
    await updateEvent(id, { is_active: false });
  } catch (error: any) {
    console.error("Deactivate event error:", error);
    throw new Error(error.message || "Failed to deactivate event");
  }
};

export const activateEvent = async (id: string): Promise<void> => {
  try {
    await updateEvent(id, { is_active: true });
  } catch (error: any) {
    console.error("Activate event error:", error);
    throw new Error(error.message || "Failed to activate event");
  }
};
