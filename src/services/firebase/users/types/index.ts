import { DocumentReference, Timestamp } from "firebase/firestore";

// User Types
export type UserRole = "admin" | "user";

export type Faculty =
  | "FCI"
  | "FOM"
  | "FIAT"
  | "FDLS";

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
  user_role: UserRole;
  designation?: string;
  faculty?: Faculty;
  is_active: boolean;
  profile_picture_url?: string;
  profile_picture_media?: DocumentReference;
  joining_date?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Create user payload
export interface CreateUserData {
  name: string
  email: string
  user_role: UserRole

  phone_number?: string
  address?: string
  designation?: string
  faculty?: Faculty
  joining_date?: string
}

// Update user payload
export interface UpdateUserData {
  name?: string
  phone_number?: string
  address?: string
  designation?: string
  faculty?: Faculty
  joining_date?: string

  profile_picture_url?: string
  profile_picture_media?: DocumentReference

  is_active?: boolean
} 