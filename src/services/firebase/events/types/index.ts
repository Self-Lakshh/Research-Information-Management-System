import { Timestamp } from "firebase/firestore";

export interface EventRecord {
  id: string; // Document ID
  title: string;
  event_date?: string; // "YYYY-MM-DD"
  image_url: string;
  image_media?: string; // "media/{media_id}"
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: string; // "users/{user_id}"
  updated_by?: string; // "users/{user_id}"
  is_active: boolean;
}

export type CreateEventData = Omit<EventRecord, "id" | "created_at" | "updated_at" | "is_active">;
export type UpdateEventData = Partial<Omit<EventRecord, "id" | "created_at" | "updated_at" | "created_by">>;
