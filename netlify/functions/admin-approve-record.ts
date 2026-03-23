import { db, admin } from './utils/firebase-admin';

/**
 * Netlify Function: admin-approve-record
 * 
 * Handles Admin approval/rejection of research records across different domains.
 */
export const handler = async (event: any, context: any) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'PUT' } };
    }

    if (event.httpMethod !== 'PUT') {
        return response(405, false, 'Method Not Allowed');
    }

    try {
        const { domain, record_id, action, reason } = JSON.parse(event.body || '{}');

        if (!domain || !record_id || !action) {
            return response(400, false, 'Missing required fields: domain, record_id, action are mandatory.');
        }

        // 1. Update Approval Status in Firestore
        // This project uses root-level collection names based on the record type/domain
        const recordRef = db.collection(domain).doc(record_id);
        const recordSnap = await recordRef.get();

        if (!recordSnap.exists) {
            return response(404, false, `Record ${record_id} not found in collection ${domain}.`);
        }

        const updates: any = {
            approval_status: action === 'approve' ? 'approved' : 'rejected',
            reviewed_at: admin.firestore.FieldValue.serverTimestamp(),
            // Optional: reviewer_id could be added here if needed
        };

        if (reason) updates.admin_remarks = reason;

        await recordRef.update(updates);

        // 2. Clear caches or update any related collections if necessary
        // ... (Optional) Logging or notification logic could go here

        return response(200, true, `Record ${action}d successfully.`, { record_id, action });
    } catch (err: any) {
        console.error('[admin-approve-record] Error:', err);
        return response(500, false, err.message || 'Error processing record approval.');
    }
};

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
