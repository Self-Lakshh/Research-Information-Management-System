import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll,
    UploadResult,
} from 'firebase/storage';
import { storage } from '@/configs/firebase.config';

/**
 * Upload a file to Firebase Storage
 * Path structure: /users/{userId}/records/{recordId}/{fileName}
 */
export const uploadFile = async (
    file: File,
    userId: string,
    recordId: string
): Promise<{ fileName: string; fileUrl: string; fileType: string }> => {
    try {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `users/${userId}/records/${recordId}/${fileName}`;
        const storageRef = ref(storage, filePath);

        // Upload file
        const uploadResult: UploadResult = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(uploadResult.ref);

        return {
            fileName: file.name,
            fileUrl: downloadURL,
            fileType: file.type,
        };
    } catch (error: any) {
        console.error('Upload file error:', error);
        throw new Error(error.message || 'Failed to upload file');
    }
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (
    files: File[],
    userId: string,
    recordId: string
): Promise<{ fileName: string; fileUrl: string; fileType: string }[]> => {
    try {
        const uploadPromises = files.map(file => uploadFile(file, userId, recordId));
        return await Promise.all(uploadPromises);
    } catch (error: any) {
        console.error('Upload multiple files error:', error);
        throw new Error(error.message || 'Failed to upload files');
    }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
    try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
    } catch (error: any) {
        console.error('Delete file error:', error);
        throw new Error(error.message || 'Failed to delete file');
    }
};

/**
 * Delete all files for a record
 */
export const deleteRecordFiles = async (
    userId: string,
    recordId: string
): Promise<void> => {
    try {
        const folderPath = `users/${userId}/records/${recordId}`;
        const folderRef = ref(storage, folderPath);

        // List all files in the folder
        const fileList = await listAll(folderRef);

        // Delete each file
        const deletePromises = fileList.items.map(item => deleteObject(item));
        await Promise.all(deletePromises);
    } catch (error: any) {
        console.error('Delete record files error:', error);
        throw new Error(error.message || 'Failed to delete record files');
    }
};

/**
 * Delete all files for a user
 */
export const deleteUserFiles = async (userId: string): Promise<void> => {
    try {
        const folderPath = `users/${userId}`;
        const folderRef = ref(storage, folderPath);

        // List all files in the folder
        const fileList = await listAll(folderRef);

        // Delete each file
        const deletePromises = fileList.items.map(item => deleteObject(item));
        await Promise.all(deletePromises);

        // Delete subfolders
        const subfolderPromises = fileList.prefixes.map(async (prefix) => {
            const subfolderList = await listAll(prefix);
            const subfolderDeletePromises = subfolderList.items.map(item => deleteObject(item));
            await Promise.all(subfolderDeletePromises);
        });

        await Promise.all(subfolderPromises);
    } catch (error: any) {
        console.error('Delete user files error:', error);
        throw new Error(error.message || 'Failed to delete user files');
    }
};

/**
 * Upload user profile photo
 * Path structure: /users/{userId}/profile/{fileName}
 */
export const uploadProfilePhoto = async (
    file: File,
    userId: string
): Promise<string> => {
    try {
        const fileName = `profile_${Date.now()}.${file.name.split('.').pop()}`;
        const filePath = `users/${userId}/profile/${fileName}`;
        const storageRef = ref(storage, filePath);

        // Upload file
        const uploadResult = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadURL = await getDownloadURL(uploadResult.ref);

        return downloadURL;
    } catch (error: any) {
        console.error('Upload profile photo error:', error);
        throw new Error(error.message || 'Failed to upload profile photo');
    }
};

/**
 * Get file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return file.type.startsWith(category + '/');
        }
        return file.type === type;
    });
};

/**
 * Validate file size (in MB)
 */
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};
