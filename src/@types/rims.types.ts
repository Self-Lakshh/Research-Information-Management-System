import { Timestamp, DocumentReference } from 'firebase/firestore';

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'user' | 'admin';

export interface User {
    uid: string;
    name: string;
    email: string;
    phone_number?: string;
    address?: string;
    user_role: UserRole;
    designation?: string;
    faculty?: string;
    is_active: boolean;
    created_at: Timestamp;
    updated_at: Timestamp;
    profile_picture_url?: string;
    profile_picture_media?: DocumentReference; // Reference to media collection
}

export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    user_role: UserRole;
    phone_number?: string;
    address?: string;
    designation?: string;
    faculty?: string;
}

export interface UpdateUserData {
    name?: string;
    phone_number?: string;
    address?: string;
    designation?: string;
    faculty?: string;
    profile_picture_url?: string;
    is_active?: boolean;
}

// ============================================
// MEDIA TYPES
// ============================================

export type MediaType = 'event' | 'partners-logo' | 'profile' | 'document';
export type MediaStatus = 'active' | 'inactive';

export interface Media {
    id: string;
    media_name: string;
    media_type: MediaType;
    media_url: string;
    uploaded_by: DocumentReference; // Reference to user
    uploaded_at: Timestamp;
    status: MediaStatus;
}

// ============================================
// DOCUMENT TYPES
// ============================================

export type DocumentType =
    | 'journal'
    | 'conference'
    | 'patent'
    | 'book'
    | 'phd_student'
    | 'ipr'
    | 'consultancy'
    | 'award'
    | 'workshop'
    | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
    id: string;
    document_name: string;
    document_type: DocumentType;
    file_url: string;
    description?: string;
    status: DocumentStatus;
    reviewed_by?: DocumentReference; // Reference to admin user
    review_date?: Timestamp;
    uploaded_by: DocumentReference; // Reference to user
    upload_date: Timestamp;
    created_at: Timestamp;
}

// ============================================
// RECORD TYPES
// ============================================

export type RecordType =
    | 'journal'
    | 'conference'
    | 'book'
    | 'ipr'
    | 'award'
    | 'consultancy'
    | 'phd_student'
    | 'other';

export type ResearchCategory = RecordType;

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'draft' | 'accepted';

// Base fields for all records
interface BaseRecordFields {
    id: string;
    approval_status: ApprovalStatus;
    approval_action_by?: DocumentReference; // Reference to admin
    action_at?: Timestamp;
    created_at: Timestamp;
    updated_at: Timestamp;
    created_by: DocumentReference; // Reference to user
    updated_by?: DocumentReference; // Reference to user
}

// ============================================
// IPR (Intellectual Property Rights)
// ============================================

export type PatentType = 'design' | 'patent' | 'copyright' | 'trademark';
export type IPRStatus = 'filed' | 'granted' | 'published';

export interface IPR extends BaseRecordFields {
    faculty_ref: DocumentReference; // Reference to user
    application_no: string;
    title: string;
    inventors: string[];
    applicants: string[];
    country: string;
    published_date?: string;
    patent_type: PatentType;
    status: IPRStatus;
    sources: DocumentReference[]; // References to documents
}

// ============================================
// PHD STUDENT DATA
// ============================================

export interface PhDStudent extends BaseRecordFields {
    name: string;
    faculty_ref: DocumentReference; // Reference to faculty user
    supervisor_type?: string;
    name_of_student: string;
    enrollment_number: string;
    phd_stream?: string;
}

// ============================================
// JOURNAL
// ============================================

export interface Journal extends BaseRecordFields {
    title_of_paper: string;
    authors: DocumentReference[]; // References to users
    journal_name: string;
    journal_type?: string;
    date_of_publication?: string;
    ISSN_number?: string;
    web_link?: string; // DOI or proof link
    sources: DocumentReference[]; // References to documents
}

// ============================================
// CONFERENCE
// ============================================

export interface Conference extends BaseRecordFields {
    authors: DocumentReference[]; // References to users
    title_of_paper: string;
    title_of_proceedings_of_conference?: string;
    name_of_conference: string;
    origin?: string; // nationality
    year_of_publication?: string;
    isbn_issn_number?: string;
    name_of_publisher?: string;
    sources: DocumentReference[]; // References to documents
}

// ============================================
// BOOK
// ============================================

export interface Book extends BaseRecordFields {
    author: DocumentReference; // Reference to user
    title_of_book: string;
    date_of_publication?: string;
    ISBN_number?: string;
    publisher_name?: string;
    sources: DocumentReference[]; // References to documents
}

// ============================================
// CONSULTANCY PROJECT GRANTS
// ============================================

export type ProjectStatus = 'ongoing' | 'completed';

export interface ConsultancyProject extends BaseRecordFields {
    project_title: string;
    amount?: number;
    organization?: string;
    organization_url?: string;
    principal_investigator_ref: DocumentReference; // Reference to user
    co_investigators_refs: DocumentReference[]; // References to users
    institution?: string;
    duration?: string;
    grant_date?: string;
    status: ProjectStatus;
    sources: DocumentReference[]; // References to documents
}

// ============================================
// AWARDS
// ============================================

export interface Award extends BaseRecordFields {
    award_name: string;
    title: string;
    recipient_ref: DocumentReference; // Reference to user
    institution_body?: string;
    country?: string;
    month_year?: string;
    sources: DocumentReference[]; // References to documents
}

// ============================================
// OTHERS (Workshops, Seminars, FDP, Keynotes)
// ============================================

export type OtherEventType = 'FDP' | 'Seminar' | 'Workshop' | 'Keynote Speaker';

export interface OtherEvent extends BaseRecordFields {
    type: OtherEventType;
    topic_title: string;
    organization?: string;
    date?: string;
    role?: string;
    involved_faculty_refs: DocumentReference[]; // References to users
    sources: DocumentReference[]; // References to documents
}

// ============================================
// UNION TYPES
// ============================================

export type Record =
    | IPR
    | PhDStudent
    | Journal
    | Conference
    | Book
    | ConsultancyProject
    | Award
    | OtherEvent;

// ============================================
// FORM DATA TYPES (without references, for creation)
// ============================================

export interface CreateIPRData {
    application_no: string;
    title: string;
    inventors: string[];
    applicants: string[];
    country: string;
    published_date?: string;
    patent_type: PatentType;
    status: IPRStatus;
    files?: File[];
}

export interface CreatePhDStudentData {
    name: string;
    supervisor_type?: string;
    name_of_student: string;
    enrollment_number: string;
    phd_stream?: string;
    files?: File[];
}

export interface CreateJournalData {
    title_of_paper: string;
    author_ids: string[]; // User IDs
    journal_name: string;
    journal_type?: string;
    date_of_publication?: string;
    ISSN_number?: string;
    web_link?: string;
    files?: File[];
}

export interface CreateConferenceData {
    author_ids: string[]; // User IDs
    title_of_paper: string;
    title_of_proceedings_of_conference?: string;
    name_of_conference: string;
    origin?: string;
    year_of_publication?: string;
    isbn_issn_number?: string;
    name_of_publisher?: string;
    files?: File[];
}

export interface CreateBookData {
    author_id: string; // User ID
    title_of_book: string;
    date_of_publication?: string;
    ISBN_number?: string;
    publisher_name?: string;
    files?: File[];
}

export interface CreateConsultancyData {
    project_title: string;
    amount?: number;
    organization?: string;
    organization_url?: string;
    principal_investigator_id: string; // User ID
    co_investigator_ids: string[]; // User IDs
    institution?: string;
    duration?: string;
    grant_date?: string;
    status: ProjectStatus;
    files?: File[];
}

export interface CreateAwardData {
    award_name: string;
    title: string;
    recipient_id: string; // User ID
    institution_body?: string;
    country?: string;
    month_year?: string;
    files?: File[];
}

export interface CreateOtherEventData {
    type: OtherEventType;
    topic_title: string;
    organization?: string;
    date?: string;
    role?: string;
    involved_faculty_ids: string[]; // User IDs
    files?: File[];
}

export type CreateRecordData =
    | CreateIPRData
    | CreatePhDStudentData
    | CreateJournalData
    | CreateConferenceData
    | CreateBookData
    | CreateConsultancyData
    | CreateAwardData
    | CreateOtherEventData;

// ============================================
// STATISTICS TYPES
// ============================================

export interface UserStats {
    totalRecords: number;
    iprCount: number;
    journalCount: number;
    conferenceCount: number;
    bookCount: number;
    consultancyCount: number;
    awardCount: number;
    phdStudentCount: number;
    otherEventCount: number;
}

export interface AdminStats extends UserStats {
    totalUsers: number;
    activeUsers: number;
    pendingRecords: number;
    approvedRecords: number;
    rejectedRecords: number;
    yearWiseStats: {
        year: number;
        count: number;
    }[];
    categoryStats: {
        type: RecordType;
        count: number;
    }[];
}

// ============================================
// FILTER & QUERY TYPES
// ============================================

export interface RecordFilters {
    type?: RecordType;
    approval_status?: ApprovalStatus;
    year?: number;
    userId?: string;
    searchQuery?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
