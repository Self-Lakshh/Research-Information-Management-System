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
    DocumentReference,
} from 'firebase/firestore';
import { db } from '@/configs/firebase.config';
import {
    IPR,
    Journal,
    Conference,
    Book,
    ConsultancyProject,
    Award,
    OtherEvent,
    PhDStudent,
    RecordType,
    ApprovalStatus,
    RecordFilters,
    CreateIPRData,
    CreateJournalData,
    CreateConferenceData,
    CreateBookData,
    CreateConsultancyData,
    CreateAwardData,
    CreateOtherEventData,
    CreatePhDStudentData,
} from '@/@types/rims.types';

// Collection names
const COLLECTIONS = {
    IPR: 'ipr',
    JOURNAL: 'journals',
    CONFERENCE: 'conferences',
    BOOK: 'books',
    CONSULTANCY: 'consultancy_projects',
    AWARD: 'awards',
    OTHER: 'other_events',
    PHD_STUDENT: 'phd_students',
    DOCUMENT: 'documents',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert user IDs to document references
 */
const createUserRef = (userId: string): DocumentReference => {
    return doc(db, 'users', userId);
};

/**
 * Convert document IDs to document references
 */
const createDocRef = (docId: string): DocumentReference => {
    return doc(db, COLLECTIONS.DOCUMENT, docId);
};

// ============================================
// IPR SERVICES
// ============================================

export const createIPR = async (userId: string, data: CreateIPRData): Promise<string> => {
    try {
        const iprRef = collection(db, COLLECTIONS.IPR);
        const userRef = createUserRef(userId);

        const iprData = {
            faculty_ref: userRef,
            application_no: data.application_no,
            title: data.title,
            inventors: data.inventors,
            applicants: data.applicants,
            country: data.country,
            published_date: data.published_date,
            patent_type: data.patent_type,
            status: data.status,
            sources: [], // Will be updated after file upload
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(iprRef, iprData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create IPR error:', error);
        throw new Error(error.message || 'Failed to create IPR');
    }
};

export const getIPRById = async (id: string): Promise<IPR | null> => {
    try {
        const iprRef = doc(db, COLLECTIONS.IPR, id);
        const iprSnap = await getDoc(iprRef);

        if (!iprSnap.exists()) return null;

        return { id: iprSnap.id, ...iprSnap.data() } as IPR;
    } catch (error: any) {
        console.error('Get IPR error:', error);
        throw new Error(error.message || 'Failed to get IPR');
    }
};

export const getUserIPRs = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<IPR[]> => {
    try {
        const iprRef = collection(db, COLLECTIONS.IPR);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('faculty_ref', '==', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(iprRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as IPR[];
    } catch (error: any) {
        console.error('Get user IPRs error:', error);
        throw new Error(error.message || 'Failed to get user IPRs');
    }
};

export const approveIPR = async (id: string, adminId: string): Promise<void> => {
    try {
        const iprRef = doc(db, COLLECTIONS.IPR, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(iprRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve IPR error:', error);
        throw new Error(error.message || 'Failed to approve IPR');
    }
};

export const rejectIPR = async (id: string, adminId: string): Promise<void> => {
    try {
        const iprRef = doc(db, COLLECTIONS.IPR, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(iprRef, {
            approval_status: 'rejected',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Reject IPR error:', error);
        throw new Error(error.message || 'Failed to reject IPR');
    }
};

export const deleteIPR = async (id: string): Promise<void> => {
    try {
        const iprRef = doc(db, COLLECTIONS.IPR, id);
        await deleteDoc(iprRef);
    } catch (error: any) {
        console.error('Delete IPR error:', error);
        throw new Error(error.message || 'Failed to delete IPR');
    }
};

// ============================================
// JOURNAL SERVICES
// ============================================

export const createJournal = async (
    userId: string,
    data: CreateJournalData
): Promise<string> => {
    try {
        const journalRef = collection(db, COLLECTIONS.JOURNAL);
        const userRef = createUserRef(userId);
        const authorRefs = data.author_ids.map((id) => createUserRef(id));

        const journalData = {
            title_of_paper: data.title_of_paper,
            authors: authorRefs,
            journal_name: data.journal_name,
            journal_type: data.journal_type,
            date_of_publication: data.date_of_publication,
            ISSN_number: data.ISSN_number,
            web_link: data.web_link,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(journalRef, journalData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create journal error:', error);
        throw new Error(error.message || 'Failed to create journal');
    }
};

export const getUserJournals = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<Journal[]> => {
    try {
        const journalRef = collection(db, COLLECTIONS.JOURNAL);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('authors', 'array-contains', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(journalRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Journal[];
    } catch (error: any) {
        console.error('Get user journals error:', error);
        throw new Error(error.message || 'Failed to get user journals');
    }
};

export const approveJournal = async (id: string, adminId: string): Promise<void> => {
    try {
        const journalRef = doc(db, COLLECTIONS.JOURNAL, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(journalRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve journal error:', error);
        throw new Error(error.message || 'Failed to approve journal');
    }
};

export const deleteJournal = async (id: string): Promise<void> => {
    try {
        const journalRef = doc(db, COLLECTIONS.JOURNAL, id);
        await deleteDoc(journalRef);
    } catch (error: any) {
        console.error('Delete journal error:', error);
        throw new Error(error.message || 'Failed to delete journal');
    }
};

// ============================================
// CONFERENCE SERVICES
// ============================================

export const createConference = async (
    userId: string,
    data: CreateConferenceData
): Promise<string> => {
    try {
        const conferenceRef = collection(db, COLLECTIONS.CONFERENCE);
        const userRef = createUserRef(userId);
        const authorRefs = data.author_ids.map((id) => createUserRef(id));

        const conferenceData = {
            authors: authorRefs,
            title_of_paper: data.title_of_paper,
            title_of_proceedings_of_conference: data.title_of_proceedings_of_conference,
            name_of_conference: data.name_of_conference,
            origin: data.origin,
            year_of_publication: data.year_of_publication,
            isbn_issn_number: data.isbn_issn_number,
            name_of_publisher: data.name_of_publisher,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(conferenceRef, conferenceData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create conference error:', error);
        throw new Error(error.message || 'Failed to create conference');
    }
};

export const getUserConferences = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<Conference[]> => {
    try {
        const conferenceRef = collection(db, COLLECTIONS.CONFERENCE);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('authors', 'array-contains', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(conferenceRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Conference[];
    } catch (error: any) {
        console.error('Get user conferences error:', error);
        throw new Error(error.message || 'Failed to get user conferences');
    }
};

export const approveConference = async (id: string, adminId: string): Promise<void> => {
    try {
        const conferenceRef = doc(db, COLLECTIONS.CONFERENCE, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(conferenceRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve conference error:', error);
        throw new Error(error.message || 'Failed to approve conference');
    }
};

export const deleteConference = async (id: string): Promise<void> => {
    try {
        const conferenceRef = doc(db, COLLECTIONS.CONFERENCE, id);
        await deleteDoc(conferenceRef);
    } catch (error: any) {
        console.error('Delete conference error:', error);
        throw new Error(error.message || 'Failed to delete conference');
    }
};

// ============================================
// BOOK SERVICES
// ============================================

export const createBook = async (userId: string, data: CreateBookData): Promise<string> => {
    try {
        const bookRef = collection(db, COLLECTIONS.BOOK);
        const userRef = createUserRef(userId);
        const authorRef = createUserRef(data.author_id);

        const bookData = {
            author: authorRef,
            title_of_book: data.title_of_book,
            date_of_publication: data.date_of_publication,
            ISBN_number: data.ISBN_number,
            publisher_name: data.publisher_name,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(bookRef, bookData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create book error:', error);
        throw new Error(error.message || 'Failed to create book');
    }
};

export const getUserBooks = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<Book[]> => {
    try {
        const bookRef = collection(db, COLLECTIONS.BOOK);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('author', '==', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(bookRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Book[];
    } catch (error: any) {
        console.error('Get user books error:', error);
        throw new Error(error.message || 'Failed to get user books');
    }
};

export const approveBook = async (id: string, adminId: string): Promise<void> => {
    try {
        const bookRef = doc(db, COLLECTIONS.BOOK, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(bookRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve book error:', error);
        throw new Error(error.message || 'Failed to approve book');
    }
};

export const deleteBook = async (id: string): Promise<void> => {
    try {
        const bookRef = doc(db, COLLECTIONS.BOOK, id);
        await deleteDoc(bookRef);
    } catch (error: any) {
        console.error('Delete book error:', error);
        throw new Error(error.message || 'Failed to delete book');
    }
};

// ============================================
// CONSULTANCY SERVICES
// ============================================

export const createConsultancy = async (
    userId: string,
    data: CreateConsultancyData
): Promise<string> => {
    try {
        const consultancyRef = collection(db, COLLECTIONS.CONSULTANCY);
        const userRef = createUserRef(userId);
        const piRef = createUserRef(data.principal_investigator_id);
        const coInvestigatorRefs = data.co_investigator_ids.map((id) => createUserRef(id));

        const consultancyData = {
            project_title: data.project_title,
            amount: data.amount,
            organization: data.organization,
            organization_url: data.organization_url,
            principal_investigator_ref: piRef,
            co_investigators_refs: coInvestigatorRefs,
            institution: data.institution,
            duration: data.duration,
            grant_date: data.grant_date,
            status: data.status,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(consultancyRef, consultancyData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create consultancy error:', error);
        throw new Error(error.message || 'Failed to create consultancy');
    }
};

export const getUserConsultancies = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<ConsultancyProject[]> => {
    try {
        const consultancyRef = collection(db, COLLECTIONS.CONSULTANCY);
        const userRef = createUserRef(userId);

        // Query for both PI and co-investigators
        const piQuery = query(
            consultancyRef,
            where('principal_investigator_ref', '==', userRef),
            orderBy('created_at', 'desc')
        );

        const coInvQuery = query(
            consultancyRef,
            where('co_investigators_refs', 'array-contains', userRef),
            orderBy('created_at', 'desc')
        );

        const [piSnapshot, coInvSnapshot] = await Promise.all([
            getDocs(piQuery),
            getDocs(coInvQuery),
        ]);

        const allDocs = new Map();

        piSnapshot.docs.forEach((doc) => {
            allDocs.set(doc.id, { id: doc.id, ...doc.data() });
        });

        coInvSnapshot.docs.forEach((doc) => {
            allDocs.set(doc.id, { id: doc.id, ...doc.data() });
        });

        let results = Array.from(allDocs.values()) as ConsultancyProject[];

        if (approvalStatus) {
            results = results.filter((item) => item.approval_status === approvalStatus);
        }

        return results;
    } catch (error: any) {
        console.error('Get user consultancies error:', error);
        throw new Error(error.message || 'Failed to get user consultancies');
    }
};

export const approveConsultancy = async (id: string, adminId: string): Promise<void> => {
    try {
        const consultancyRef = doc(db, COLLECTIONS.CONSULTANCY, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(consultancyRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve consultancy error:', error);
        throw new Error(error.message || 'Failed to approve consultancy');
    }
};

export const deleteConsultancy = async (id: string): Promise<void> => {
    try {
        const consultancyRef = doc(db, COLLECTIONS.CONSULTANCY, id);
        await deleteDoc(consultancyRef);
    } catch (error: any) {
        console.error('Delete consultancy error:', error);
        throw new Error(error.message || 'Failed to delete consultancy');
    }
};

// ============================================
// AWARD SERVICES
// ============================================

export const createAward = async (userId: string, data: CreateAwardData): Promise<string> => {
    try {
        const awardRef = collection(db, COLLECTIONS.AWARD);
        const userRef = createUserRef(userId);
        const recipientRef = createUserRef(data.recipient_id);

        const awardData = {
            award_name: data.award_name,
            title: data.title,
            recipient_ref: recipientRef,
            institution_body: data.institution_body,
            country: data.country,
            month_year: data.month_year,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(awardRef, awardData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create award error:', error);
        throw new Error(error.message || 'Failed to create award');
    }
};

export const getUserAwards = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<Award[]> => {
    try {
        const awardRef = collection(db, COLLECTIONS.AWARD);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('recipient_ref', '==', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(awardRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Award[];
    } catch (error: any) {
        console.error('Get user awards error:', error);
        throw new Error(error.message || 'Failed to get user awards');
    }
};

export const approveAward = async (id: string, adminId: string): Promise<void> => {
    try {
        const awardRef = doc(db, COLLECTIONS.AWARD, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(awardRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve award error:', error);
        throw new Error(error.message || 'Failed to approve award');
    }
};

export const deleteAward = async (id: string): Promise<void> => {
    try {
        const awardRef = doc(db, COLLECTIONS.AWARD, id);
        await deleteDoc(awardRef);
    } catch (error: any) {
        console.error('Delete award error:', error);
        throw new Error(error.message || 'Failed to delete award');
    }
};

// ============================================
// OTHER EVENT SERVICES (Workshops, Seminars, FDP, Keynotes)
// ============================================

export const createOtherEvent = async (
    userId: string,
    data: CreateOtherEventData
): Promise<string> => {
    try {
        const otherRef = collection(db, COLLECTIONS.OTHER);
        const userRef = createUserRef(userId);
        const facultyRefs = data.involved_faculty_ids.map((id) => createUserRef(id));

        const otherData = {
            type: data.type,
            topic_title: data.topic_title,
            organization: data.organization,
            date: data.date,
            role: data.role,
            involved_faculty_refs: facultyRefs,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(otherRef, otherData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create other event error:', error);
        throw new Error(error.message || 'Failed to create other event');
    }
};

export const getUserOtherEvents = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<OtherEvent[]> => {
    try {
        const otherRef = collection(db, COLLECTIONS.OTHER);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('involved_faculty_refs', 'array-contains', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(otherRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as OtherEvent[];
    } catch (error: any) {
        console.error('Get user other events error:', error);
        throw new Error(error.message || 'Failed to get user other events');
    }
};

export const approveOtherEvent = async (id: string, adminId: string): Promise<void> => {
    try {
        const otherRef = doc(db, COLLECTIONS.OTHER, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(otherRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve other event error:', error);
        throw new Error(error.message || 'Failed to approve other event');
    }
};

export const deleteOtherEvent = async (id: string): Promise<void> => {
    try {
        const otherRef = doc(db, COLLECTIONS.OTHER, id);
        await deleteDoc(otherRef);
    } catch (error: any) {
        console.error('Delete other event error:', error);
        throw new Error(error.message || 'Failed to delete other event');
    }
};

// ============================================
// PHD STUDENT SERVICES
// ============================================

export const createPhDStudent = async (
    userId: string,
    data: CreatePhDStudentData
): Promise<string> => {
    try {
        const phdRef = collection(db, COLLECTIONS.PHD_STUDENT);
        const userRef = createUserRef(userId);

        const phdData = {
            name: data.name,
            faculty_ref: userRef,
            supervisor_type: data.supervisor_type,
            name_of_student: data.name_of_student,
            enrollment_number: data.enrollment_number,
            phd_stream: data.phd_stream,
            sources: [],
            approval_status: 'pending' as ApprovalStatus,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: userRef,
        };

        const docRef = await addDoc(phdRef, phdData);
        return docRef.id;
    } catch (error: any) {
        console.error('Create PhD student error:', error);
        throw new Error(error.message || 'Failed to create PhD student');
    }
};

export const getUserPhDStudents = async (
    userId: string,
    approvalStatus?: ApprovalStatus
): Promise<PhDStudent[]> => {
    try {
        const phdRef = collection(db, COLLECTIONS.PHD_STUDENT);
        const userRef = createUserRef(userId);
        const constraints: QueryConstraint[] = [
            where('faculty_ref', '==', userRef),
            orderBy('created_at', 'desc'),
        ];

        if (approvalStatus) {
            constraints.push(where('approval_status', '==', approvalStatus));
        }

        const q = query(phdRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PhDStudent[];
    } catch (error: any) {
        console.error('Get user PhD students error:', error);
        throw new Error(error.message || 'Failed to get user PhD students');
    }
};

export const approvePhDStudent = async (id: string, adminId: string): Promise<void> => {
    try {
        const phdRef = doc(db, COLLECTIONS.PHD_STUDENT, id);
        const adminRef = createUserRef(adminId);

        await updateDoc(phdRef, {
            approval_status: 'approved',
            approval_action_by: adminRef,
            action_at: serverTimestamp(),
            updated_at: serverTimestamp(),
        });
    } catch (error: any) {
        console.error('Approve PhD student error:', error);
        throw new Error(error.message || 'Failed to approve PhD student');
    }
};

export const deletePhDStudent = async (id: string): Promise<void> => {
    try {
        const phdRef = doc(db, COLLECTIONS.PHD_STUDENT, id);
        await deleteDoc(phdRef);
    } catch (error: any) {
        console.error('Delete PhD student error:', error);
        throw new Error(error.message || 'Failed to delete PhD student');
    }
};

// ============================================
// GENERIC FUNCTIONS FOR ALL RECORDS
// ============================================

/**
 * Get all pending records across all collections (Admin only)
 */
export const getAllPendingRecords = async (): Promise<any[]> => {
    try {
        const collections = [
            COLLECTIONS.IPR,
            COLLECTIONS.JOURNAL,
            COLLECTIONS.CONFERENCE,
            COLLECTIONS.BOOK,
            COLLECTIONS.CONSULTANCY,
            COLLECTIONS.AWARD,
            COLLECTIONS.OTHER,
            COLLECTIONS.PHD_STUDENT,
        ];

        const promises = collections.map(async (collectionName) => {
            const collRef = collection(db, collectionName);
            const q = query(
                collRef,
                where('approval_status', '==', 'pending'),
                orderBy('created_at', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                collection: collectionName,
                ...doc.data(),
            }));
        });

        const results = await Promise.all(promises);
        return results.flat();
    } catch (error: any) {
        console.error('Get all pending records error:', error);
        throw new Error(error.message || 'Failed to get pending records');
    }
};

/**
 * Get all approved records for a user
 */
export const getAllApprovedUserRecords = async (userId: string): Promise<any[]> => {
    try {
        const [iprs, journals, conferences, books, consultancies, awards, others, phdStudents] =
            await Promise.all([
                getUserIPRs(userId, 'approved'),
                getUserJournals(userId, 'approved'),
                getUserConferences(userId, 'approved'),
                getUserBooks(userId, 'approved'),
                getUserConsultancies(userId, 'approved'),
                getUserAwards(userId, 'approved'),
                getUserOtherEvents(userId, 'approved'),
                getUserPhDStudents(userId, 'approved'),
            ]);

        return [
            ...iprs.map((item) => ({ ...item, type: 'ipr' })),
            ...journals.map((item) => ({ ...item, type: 'journal' })),
            ...conferences.map((item) => ({ ...item, type: 'conference' })),
            ...books.map((item) => ({ ...item, type: 'book' })),
            ...consultancies.map((item) => ({ ...item, type: 'consultancy' })),
            ...awards.map((item) => ({ ...item, type: 'award' })),
            ...others.map((item) => ({ ...item, type: 'other' })),
            ...phdStudents.map((item) => ({ ...item, type: 'phd_student' })),
        ];
    } catch (error: any) {
        console.error('Get all approved user records error:', error);
        throw new Error(error.message || 'Failed to get approved user records');
    }
};
