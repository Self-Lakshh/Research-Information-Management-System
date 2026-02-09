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
    orderBy,
    Timestamp,
    serverTimestamp,
    onSnapshot,
    QueryConstraint,
    limit,
    startAfter,
    DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/configs/firebase.config';
import {
    Record,
    RecordType,
    RecordStatus,
    CreateRecordData,
    UpdateRecordData,
    RecordFilters,
    PaginatedResponse,
} from '@/@types/rims.types';

const RECORDS_COLLECTION = 'records';

/**
 * Create a new record
 */
export const createRecord = async (
    userId: string,
    data: CreateRecordData
): Promise<string> => {
    try {
        const recordsRef = collection(db, RECORDS_COLLECTION);

        const recordData = {
            userId,
            type: data.type,
            status: 'pending' as RecordStatus,
            title: data.title,
            year: data.year,
            description: data.description || '',
            data: data.data,
            files: [], // Files will be added separately after upload
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(recordsRef, recordData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create record error:', error);
        throw new Error(error.message || 'Failed to create record');
    }
};

/**
 * Get record by ID
 */
export const getRecordById = async (recordId: string): Promise<Record | null> => {
    try {
        const recordRef = doc(db, RECORDS_COLLECTION, recordId);
        const recordSnap = await getDoc(recordRef);

        if (!recordSnap.exists()) {
            return null;
        }

        return { id: recordSnap.id, ...recordSnap.data() } as Record;
    } catch (error: any) {
        console.error('Get record error:', error);
        throw new Error(error.message || 'Failed to get record');
    }
};

/**
 * Get all records for a user
 */
export const getUserRecords = async (
    userId: string,
    statusFilter?: RecordStatus
): Promise<Record[]> => {
    try {
        const recordsRef = collection(db, RECORDS_COLLECTION);
        const constraints: QueryConstraint[] = [
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
        ];

        if (statusFilter) {
            constraints.push(where('status', '==', statusFilter));
        }

        const q = query(recordsRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Record[];
    } catch (error: any) {
        console.error('Get user records error:', error);
        throw new Error(error.message || 'Failed to get user records');
    }
};

/**
 * Get all records (Admin only) with filters
 */
export const getAllRecords = async (filters?: RecordFilters): Promise<Record[]> => {
    try {
        const recordsRef = collection(db, RECORDS_COLLECTION);
        const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

        if (filters?.type) {
            constraints.push(where('type', '==', filters.type));
        }

        if (filters?.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters?.year) {
            constraints.push(where('year', '==', filters.year));
        }

        if (filters?.userId) {
            constraints.push(where('userId', '==', filters.userId));
        }

        const q = query(recordsRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Record[];
    } catch (error: any) {
        console.error('Get all records error:', error);
        throw new Error(error.message || 'Failed to get records');
    }
};

/**
 * Get pending records (Admin only)
 */
export const getPendingRecords = async (): Promise<Record[]> => {
    return getAllRecords({ status: 'pending' });
};

/**
 * Get approved records for a user
 */
export const getApprovedUserRecords = async (userId: string): Promise<Record[]> => {
    return getUserRecords(userId, 'approved');
};

/**
 * Update record
 */
export const updateRecord = async (
    recordId: string,
    data: UpdateRecordData
): Promise<void> => {
    try {
        const recordRef = doc(db, RECORDS_COLLECTION, recordId);

        await updateDoc(recordRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Update record error:', error);
        throw new Error(error.message || 'Failed to update record');
    }
};

/**
 * Approve record (Admin only)
 */
export const approveRecord = async (recordId: string, adminId: string): Promise<void> => {
    try {
        const recordRef = doc(db, RECORDS_COLLECTION, recordId);

        await updateDoc(recordRef, {
            status: 'approved',
            approvedAt: serverTimestamp(),
            approvedBy: adminId,
            updatedAt: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve record error:', error);
        throw new Error(error.message || 'Failed to approve record');
    }
};

/**
 * Reject record (Admin only)
 */
export const rejectRecord = async (recordId: string, adminId: string): Promise<void> => {
    try {
        const recordRef = doc(db, RECORDS_COLLECTION, recordId);

        await updateDoc(recordRef, {
            status: 'rejected',
            rejectedAt: serverTimestamp(),
            rejectedBy: adminId,
            updatedAt: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Reject record error:', error);
        throw new Error(error.message || 'Failed to reject record');
    }
};

/**
 * Delete record
 */
export const deleteRecord = async (recordId: string): Promise<void> => {
    try {
        const recordRef = doc(db, RECORDS_COLLECTION, recordId);
        await deleteDoc(recordRef);
    } catch (error: any) {
        console.error('Delete record error:', error);
        throw new Error(error.message || 'Failed to delete record');
    }
};

/**
 * Update record files
 */
export const updateRecordFiles = async (
    recordId: string,
    files: { fileName: string; fileUrl: string; fileType: string }[]
): Promise<void> => {
    try {
        const recordRef = doc(db, RECORDS_COLLECTION, recordId);

        await updateDoc(recordRef, {
            files: files.map(file => ({
                ...file,
                uploadedAt: Timestamp.now(),
            })),
            updatedAt: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Update record files error:', error);
        throw new Error(error.message || 'Failed to update record files');
    }
};

/**
 * Get records by type
 */
export const getRecordsByType = async (
    type: RecordType,
    userId?: string
): Promise<Record[]> => {
    try {
        const recordsRef = collection(db, RECORDS_COLLECTION);
        const constraints: QueryConstraint[] = [
            where('type', '==', type),
            where('status', '==', 'approved'),
            orderBy('year', 'desc'),
        ];

        if (userId) {
            constraints.push(where('userId', '==', userId));
        }

        const q = query(recordsRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Record[];
    } catch (error: any) {
        console.error('Get records by type error:', error);
        throw new Error(error.message || 'Failed to get records by type');
    }
};

/**
 * Listen to records changes (real-time)
 */
export const subscribeToRecords = (
    filters: RecordFilters,
    callback: (records: Record[]) => void
): (() => void) => {
    try {
        const recordsRef = collection(db, RECORDS_COLLECTION);
        const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

        if (filters.type) {
            constraints.push(where('type', '==', filters.type));
        }

        if (filters.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters.userId) {
            constraints.push(where('userId', '==', filters.userId));
        }

        const q = query(recordsRef, ...constraints);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const records = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Record[];

            callback(records);
        });

        return unsubscribe;
    } catch (error: any) {
        console.error('Subscribe to records error:', error);
        throw new Error(error.message || 'Failed to subscribe to records');
    }
};

/**
 * Get records count by status
 */
export const getRecordsCountByStatus = async (
    userId?: string
): Promise<{ pending: number; approved: number; rejected: number }> => {
    try {
        const recordsRef = collection(db, RECORDS_COLLECTION);
        const constraints: QueryConstraint[] = [];

        if (userId) {
            constraints.push(where('userId', '==', userId));
        }

        const q = query(recordsRef, ...constraints);
        const querySnapshot = await getDocs(q);

        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0,
        };

        querySnapshot.docs.forEach(doc => {
            const status = doc.data().status as RecordStatus;
            counts[status]++;
        });

        return counts;
    } catch (error: any) {
        console.error('Get records count error:', error);
        throw new Error(error.message || 'Failed to get records count');
    }
};
