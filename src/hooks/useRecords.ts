/**
 * useRecords.ts
 * ─────────────
 * React Query hooks consumed by admin and user views.
 * Every hook calls the per-domain service files directly.
 * No generic record.service layer required.
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/configs/firebase.config';
import { useAuth } from '@/auth';
import type { RecordType, RecordFilters } from '@/@types/rims.types';

// ── Domain services ───────────────────────────────────────────────────────────
import { getAllIPR, getUserIPR, createIPR, updateIPR, deleteIPR } from '@/services/firebase/ipr/ipr.services';
import { getAllJournals, getUserJournals, createJournal, updateJournal, deleteJournal } from '@/services/firebase/journal/journals.services';
import { getAllConference, getUserConference, createConference, updateConference, deleteConference } from '@/services/firebase/conference/conference.services';
import { getAllBooks, getUserBooks, createBook, updateBook, deleteBook } from '@/services/firebase/book/books.services';
import { getAllAwards, getUserAwards, createAward, updateAward, deleteAward } from '@/services/firebase/awards/awards.services';
import { getAllConsultancyProjects, getUserConsultancyProjects, createConsultancyProject, updateConsultancyProject, deleteConsultancyProject } from '@/services/firebase/consultancy/consultancy.services';
import { getAllPhDStudents, getUserPhDStudents, createPhDStudent, updatePhDStudent, deletePhDStudent } from '@/services/firebase/phd_student/phd.services';
import { getAllOtherEvents, getUserOtherEvents, createOtherEvent, updateOtherEvent, deleteOtherEvent } from '@/services/firebase/others/other.services';
import { uploadFile } from '@/services/firebase/storage.service';
import { createDocument } from '@/services/firebase/document/document.services';
import { newId } from '@/utils/id';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getUid = (user: any): string | undefined => user?.id || user?.uid || user?.userId;
const useUserRef = () => {
    const { user } = useAuth();
    const uid = getUid(user);
    return uid ? doc(db, 'users', uid) : null;
};

/** Firestore collection name → used only for approval status updates */
const TYPE_TO_COL: Record<string, string> = {
    ipr: 'ipr',
    journal: 'journals',
    conference: 'conferences',
    book: 'books',
    award: 'awards',
    awards: 'awards',
    consultancy: 'consultancy_projects',
    phd_student: 'phd_students',
    other: 'other_events',
};

/** Fetch ALL records from every domain in parallel */
async function fetchAllDomains(userRef?: any): Promise<any[]> {
    const fetchers = userRef
        ? [
            getUserIPR(userRef).catch(() => []),
            getUserJournals(userRef).catch(() => []),
            getUserConference(userRef).catch(() => []),
            getUserBooks(userRef).catch(() => []),
            getUserAwards(userRef).catch(() => []),
            getUserConsultancyProjects(userRef).catch(() => []),
            getUserPhDStudents(userRef).catch(() => []),
            getUserOtherEvents(userRef).catch(() => []),
        ]
        : [
            getAllIPR().catch(() => []),
            getAllJournals().catch(() => []),
            getAllConference().catch(() => []),
            getAllBooks().catch(() => []),
            getAllAwards().catch(() => []),
            getAllConsultancyProjects().catch(() => []),
            getAllPhDStudents().catch(() => []),
            getAllOtherEvents().catch(() => []),
        ];
    const results = await Promise.all(fetchers);
    const domains = ['ipr', 'journal', 'conference', 'book', 'award', 'consultancy', 'phd_student', 'other'];
    return results.flatMap((arr, i) =>
        arr.map((r: any) => ({ ...r, _domain: domains[i], type: domains[i] }))
    );
}

/** Fetch records from a single domain (admin) */
async function fetchDomain(type: string): Promise<any[]> {
    const tag = (arr: any[], domain: string) => arr.map(r => ({ ...r, _domain: domain, type: domain }));
    switch (type) {
        case 'ipr': return tag(await getAllIPR(), 'ipr');
        case 'journal': return tag(await getAllJournals(), 'journal');
        case 'conference': return tag(await getAllConference(), 'conference');
        case 'book': return tag(await getAllBooks(), 'book');
        case 'award':
        case 'awards': return tag(await getAllAwards(), 'award');
        case 'consultancy': return tag(await getAllConsultancyProjects(), 'consultancy');
        case 'phd_student': return tag(await getAllPhDStudents(), 'phd_student');
        case 'other': return tag(await getAllOtherEvents(), 'other');
        default: return fetchAllDomains();
    }
}

/** Fetch user-scoped records from a single domain */
async function fetchUserDomain(type: string, userRef: any): Promise<any[]> {
    const tag = (arr: any[], domain: string) => arr.map(r => ({ ...r, _domain: domain, type: domain }));
    switch (type) {
        case 'ipr': return tag(await getUserIPR(userRef), 'ipr');
        case 'journal': return tag(await getUserJournals(userRef), 'journal');
        case 'conference': return tag(await getUserConference(userRef), 'conference');
        case 'book': return tag(await getUserBooks(userRef), 'book');
        case 'award':
        case 'awards': return tag(await getUserAwards(userRef), 'award');
        case 'consultancy': return tag(await getUserConsultancyProjects(userRef), 'consultancy');
        case 'phd_student': return tag(await getUserPhDStudents(userRef), 'phd_student');
        case 'other': return tag(await getUserOtherEvents(userRef), 'other');
        default: return fetchAllDomains(userRef);
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────────────────────────────────────────

export const recordKeys = {
    all: ['records'] as const,
    domain: (type: string) => ['records', type] as const,
    allDomains: (uid?: string) => ['records', 'all-domains', uid] as const,
    dashboard: (uid?: string) => ['dashboard', 'stats', uid] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useAllRecords — fetch all records across domains (admin).
 * Uses useEffect+useState to fire immediately on mount (no 'enabled' guard).
 */
export const useAllRecords = (filters: { type?: string; approvalStatus?: string } = {}) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const raw = await (filters.type ? fetchDomain(filters.type) : fetchAllDomains());
            const filtered = filters.approvalStatus && filters.approvalStatus !== 'all'
                ? raw.filter(r => (r.approval_status || 'pending').toLowerCase() === (filters.approvalStatus ?? '').toLowerCase())
                : raw;
            setData(filtered);
        } catch (e: any) {
            setError(e);
        } finally { setIsLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.type, filters.approvalStatus]);

    useEffect(() => { fetch(); }, [fetch]);
    return { data, isLoading, error, refetch: fetch };
};

/**
 * usePendingRecords — fetch records by approval status (admin queue).
 * approvalStatus: 'pending' | 'rejected' | 'approved' | 'all'
 */
export const usePendingRecords = (type?: string, approvalStatus: string = 'pending') => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const raw = type ? await fetchDomain(type) : await fetchAllDomains();
            const filtered = approvalStatus === 'all'
                ? raw
                : raw.filter(r => (r.approval_status || 'pending').toLowerCase() === approvalStatus);
            setData(filtered);
        } catch (e: any) {
            setError(e);
        } finally { setIsLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, approvalStatus]);

    useEffect(() => { fetch(); }, [fetch]);
    return { data, isLoading, error, refetch: fetch };
};

/** Alias */
export const useRecordsByStatus = usePendingRecords;
export const usePendingApprovals = usePendingRecords;

/**
 * useAdminDomainRecords — fetch a single domain for admin.
 */
export const useAdminDomainRecords = (type: RecordType, filters: RecordFilters = {}) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async () => {
        if (!type) return;
        setIsLoading(true); setError(null);
        try {
            const raw = await fetchDomain(type);
            const filtered = (filters as any).approvalStatus && (filters as any).approvalStatus !== 'all'
                ? raw.filter(r => r.approval_status === (filters as any).approvalStatus)
                : raw;
            setData(filtered);
        } catch (e: any) {
            setError(e);
        } finally { setIsLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, JSON.stringify(filters)]);

    useEffect(() => { fetch(); }, [fetch]);
    return { data, isLoading, error, refetch: fetch };
};

// ─────────────────────────────────────────────────────────────────────────────
// USER HOOKS (React Query)
// ─────────────────────────────────────────────────────────────────────────────

/** useRecords — current user's records from a single domain. */
export const useRecords = (type: RecordType, filters: RecordFilters = {}) => {
    const userRef = useUserRef();
    const { user } = useAuth();
    return useQuery({
        queryKey: recordKeys.domain(type),
        queryFn: async () => {
            if (type === 'phd_student' && user?.user_role !== 'admin') return [];
            return fetchUserDomain(type, userRef);
        },
        enabled: !!userRef,
    });
};

/** useUserRecords — alias for single-domain user records (legacy). */
export const useUserRecords = (userId?: string, statusFilter?: string) => {
    const userRef = useUserRef();
    return useQuery({
        queryKey: recordKeys.domain('journal'),
        queryFn: async () => {
            const raw = await fetchUserDomain('journal', userRef);
            return statusFilter ? raw.filter(r => r.approval_status === statusFilter) : raw;
        },
        enabled: !!userRef,
    });
};

/** useAllUserRecords — current user's records across ALL domains. */
export const useAllUserRecords = (userId?: string, statusFilter?: string) => {
    const userRef = useUserRef();
    const { user } = useAuth();
    return useQuery({
        queryKey: recordKeys.allDomains(userRef?.path),
        queryFn: async () => {
            let raw = await fetchAllDomains(userRef);
            if (user?.user_role !== 'admin') {
                raw = raw.filter(r => r.type !== 'phd_student');
            }
            return statusFilter ? raw.filter(r => r.approval_status === statusFilter) : raw;
        },
        enabled: !!userRef,
    });
};

/** useApprovedRecords — approved records for a user (portfolio). */
export const useApprovedRecords = (userId?: string) => {
    const userRef = useUserRef();
    return useQuery({
        queryKey: [...recordKeys.allDomains(userRef?.path), 'approved'],
        queryFn: async () => {
            const raw = await fetchAllDomains(userRef);
            return raw.filter(r => r.approval_status === 'approved');
        },
        enabled: !!userRef,
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────

/** useUserLifetimeSubmissions — fetch all records for a specific user (admin view). */
export const useUserLifetimeSubmissions = (userId: string) => {
    return useQuery({
        queryKey: ['records', 'lifetime', userId],
        queryFn: async () => {
            const userRef = doc(db, 'users', userId);
            return fetchAllDomains(userRef);
        },
        enabled: !!userId,
    });
};

export const useUserStats = () => {
    const userRef = useUserRef();
    const { user } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: recordKeys.allDomains(userRef?.path),
        queryFn: async () => {
            let raw = await fetchAllDomains(userRef);
            if (user?.user_role !== 'admin') {
                raw = raw.filter(r => r.type !== 'phd_student');
            }
            return raw;
        },
        enabled: !!userRef,
    });
    const records: any[] = data ?? [];
    return {
        isLoading,
        stats: {
            totalRecords: records.length,
            iprCount: records.filter(r => r._domain === 'ipr').length,
            journalCount: records.filter(r => r._domain === 'journal').length,
            conferenceCount: records.filter(r => r._domain === 'conference').length,
            bookCount: records.filter(r => r._domain === 'book').length,
            consultancyCount: records.filter(r => r._domain === 'consultancy').length,
            awardCount: records.filter(r => r._domain === 'award').length,
            phdStudentCount: records.filter(r => r._domain === 'phd_student').length,
            otherEventCount: records.filter(r => r._domain === 'other').length,
        },
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

async function createByType(type: string, data: any): Promise<string> {
    const id = data.id || newId();
    switch (type) {
        case 'ipr': await createIPR(id, data); break;
        case 'journal': await createJournal(id, data); break;
        case 'conference': await createConference(id, data); break;
        case 'book': await createBook(id, data); break;
        case 'award':
        case 'awards': await createAward(id, data); break;
        case 'consultancy': await createConsultancyProject(id, data); break;
        case 'phd_student': await createPhDStudent(id, data); break;
        case 'other': await createOtherEvent(id, { ...data, approval_status: 'pending' }); break;
        default: throw new Error(`Unknown record type: ${type}`);
    }
    return id;
}

async function updateByType(type: string, id: string, data: any): Promise<string> {
    switch (type) {
        case 'ipr': await updateIPR(id, data); break;
        case 'journal': await updateJournal(id, data); break;
        case 'conference': await updateConference(id, data); break;
        case 'book': await updateBook(id, data); break;
        case 'award':
        case 'awards': await updateAward(id, data); break;
        case 'consultancy': await updateConsultancyProject(id, data); break;
        case 'phd_student': await updatePhDStudent(id, data); break;
        case 'other': await updateOtherEvent(id, { ...data, approval_status: 'pending' }); break;
        default: throw new Error(`Unknown record type: ${type}`);
    }
    return id;
}

async function deleteByType(type: string, id: string): Promise<void> {
    switch (type) {
        case 'ipr': return deleteIPR(id);
        case 'journal': return deleteJournal(id);
        case 'conference': return deleteConference(id);
        case 'book': return deleteBook(id);
        case 'award':
        case 'awards': return deleteAward(id);
        case 'consultancy': return deleteConsultancyProject(id);
        case 'phd_student': return deletePhDStudent(id);
        case 'other': return deleteOtherEvent(id);
        default: throw new Error(`Unknown record type: ${type}`);
    }
}

export const useSaveRecord = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();
    return useMutation({
        mutationFn: async ({ type, data, id }: { type: RecordType; data: any; id?: string }) => {
            if (!userRef) throw new Error('User not authenticated');

            const recordId = id || newId()
            const documentIds: string[] = []

            // 1. Handle File Uploads (Generic 'file' field)
            // It could be a single File or an Array of Files
            const fileData = data.file
            if (fileData) {
                const filesToUpload = Array.isArray(fileData) ? fileData : [fileData]
                for (const f of filesToUpload) {
                    if (f instanceof File) {
                        const uploadResult = await uploadFile(f, userRef.id, recordId)
                        const docId = newId()
                        await createDocument(docId, {
                            document_name: f.name,
                            document_type: type as any,
                            file_url: uploadResult.fileUrl,
                            status: 'pending',
                            uploaded_by: userRef,
                            upload_date: Timestamp.now() as any,
                        })
                        documentIds.push(docId)
                    }
                }
                delete data.file
            }

            // 2. Map document IDs to schema
            if (documentIds.length > 0) {
                data.document_id = documentIds[0] // Primary doc (backward compatibility)
                data.documents = documentIds // Full list
                // Standardize as 'sources' array of references for all domains
                data.sources = documentIds.map(dId => doc(db, 'documents', dId))
            }

            // 3. Inject Metadata
            if (!id) {
                data.user_id = userRef.id;
                data.created_by = userRef;
                data.is_active = true;
                data.approval_status = 'pending';

                // Domain specific ownership injection
                // This ensures non-admins can only see their own data
                if (['phd_student', 'ipr', 'journal', 'conference', 'book', 'award', 'consultancy', 'other'].includes(type)) {
                    // For PhD, we use faculty_ref as the owner
                    if (type === 'phd_student') data.faculty_ref = userRef
                    // For others, we might use user_id or specific refs if not already set
                    if (type === 'ipr') data.faculty_ref = userRef
                }
            } else {
                data.updated_by = userRef;
                data.approval_status = 'pending';
            }

            // 4. Flatten the 'data' sub-object if present (new UI convention)
            const finalData = { ...data };
            if (finalData.data && typeof finalData.data === 'object') {
                const subData = finalData.data;
                delete finalData.data;
                Object.assign(finalData, subData);
            }

            // 5. Reference Conversion (Generic)
            const SINGLE_REF_FIELDS = ['faculty_ref', 'recipient_ref', 'author', 'principal_investigator_ref'];
            const MULTI_REF_FIELDS = ['inventors', 'authors', 'co_investigators_refs', 'involved_faculty_refs'];

            SINGLE_REF_FIELDS.forEach(field => {
                if (finalData[field] && typeof finalData[field] === 'string') {
                    finalData[field] = doc(db, 'users', finalData[field]);
                }
            });

            MULTI_REF_FIELDS.forEach(field => {
                if (Array.isArray(finalData[field])) {
                    finalData[field] = finalData[field].map((uid: any) => 
                        typeof uid === 'string' ? doc(db, 'users', uid) : uid
                    );
                } else if (finalData[field] && typeof finalData[field] === 'string') {
                    // Handle single string ID passed for multiple field
                    finalData[field] = [doc(db, 'users', finalData[field])];
                }
            });

            // Special handling for IPR applicants (comma separated string -> array)
            if (type === 'ipr' && typeof finalData.applicants === 'string') {
                finalData.applicants = finalData.applicants.split(',').map((s: string) => s.trim()).filter(Boolean);
            }

            // 6. Create/Update the Record
            const resultId = id ? await updateByType(type, id, finalData) : await createByType(type, finalData);
            return resultId;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: recordKeys.all });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

export const useDeleteRecord = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ type, recordId }: { type: RecordType; recordId: string }) =>
            deleteByType(type, recordId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: recordKeys.all });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

export const useSetRecordStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ type, recordId, status }: {
            type: RecordType;
            recordId: string;
            status: 'approved' | 'rejected' | 'pending';
            rejectionReason?: string;
        }) => {
            const col = TYPE_TO_COL[type];
            if (!col) throw new Error(`Unknown record type: ${type}`);

            const recordRef = doc(db, col, recordId);
            const recordSnap = await getDoc(recordRef);
            const recordData = recordSnap.data();

            await updateDoc(recordRef, {
                approval_status: status,
                updated_at: serverTimestamp(),
            });

            // Update associated document if it exists
            if (recordData?.document_id) {
                const docRef = doc(db, 'documents', recordData.document_id);
                await updateDoc(docRef, {
                    status: status,
                    review_date: serverTimestamp(),
                });
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: recordKeys.all });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY WRAPPERS (keep existing view code unchanged)
// ─────────────────────────────────────────────────────────────────────────────

export const saveRecord = (type: RecordType, data: any, id?: string) =>
    id ? updateByType(type, id, { ...data, approval_status: 'pending' }) : createByType(type, { ...data, approval_status: 'pending' });

export const deleteRecord = (type: RecordType, id: string) => deleteByType(type, id);

export const useCreateRecord = () => {
    const save = useSaveRecord();
    return {
        ...save,
        mutateAsync: (data: any) => save.mutateAsync({ type: data.type as RecordType, data }),
        mutate: (data: any) => save.mutate({ type: data.type as RecordType, data }),
    };
};

export const useUpdateRecord = () => {
    const save = useSaveRecord();
    return {
        ...save,
        mutateAsync: ({ recordId, data }: { recordId: string; data: any }) =>
            save.mutateAsync({ type: data.type as RecordType, data, id: recordId }),
        mutate: ({ recordId, data }: { recordId: string; data: any }) =>
            save.mutate({ type: data.type as RecordType, data, id: recordId }),
    };
};

export const useApproveRecord = () => {
    const m = useSetRecordStatus();
    return {
        ...m,
        mutate: ({ type, recordId }: { type: RecordType; recordId: string }) =>
            m.mutate({ type, recordId, status: 'approved' }),
    };
};

export const useRejectRecord = () => {
    const m = useSetRecordStatus();
    return {
        ...m,
        mutate: ({ type, recordId, rejectionReason }: { type: RecordType; recordId: string; rejectionReason?: string }) =>
            m.mutate({ type, recordId, status: 'rejected', rejectionReason }),
    };
};

export const getDomainRecords = (type: RecordType | 'all', filters: any = {}) =>
    type === 'all' ? fetchAllDomains() : fetchDomain(type);

export const getAdminAllRecords = (filters: any = {}) =>
    filters.type ? fetchDomain(filters.type) : fetchAllDomains();

export const getPendingRecords = (filters: any = {}) =>
    fetchAllDomains().then(r => r.filter(x => x.approval_status === 'pending'));

export const adminSaveRecord = saveRecord;
export const adminDeleteRecord = deleteRecord;

export const getUserProfileWithData = async (uid?: string) => ({ uid, domains: {} });

export const getDashboardStats = async () => ({ totalRecords: 0, byDomain: {}, byStatus: {}, byYear: {} });
