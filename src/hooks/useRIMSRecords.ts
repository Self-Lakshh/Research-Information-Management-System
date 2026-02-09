import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    // IPR
    createIPR,
    getUserIPRs,
    approveIPR,
    rejectIPR,
    deleteIPR,
    // Journal
    createJournal,
    getUserJournals,
    approveJournal,
    deleteJournal,
    // Conference
    createConference,
    getUserConferences,
    approveConference,
    deleteConference,
    // Book
    createBook,
    getUserBooks,
    approveBook,
    deleteBook,
    // Consultancy
    createConsultancy,
    getUserConsultancies,
    approveConsultancy,
    deleteConsultancy,
    // Award
    createAward,
    getUserAwards,
    approveAward,
    deleteAward,
    // Other Events
    createOtherEvent,
    getUserOtherEvents,
    approveOtherEvent,
    deleteOtherEvent,
    // PhD Student
    createPhDStudent,
    getUserPhDStudents,
    approvePhDStudent,
    deletePhDStudent,
    // Generic
    getAllPendingRecords,
    getAllApprovedUserRecords,
} from '@/services/firebase/records.service';
import {
    ApprovalStatus,
    CreateIPRData,
    CreateJournalData,
    CreateConferenceData,
    CreateBookData,
    CreateConsultancyData,
    CreateAwardData,
    CreateOtherEventData,
    CreatePhDStudentData,
} from '@/@types/rims.types';
import { uploadMultipleFiles } from '@/services/firebase';
import { useAuth } from '@/auth';

// ============================================
// IPR HOOKS
// ============================================

export const useUserIPRs = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['iprs', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserIPRs(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateIPR = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateIPRData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createIPR(user.uid, data);

            // Upload files if provided
            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['iprs'] });
        },
    });
};

export const useApproveIPR = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveIPR(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['iprs'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useRejectIPR = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return rejectIPR(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['iprs'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteIPR = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteIPR,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['iprs'] });
        },
    });
};

// ============================================
// JOURNAL HOOKS
// ============================================

export const useUserJournals = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['journals', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserJournals(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateJournal = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateJournalData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createJournal(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journals'] });
        },
    });
};

export const useApproveJournal = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveJournal(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journals'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteJournal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteJournal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journals'] });
        },
    });
};

// ============================================
// CONFERENCE HOOKS
// ============================================

export const useUserConferences = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['conferences', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserConferences(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateConference = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateConferenceData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createConference(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conferences'] });
        },
    });
};

export const useApproveConference = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveConference(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conferences'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteConference = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteConference,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conferences'] });
        },
    });
};

// ============================================
// BOOK HOOKS
// ============================================

export const useUserBooks = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['books', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserBooks(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateBook = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateBookData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createBook(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

export const useApproveBook = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveBook(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

// ============================================
// CONSULTANCY HOOKS
// ============================================

export const useUserConsultancies = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['consultancies', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserConsultancies(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateConsultancy = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateConsultancyData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createConsultancy(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultancies'] });
        },
    });
};

export const useApproveConsultancy = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveConsultancy(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultancies'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteConsultancy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteConsultancy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultancies'] });
        },
    });
};

// ============================================
// AWARD HOOKS
// ============================================

export const useUserAwards = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['awards', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserAwards(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateAward = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateAwardData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createAward(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['awards'] });
        },
    });
};

export const useApproveAward = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveAward(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['awards'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteAward = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAward,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['awards'] });
        },
    });
};

// ============================================
// OTHER EVENT HOOKS
// ============================================

export const useUserOtherEvents = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['otherEvents', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserOtherEvents(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreateOtherEvent = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreateOtherEventData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createOtherEvent(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['otherEvents'] });
        },
    });
};

export const useApproveOtherEvent = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approveOtherEvent(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['otherEvents'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeleteOtherEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteOtherEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['otherEvents'] });
        },
    });
};

// ============================================
// PHD STUDENT HOOKS
// ============================================

export const useUserPhDStudents = (userId?: string, approvalStatus?: ApprovalStatus) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['phdStudents', targetUserId, approvalStatus],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getUserPhDStudents(targetUserId, approvalStatus);
        },
        enabled: !!targetUserId,
    });
};

export const useCreatePhDStudent = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (data: CreatePhDStudentData & { files?: File[] }) => {
            if (!user?.uid) throw new Error('User not authenticated');

            const recordId = await createPhDStudent(user.uid, data);

            if (data.files && data.files.length > 0) {
                await uploadMultipleFiles(data.files, user.uid, recordId);
            }

            return recordId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['phdStudents'] });
        },
    });
};

export const useApprovePhDStudent = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (recordId: string) => {
            if (!user?.uid) throw new Error('Admin not authenticated');
            return approvePhDStudent(recordId, user.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['phdStudents'] });
            queryClient.invalidateQueries({ queryKey: ['pending'] });
        },
    });
};

export const useDeletePhDStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePhDStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['phdStudents'] });
        },
    });
};

// ============================================
// GENERIC HOOKS
// ============================================

/**
 * Get all pending records (Admin only)
 */
export const usePendingRecords = () => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['pending', 'all'],
        queryFn: getAllPendingRecords,
        enabled: isAdmin,
    });
};

/**
 * Get all approved records for a user
 */
export const useApprovedUserRecords = (userId?: string) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.uid;

    return useQuery({
        queryKey: ['approved', 'all', targetUserId],
        queryFn: () => {
            if (!targetUserId) throw new Error('User ID is required');
            return getAllApprovedUserRecords(targetUserId);
        },
        enabled: !!targetUserId,
    });
};

/**
 * Calculate user statistics from approved records
 */
export const useUserStats = (userId?: string) => {
    const { data: records, isLoading } = useApprovedUserRecords(userId);

    const stats = {
        totalRecords: records?.length || 0,
        iprCount: records?.filter((r) => r.type === 'ipr').length || 0,
        journalCount: records?.filter((r) => r.type === 'journal').length || 0,
        conferenceCount: records?.filter((r) => r.type === 'conference').length || 0,
        bookCount: records?.filter((r) => r.type === 'book').length || 0,
        consultancyCount: records?.filter((r) => r.type === 'consultancy').length || 0,
        awardCount: records?.filter((r) => r.type === 'award').length || 0,
        phdStudentCount: records?.filter((r) => r.type === 'phd_student').length || 0,
        otherEventCount: records?.filter((r) => r.type === 'other').length || 0,
    };

    return { stats, isLoading };
};
