import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUserRecords,
    getApprovedUserRecords,
    getAllRecords,
    getPendingRecords,
    getRecordById,
    getRecordsByType,
    createRecord,
    updateRecord,
    approveRecord,
    rejectRecord,
    deleteRecord,
    updateRecordFiles,
} from '@/services/firebase';
import {
    Record,
    RecordType,
    RecordFilters,
    CreateRecordData,
} from '@/@types/rims.types';
import { uploadMultipleFiles } from '@/services/firebase';
import { useAuth } from '@/auth';

/**
 * Hook to fetch user's records
 */
export const useUserRecords = (userId?: string, statusFilter?: 'pending' | 'approved' | 'rejected') => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['records', 'user', targetUserId, statusFilter],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserRecords(targetUserId, statusFilter);
        },
        enabled: !!targetUserId,
    });
};

/**
 * Hook to fetch user's approved records only
 */
export const useApprovedRecords = (userId?: string) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['records', 'approved', targetUserId],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getApprovedUserRecords(targetUserId);
        },
        enabled: !!targetUserId,
    });
};

/**
 * Hook to fetch all records (Admin only)
 */
export const useAllRecords = (filters?: RecordFilters) => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['records', 'all', filters],
        queryFn: () => getAllRecords(filters),
        enabled: isAdmin,
    });
};

/**
 * Hook to fetch pending records (Admin only)
 */
export const usePendingRecords = () => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['records', 'pending'],
        queryFn: getPendingRecords,
        enabled: isAdmin,
    });
};

/**
 * Hook to fetch a single record
 */
export const useRecord = (recordId: string) => {
    return useQuery({
        queryKey: ['records', recordId],
        queryFn: () => getRecordById(recordId),
        enabled: !!recordId,
    });
};

/**
 * Hook to fetch records by type
 */
export const useRecordsByType = (type: RecordType, userId?: string) => {
    return useQuery({
        queryKey: ['records', 'type', type, userId],
        queryFn: () => getRecordsByType(type, userId),
        enabled: !!type,
    });
};

/**
 * Hook to create a new record
 */
export const useCreateRecord = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateRecordData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            // Create record
            const recordId = await createRecord(user.uid, data);

            // Upload files if provided
            if (data.files && data.files.length > 0) {
                const uploadedFiles = await uploadMultipleFiles(data.files, user.uid, recordId);
                await updateRecordFiles(recordId, uploadedFiles);
            }

            return recordId;
        },
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
};

/**
 * Hook to update a record
 */
export const useUpdateRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recordId, data }: { recordId: string; data: Partial<CreateRecordData> }) =>
            updateRecord(recordId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
};

/**
 * Hook to approve a record (Admin only)
 */
export const useApproveRecord = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveRecord(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
};

/**
 * Hook to reject a record (Admin only)
 */
export const useRejectRecord = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return rejectRecord(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
};

/**
 * Hook to delete a record
 */
export const useDeleteRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
};

/**
 * Hook to update record files
 */
export const useUpdateRecordFiles = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            recordId,
            files,
        }: {
            recordId: string;
            files: File[];
        }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const uploadedFiles = await uploadMultipleFiles(files, user.uid, recordId);
            await updateRecordFiles(recordId, uploadedFiles);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['records'] });
        },
    });
};
