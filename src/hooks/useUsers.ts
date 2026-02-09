import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllUsers,
    getUsersByRole,
    getActiveUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    searchUsers,
} from '@/services/firebase';
import { createUserWithResetLink } from '@/services/firebase';
import { CreateUserData, UpdateUserData } from '@/@types/rims.types';
import { useAuth } from '@/auth';

/**
 * Get all users (Admin only)
 */
export const useAllUsers = () => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['users', 'all'],
        queryFn: getAllUsers,
        enabled: isAdmin,
    });
};

/**
 * Get users by role
 */
export const useUsersByRole = (role: 'user' | 'admin') => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['users', 'role', role],
        queryFn: () => getUsersByRole(role),
        enabled: isAdmin,
    });
};

/**
 * Get active users only
 */
export const useActiveUsers = () => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['users', 'active'],
        queryFn: getActiveUsers,
        enabled: isAdmin,
    });
};

/**
 * Get user by ID
 */
export const useUserById = (userId: string) => {
    return useQuery({
        queryKey: ['users', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

/**
 * Search users
 */
export const useSearchUsers = (searchTerm: string) => {
    const { user } = useAuth();
    const isAdmin = user?.user_role === 'admin';

    return useQuery({
        queryKey: ['users', 'search', searchTerm],
        queryFn: () => searchUsers(searchTerm),
        enabled: isAdmin && searchTerm.length > 0,
    });
};

/**
 * Create user (Admin only)
 * Creates Firebase Auth account and Firestore user document
 * Automatically sends password reset link to user
 */
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateUserData) => {
            // Create Firebase Auth account and send password reset link
            // @ts-ignore
            const { user: firebaseUser } = await createUserWithResetLink(data.email, data.name);

            // Create Firestore user document
            await createUser(firebaseUser.uid, data);

            return firebaseUser;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

/**
 * Update user
 */
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
            updateUser(userId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
        },
    });
};

/**
 * Delete user (Admin only)
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

/**
 * Activate user
 */
export const useActivateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: activateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

/**
 * Deactivate user
 */
export const useDeactivateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deactivateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
