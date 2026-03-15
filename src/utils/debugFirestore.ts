/**
 * DEBUG ONLY — import and call debugFirestoreRecords() from any component.
 * Remove this file before production.
 *
 * Usage in a component:
 *   import { debugFirestoreRecords } from '@/utils/debugFirestore'
 *   useEffect(() => { debugFirestoreRecords() }, [])
 */
import { db } from '@/configs/firebase.config';
import { collection, getDocs, limit, query } from 'firebase/firestore';

// Actual Firestore collection names used by the per-domain services
const COLLECTIONS = [
    'ipr',
    'journals',
    'conferences',
    'books',
    'awards',
    'consultancy_projects',
    'phd_students',
    'other_events',
];

export const debugFirestoreRecords = async () => {
    console.group('🔍 Firestore Debug — Record Collections');
    for (const col of COLLECTIONS) {
        try {
            const snap = await getDocs(query(collection(db, col), limit(3)));
            if (snap.empty) {
                console.log(`📁 ${col}: EMPTY (no documents)`);
            } else {
                console.log(`📁 ${col}: ${snap.size} doc(s) found — first doc fields:`);
                const first = snap.docs[0].data();
                console.log({
                    id: snap.docs[0].id,
                    approval_status: first.approval_status,
                    is_active: first.is_active,
                    title: first.title
                        || first.title_of_paper
                        || first.title_of_book
                        || first.award_name
                        || first.project_title
                        || first.topic_title
                        || first.name_of_student,
                    _allKeys: Object.keys(first),
                });
            }
        } catch (e: any) {
            console.error(`❌ ${col}: error — ${e.message}`);
        }
    }
    console.groupEnd();
};
