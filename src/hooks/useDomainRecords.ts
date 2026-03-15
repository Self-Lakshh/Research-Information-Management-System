/**
 * useDomainRecords.ts
 * ───────────────────
 * Per-domain React Query hooks. Each hook (useIPR, useJournals, …) calls
 * its own dedicated service file directly — no generic record.service layer.
 *
 * Every hook exposes:
 *   • allQuery       — useQuery: all records (admin)
 *   • userQuery      — useQuery: current user's records (user-scoped)
 *   • create         — useMutation
 *   • update         — useMutation
 *   • remove         — useMutation (soft delete)
 *
 * The user's Firestore DocumentReference is derived from their uid via
 * doc(db, 'users', uid) — matching how it is stored on every record.
 */

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { doc } from 'firebase/firestore';
import { db } from '@/configs/firebase.config';
import { useAuth } from '@/auth';


// ── Domain services ───────────────────────────────────────────────────────────
import {
    getAllIPR, getIPRById, getUserIPR,
    createIPR, updateIPR, deleteIPR,
} from '@/services/firebase/ipr/ipr.services';

import {
    getAllJournals, getJournalById, getUserJournals,
    createJournal, updateJournal, deleteJournal,
} from '@/services/firebase/journal/journals.services';

import {
    getAllConference, getConferenceById, getUserConference,
    createConference, updateConference, deleteConference,
} from '@/services/firebase/conference/conference.services';

import {
    getAllBooks, getBookById, getUserBooks,
    createBook, updateBook, deleteBook,
} from '@/services/firebase/book/books.services';

import {
    getAllAwards, getAwardById, getUserAwards,
    createAward, updateAward, deleteAward,
} from '@/services/firebase/awards/awards.services';

import {
    getAllConsultancyProjects, getConsultancyProjectById, getUserConsultancyProjects,
    createConsultancyProject, updateConsultancyProject, deleteConsultancyProject,
} from '@/services/firebase/consultancy/consultancy.services';

import {
    getAllPhDStudents, getPhDStudentById, getUserPhDStudents,
    createPhDStudent, updatePhDStudent, deletePhDStudent,
} from '@/services/firebase/phd_student/phd.services';

import {
    getAllOtherEvents, getOtherEventById, getUserOtherEvents,
    createOtherEvent, updateOtherEvent, deleteOtherEvent,
} from '@/services/firebase/others/other.services';

// ── Types ─────────────────────────────────────────────────────────────────────
import type { IPR } from '@/services/firebase/ipr/types';
import type { Journal } from '@/services/firebase/journal/types';
import type { Conference } from '@/services/firebase/conference/types';
import type { Book } from '@/services/firebase/book/types';
import type { Award } from '@/services/firebase/awards/types';
import type { ConsultancyProject } from '@/services/firebase/consultancy/types';
import type { PhDStudent } from '@/services/firebase/phd_student/types';
import type { OtherEvent } from '@/services/firebase/others/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Safely get uid from auth store */
const getUid = (user: any): string | undefined => user?.id || user?.uid || user?.userId;

/** Build a Firestore DocumentReference for the current user */
const useUserRef = () => {
    const { user } = useAuth();
    const uid = getUid(user);
    return uid ? doc(db, 'users', uid) : null;
};

import { newId } from '@/utils/id';

// ─────────────────────────────────────────────────────────────────────────────
// useIPR
// ─────────────────────────────────────────────────────────────────────────────

export const useIPR = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['ipr', 'all'],
        queryFn: getAllIPR,
    });

    const userQuery = useQuery({
        queryKey: ['ipr', 'user', userRef?.path],
        queryFn: () => getUserIPR(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<IPR, 'id' | 'created_at' | 'updated_at'>) =>
            createIPR(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ipr'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IPR> }) =>
            updateIPR(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ipr'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteIPR(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ipr'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['ipr', id],
            queryFn: () => getIPRById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// useJournals
// ─────────────────────────────────────────────────────────────────────────────

export const useJournals = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['journals', 'all'],
        queryFn: getAllJournals,
    });

    const userQuery = useQuery({
        queryKey: ['journals', 'user', userRef?.path],
        queryFn: () => getUserJournals(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<Journal, 'id' | 'created_at' | 'updated_at'>) =>
            createJournal(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Journal> }) =>
            updateJournal(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteJournal(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['journals', id],
            queryFn: () => getJournalById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// useConferences
// ─────────────────────────────────────────────────────────────────────────────

export const useConferences = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['conferences', 'all'],
        queryFn: getAllConference,
    });

    const userQuery = useQuery({
        queryKey: ['conferences', 'user', userRef?.path],
        queryFn: () => getUserConference(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<Conference, 'id' | 'created_at' | 'updated_at'>) =>
            createConference(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['conferences'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Conference> }) =>
            updateConference(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['conferences'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteConference(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['conferences'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['conferences', id],
            queryFn: () => getConferenceById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// useBooks
// ─────────────────────────────────────────────────────────────────────────────

export const useBooks = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['books', 'all'],
        queryFn: getAllBooks,
    });

    const userQuery = useQuery({
        queryKey: ['books', 'user', userRef?.path],
        queryFn: () => getUserBooks(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<Book, 'id' | 'created_at' | 'updated_at'>) =>
            createBook(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) =>
            updateBook(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteBook(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['books', id],
            queryFn: () => getBookById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// useAwards
// ─────────────────────────────────────────────────────────────────────────────

export const useAwards = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['awards', 'all'],
        queryFn: getAllAwards,
    });

    const userQuery = useQuery({
        queryKey: ['awards', 'user', userRef?.path],
        queryFn: () => getUserAwards(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<Award, 'id' | 'created_at' | 'updated_at'>) =>
            createAward(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['awards'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Award> }) =>
            updateAward(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['awards'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteAward(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['awards'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['awards', id],
            queryFn: () => getAwardById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// useConsultancy
// ─────────────────────────────────────────────────────────────────────────────

export const useConsultancy = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['consultancy', 'all'],
        queryFn: getAllConsultancyProjects,
    });

    const userQuery = useQuery({
        queryKey: ['consultancy', 'user', userRef?.path],
        queryFn: () => getUserConsultancyProjects(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<ConsultancyProject, 'id' | 'created_at' | 'updated_at'>) =>
            createConsultancyProject(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['consultancy'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ConsultancyProject> }) =>
            updateConsultancyProject(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['consultancy'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteConsultancyProject(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['consultancy'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['consultancy', id],
            queryFn: () => getConsultancyProjectById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// usePhDStudents
// ─────────────────────────────────────────────────────────────────────────────

export const usePhDStudents = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['phd_students', 'all'],
        queryFn: getAllPhDStudents,
    });

    const userQuery = useQuery({
        queryKey: ['phd_students', 'user', userRef?.path],
        queryFn: () => getUserPhDStudents(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<PhDStudent, 'id' | 'created_at' | 'updated_at'>) =>
            createPhDStudent(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['phd_students'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<PhDStudent> }) =>
            updatePhDStudent(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['phd_students'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deletePhDStudent(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['phd_students'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['phd_students', id],
            queryFn: () => getPhDStudentById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};

// ─────────────────────────────────────────────────────────────────────────────
// useOtherEvents
// ─────────────────────────────────────────────────────────────────────────────

export const useOtherEvents = () => {
    const qc = useQueryClient();
    const userRef = useUserRef();

    const allQuery = useQuery({
        queryKey: ['other_events', 'all'],
        queryFn: getAllOtherEvents,
    });

    const userQuery = useQuery({
        queryKey: ['other_events', 'user', userRef?.path],
        queryFn: () => getUserOtherEvents(userRef!),
        enabled: !!userRef,
    });

    const create = useMutation({
        mutationFn: (data: Omit<OtherEvent, 'id' | 'created_at' | 'updated_at'>) =>
            createOtherEvent(newId(), data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['other_events'] }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<OtherEvent> }) =>
            updateOtherEvent(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['other_events'] }),
    });

    const remove = useMutation({
        mutationFn: (id: string) => deleteOtherEvent(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['other_events'] }),
    });

    const getById = (id: string) =>
        useQuery({
            queryKey: ['other_events', id],
            queryFn: () => getOtherEventById(id),
            enabled: !!id,
        });

    return { allQuery, userQuery, create, update, remove, getById };
};
