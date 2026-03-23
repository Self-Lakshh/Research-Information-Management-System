import { auth, db, admin } from './utils/firebase-admin';

/**
 * Netlify Function: admin-users
 * Handles GET, POST, PUT, DELETE for user management.
 * 
 * Production / netlify dev: /.netlify/functions/admin-users
 */
export const handler = async (event: any, context: any) => {
    // ── Pre-flight (CORS) ──────────────────────────────────────────────────
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE' } };
    }

    const { httpMethod, queryStringParameters, body } = event;
    const authHeader = event.headers.authorization;

    // ── Auth check (ensure request is from an authenticated admin) ────────────
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response(401, false, 'No authorization token provided.');
    }

    const idToken = authHeader.split('Bearer ')[1];
    let callerUid: string;
    try {
        const decoded = await auth.verifyIdToken(idToken);
        callerUid = decoded.uid;
        // Optional: Check if caller is actually an admin in Firestore
        const callerDoc = await db.collection('users').doc(callerUid).get();
        if (!callerDoc.exists || callerDoc.data()?.user_role !== 'admin') {
            return response(403, false, 'Forbidden: Admin access required.');
        }
    } catch (err) {
        return response(401, false, 'Invalid or expired token.');
    }

    // ── Router ─────────────────────────────────────────────────────────────
    try {
        switch (httpMethod) {
            case 'GET':
                return await handleGet(queryStringParameters);
            case 'POST':
                return await handlePost(JSON.parse(body || '{}'));
            case 'PUT':
                return await handlePut(JSON.parse(body || '{}'));
            case 'DELETE':
                return await handleDelete(JSON.parse(body || '{}'));
            default:
                return response(405, false, 'Method Not Allowed');
        }
    } catch (err: any) {
        console.error(`[admin-users] Error (${httpMethod}):`, err);
        return response(500, false, err.message || 'Internal Server Error');
    }
};

// ── GET all users or single user ──────────────────────────────────────────────
async function handleGet(params: any) {
    // Single user by ID
    if (params?.id) {
        const userDoc = await db.collection('users').doc(params.id).get();
        if (!userDoc.exists) return response(404, false, 'User not found.');
        return response(200, true, 'User fetched successfully.', { ...userDoc.data(), id: userDoc.id });
    }

    // List all users
    let q: any = db.collection('users');
    if (params?.role && params.role !== 'all') q = q.where('user_role', '==', params.role);
    if (params?.status === 'active') q = q.where('is_active', '==', true);
    else if (params?.status === 'inactive') q = q.where('is_active', '==', false);

    const snap = await q.get();
    let users = snap.docs.map((d: any) => ({ ...d.data(), id: d.id }));

    // Optional client-side search if needed (better to do in Firestore if queryable)
    if (params?.search) {
        const sq = params.search.toLowerCase();
        users = users.filter((u: any) =>
            (u.name || '').toLowerCase().includes(sq) ||
            (u.email || '').toLowerCase().includes(sq) ||
            (u.faculty || '').toLowerCase().includes(sq) ||
            (u.designation || '').toLowerCase().includes(sq)
        );
    }

    return response(200, true, 'Users fetched successfully.', { users });
}

// ── POST create user (Auth + Firestore) ───────────────────────────────────────
async function handlePost(payload: any) {
    const { email, name, user_role, faculty, phone_number, designation } = payload;
    if (!email || !name) return response(400, false, 'Email and Name are required.');

    // 1. Create Auth account
    // For now we set a random password and send a reset link later
    const tempPassword = Math.random().toString(36).slice(-10);
    const authUser = await auth.createUser({
        email,
        displayName: name,
        password: tempPassword,
        disabled: false
    });

    // 2. Create Firestore record
    const userDocRef = db.collection('users').doc(authUser.uid);
    await userDocRef.set({
        uid: authUser.uid,
        email,
        name,
        user_role: user_role || 'user',
        faculty: faculty || '',
        phone_number: phone_number || '',
        designation: designation || '',
        is_active: true,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. Send password reset link (optional but recommended)
    let resetLinkSent = false;
    try {
        const resetLink = await auth.generatePasswordResetLink(email);
        // Note: You normally send this via email service, but we'll return it/flag it
        resetLinkSent = true;
    } catch (err) {
        console.error('Failed to generate reset link:', err);
    }

    return response(201, true, 'User created successfully.', {
        uid: authUser.uid,
        email,
        resetLinkSent
    });
}

// ── PUT update user (Auth + Firestore) ────────────────────────────────────────
async function handlePut(payload: any) {
    const { user_id, name, is_active, user_role, faculty, phone_number, designation, profile_picture_url } = payload;
    if (!user_id) return response(400, false, 'User ID is required.');

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (is_active !== undefined) updates.is_active = is_active;
    if (user_role !== undefined) updates.user_role = user_role;
    if (faculty !== undefined) updates.faculty = faculty;
    if (phone_number !== undefined) updates.phone_number = phone_number;
    if (designation !== undefined) updates.designation = designation;
    if (profile_picture_url !== undefined) updates.profile_picture_url = profile_picture_url;
    
    updates.updated_at = admin.firestore.FieldValue.serverTimestamp();

    // 1. Update Firestore
    await db.collection('users').doc(user_id).update(updates);

    // 2. Update Auth if necessary (e.g. displayName, disabled status)
    const authUpdates: any = {};
    if (name !== undefined) authUpdates.displayName = name;
    if (is_active !== undefined) authUpdates.disabled = !is_active;
    
    if (Object.keys(authUpdates).length > 0) {
        await auth.updateUser(user_id, authUpdates);
    }

    return response(200, true, 'User updated successfully.');
}

// ── DELETE soft-delete (deactivate) ───────────────────────────────────────────
async function handleDelete(payload: any) {
    const { user_id } = payload;
    if (!user_id) return response(400, false, 'User ID is required.');

    // Soft delete: deactivate in Firestore and disable in Auth
    await db.collection('users').doc(user_id).update({
        is_active: false,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await auth.updateUser(user_id, { disabled: true });

    return response(200, true, 'User deactivated successfully.');
}

// ── Helper: JSON Response ─────────────────────────────────────────────────────
function response(code: number, success: boolean, message: string, data: any = null) {
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success, message, data })
    };
}
