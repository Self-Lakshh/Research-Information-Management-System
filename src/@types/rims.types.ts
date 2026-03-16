import { Timestamp, DocumentReference } from "firebase/firestore";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface BaseRecordDetails {
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: DocumentReference;
  updated_by?: DocumentReference;
  approval_status?: ApprovalStatus;
  approval_action_by?: DocumentReference;
  action_at?: Timestamp;
  is_active?: boolean;
  document_id?: string;
  user_id?: string;
}

// Media Types
export type MediaType =
  | "profile"
  | "events"


export type RecordType =
  | 'ipr'
  | 'journal'
  | 'conference'
  | 'book'
  | 'award'
  | 'consultancy'
  | 'phd_student'
  | 'other'

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  userId?: string;
  userName: string;
  name?: string;
  email: string;
  user_role: UserRole;
  avatar?: string;
  phone_number?: string;
  address?: string;
  designation?: string;
  faculty?: string;
  department?: string;
  is_active?: boolean;
  created_at?: Timestamp;
}

export interface Record extends BaseRecordDetails {
  id: string;
  type: RecordType;
  _domain?: string;
  [key: string]: any;
}

export interface RecordFilters {
  type?: RecordType | 'all';
  status?: ApprovalStatus | 'all';
  searchQuery?: string;
  year?: string | number;
}

export type MediaStatus = "active" | "inactive";

export interface Media {
  id: string;
  media_name: string;
  media_type: MediaType;
  media_description?: string;
  media_url: string;
  uploaded_by: DocumentReference;
  uploaded_at: Timestamp;
  status: MediaStatus;
}

// Document Types
export type DocumentType =
  | "journal"
  | "conference"
  | "patent"
  | "book"
  | "phd_student_data"
  | "ipr"
  | "consultancy"
  | "award"
  | "event";

export type DocumentStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface DocumentFile {
  id: string;
  document_name: string;
  document_type: DocumentType;
  file_url: string;
  description?: string;
  status: DocumentStatus;
  reviewed_by?: DocumentReference;
  review_date?: Timestamp;
  uploaded_by: DocumentReference;
  upload_date: Timestamp;
  created_at: Timestamp;
}