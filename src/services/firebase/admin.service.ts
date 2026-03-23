/**
 * admin.service.ts
 * ─────────────────
 * Admin operations that normally go through Netlify Functions.
 *
 * DEV-MODE FALLBACK
 * ─────────────────
 * When running `npm run dev` (Vite only), /.netlify/functions/* routes don't
 * exist — the Vite dev server returns the SPA's index.html (HTTP 200 HTML).
 * In that case we fall back to direct Firestore client SDK reads so the UI
 * remains functional during local development.
 *
 * Mutations that require the Firebase Admin SDK (creating Firebase Auth
 * accounts) require `netlify dev` to work fully.
 *
 * PRODUCTION / netlify dev
 * ─────────────────────────
 * All operations route through /.netlify/functions/admin-users and related
 * serverless functions, which use the Firebase Admin SDK server-side.
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    setDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { isFunctionsAvailable } from '@/utils/environment';
import { Record as RimsRecord, RecordType, RecordFilters } from '@/@types/rims.types';
import { CreateUserData, UpdateUserData } from '@/services/firebase/users/types';
import { db, auth } from '@/configs/firebase.config';

// ── Constants ─────────────────────────────────────────────────────────────────

const FN = '/.netlify/functions';
const USERS_COL = 'users';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminUserRecord {
    id: string;
    uid?: string;
    name: string;
    email: string;
    phone_number?: string;
    address?: string;
    designation?: string;
    faculty?: string;
    user_role: 'user' | 'admin';
    is_active: boolean;
    created_at?: any;
    updated_at?: any;
}

export interface AdminCreateUserPayload {
    name: string;
    email: string;
    phone_number?: string;
    address?: string;
    designation?: string;
    faculty?: string;
    user_role?: 'user' | 'admin';
}

export interface AdminUpdateUserPayload {
    user_id: string;
    name?: string;
    phone_number?: string;
    address?: string;
    designation?: string;
    faculty?: string;
    is_active?: boolean;
    user_role?: 'user' | 'admin';
    profile_picture_url?: string;
}

// ── Runtime detection ─────────────────────────────────────────────────────────

/**
 * Returns true when the Netlify Functions runtime is available.
 * Detected by checking if we're hosted at a Netlify port (8888) or via
 * VITE_APP_ENV env var. On plain `npm run dev` the functions don't exist.
 */
// ── Auth token ────────────────────────────────────────────────────────────────

const getToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated. Please sign in.');
    return user.getIdToken();
};

// ── Netlify Function HTTP client ──────────────────────────────────────────────

const fnRequest = async <T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
): Promise<T> => {
    const token = await getToken();
    const res = await fetch(`${FN}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let json: any;
    try {
        json = await res.json();
    } catch {
        // Response wasn't JSON — almost certainly the Vite SPA fallback
        throw new Error(
            `Netlify Function not available at ${endpoint}. ` +
            `Run \`netlify dev\` instead of \`npm run dev\` to use backend functions.`
        );
    }

    if (!json.success) {
        throw new Error(json.message || `Request failed (${res.status})`);
    }

    return json.data as T;
};

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

/** Normalise a Firestore DocumentSnapshot into AdminUserRecord */
const normaliseUser = (docSnap: any): AdminUserRecord => {
    const data = docSnap.data?.() ?? docSnap;
    const id = docSnap.id ?? data.uid ?? '';
    return { ...data, id, uid: id };
};

// ── GET all users ─────────────────────────────────────────────────────────────

/**
 * Fetch all users.
 * Production / netlify dev: GET /.netlify/functions/admin-users
 * npm run dev fallback:     Direct Firestore client SDK read
 */
export const adminGetAllUsers = async (opts: {
    role?: 'user' | 'admin' | 'all';
    status?: 'active' | 'inactive' | 'all';
    search?: string;
} = {}): Promise<AdminUserRecord[]> => {

    // ── Netlify Functions path ────────────────────────────────────────────────
    if (isFunctionsAvailable()) {
        const params = new URLSearchParams();
        if (opts.role && opts.role !== 'all') params.set('role', opts.role);
        if (opts.status && opts.status !== 'all') params.set('status', opts.status);
        if (opts.search) params.set('search', opts.search);

        const qs = params.toString();
        const result = await fnRequest('GET', `/admin-users${qs ? `?${qs}` : ''}`);
        const raw = (result as any)?.users ?? result ?? [];
        return raw.map((u: any) => ({ ...u, uid: u.id ?? u.uid }));
    }

    // ── Direct Firestore fallback (npm run dev) ───────────────────────────────
    console.warn('[admin.service] Using Firestore fallback — run `netlify dev` for full functionality.');

    let q: any = collection(db, USERS_COL);

    // Apply server-side role filter if supported
    if (opts.role && opts.role !== 'all') {
        q = query(q, where('user_role', '==', opts.role));
    }
    if (opts.status === 'active') {
        q = query(q, where('is_active', '==', true));
    } else if (opts.status === 'inactive') {
        q = query(q, where('is_active', '==', false));
    }

    const snap = await getDocs(q);
    let users: AdminUserRecord[] = snap.docs.map(d => normaliseUser(d));

    // Client-side search
    if (opts.search) {
        const sq = opts.search.toLowerCase();
        users = users.filter(u =>
            (u.name || '').toLowerCase().includes(sq) ||
            (u.email || '').toLowerCase().includes(sq) ||
            (u.faculty || '').toLowerCase().includes(sq)
        );
    }

    // Sort: admins first, then alphabetical
    users.sort((a, b) => {
        if (a.user_role === 'admin' && b.user_role !== 'admin') return -1;
        if (b.user_role === 'admin' && a.user_role !== 'admin') return 1;
        return (a.name || '').localeCompare(b.name || '');
    });

    return users;
};

// ── GET single user ───────────────────────────────────────────────────────────

export const adminGetUserById = async (userId: string): Promise<AdminUserRecord> => {
    if (isFunctionsAvailable()) {
        const result = await fnRequest('GET', `/admin-users?id=${encodeURIComponent(userId)}`);
        return { ...(result as any), uid: (result as any).id ?? (result as any).uid };
    }

    // Firestore fallback
    const snap = await getDoc(doc(db, USERS_COL, userId));
    if (!snap.exists()) throw new Error(`User ${userId} not found.`);
    return normaliseUser(snap);
};

// ── CREATE user ───────────────────────────────────────────────────────────────

/**
 * Create a new user.
 * Requires `netlify dev` — Firebase Auth account creation needs Admin SDK.
 * In plain `npm run dev`, shows a helpful error message.
 */
export const adminCreateUser = async (
    payload: AdminCreateUserPayload
): Promise<{ uid: string; email: string; resetLinkSent: boolean }> => {
    if (!isFunctionsAvailable()) {
        throw new Error(
            'Creating users requires `netlify dev` (Firebase Admin SDK needed to create Auth accounts server-side). ' +
            'Start the app with `netlify dev` instead of `npm run dev`.'
        );
    }
    return fnRequest('POST', '/admin-users', payload);
};

// ── UPDATE user ───────────────────────────────────────────────────────────────

export const adminUpdateUser = async (payload: AdminUpdateUserPayload): Promise<void> => {
    if (isFunctionsAvailable()) {
        await fnRequest('PUT', '/admin-users', payload);
        return;
    }

    // Firestore fallback for development
    const { user_id, ...fields } = payload;
    const UPDATABLE: (keyof typeof fields)[] = [
        'name', 'phone_number', 'address', 'designation',
        'faculty', 'is_active', 'user_role', 'profile_picture_url',
    ];
    const updates: Record<string, any> = {};
    for (const f of UPDATABLE) {
        if (fields[f] !== undefined) updates[f] = fields[f];
    }
    if (Object.keys(updates).length === 0) return;
    updates.updated_at = serverTimestamp();
    await updateDoc(doc(db, USERS_COL, user_id), updates);
};

// ── SOFT-DELETE (deactivate) ──────────────────────────────────────────────────

export const adminDeactivateUser = async (userId: string): Promise<void> => {
    if (isFunctionsAvailable()) {
        await fnRequest('DELETE', '/admin-users', { user_id: userId });
        return;
    }
    // Firestore fallback — can't disable Firebase Auth without Admin SDK,
    // but at least sets is_active = false so the UI reflects the change.
    await updateDoc(doc(db, USERS_COL, userId), {
        is_active: false,
        updated_at: serverTimestamp(),
    });
    console.warn('[admin.service] Firebase Auth account NOT disabled in dev-fallback mode. Run `netlify dev` for full deactivation.');
};

// ── ACTIVATE ──────────────────────────────────────────────────────────────────

export const adminActivateUser = async (userId: string): Promise<void> => {
    if (isFunctionsAvailable()) {
        await fnRequest('PUT', '/admin-users', { user_id: userId, is_active: true });
        return;
    }
    await updateDoc(doc(db, USERS_COL, userId), {
        is_active: true,
        updated_at: serverTimestamp(),
    });
};

// ── Password Reset ────────────────────────────────────────────────────────────

export const sendPasswordResetLink = async (email: string): Promise<void> => {
    if (isFunctionsAvailable()) {
        const token = await getToken().catch(() => null);
        const res = await fetch(`${FN}/send-reset-link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ email }),
        });
        let json: any;
        try { json = await res.json(); } catch { throw new Error('Server error sending reset link.'); }
        if (!json.success) throw new Error(json.message || 'Failed to send reset link');
        return;
    }

    // Fallback: use Firebase client SDK sendPasswordResetEmail
    const { sendPasswordResetEmail } = await import('firebase/auth');
    const { auth: clientAuth } = await import('@/configs/firebase.config');
    await sendPasswordResetEmail(clientAuth, email);
};

// ── Admin Statistics ──────────────────────────────────────────────────────────

export const getAdminStatistics = async (opts: { year?: string; domain?: string } = {}): Promise<any> => {
    if (!isFunctionsAvailable()) {
        console.warn('[admin.service] Statistics require `netlify dev`.');
        return null;
    }
    const params = new URLSearchParams({ type: 'admin' });
    if (opts.year && opts.year !== 'all') params.set('year', opts.year);
    if (opts.domain && opts.domain !== 'all') params.set('domain', opts.domain);
    return fnRequest('GET', `/statistics?${params.toString()}`);
};

// ── Admin Record Approval ─────────────────────────────────────────────────────

export const approveOrRejectRecord = async (
    domain: string,
    recordId: string,
    action: 'approve' | 'reject',
    reason?: string
): Promise<void> => {
    if (!isFunctionsAvailable()) {
        throw new Error('Record approval requires `netlify dev`.');
    }
    await fnRequest('PUT', '/admin-approve-record', { domain, record_id: recordId, action, reason });
};
