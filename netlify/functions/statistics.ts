import { db } from './utils/firebase-admin';

/**
 * Netlify Function: statistics
 * Aggregates statistics for admin and user dashboards across Firestore.
 * 
 * Production / netlify dev: GET /.netlify/functions/statistics
 */
export const handler = async (event: any, context: any) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } };
    if (event.httpMethod !== 'GET') return response(405, false, 'Method Not Allowed');

    const { type, year, domain } = event.queryStringParameters || {};
    
    try {
        // 1. All Users Count
        const userSnap = await db.collection('users').where('user_role', '==', 'user').get();
        const totalUsers = userSnap.size;

        // 2. Records Query
        let q: any = db.collectionGroup('records'); // Use collectionGroup for all types
        
        const recordsSnap = await q.get();
        const allDocs = recordsSnap.docs;

        // 3. Filter and Aggregate
        const byDomain: Record<string, number> = {};
        const byStatus: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
        let filteredCount = 0;

        allDocs.forEach((d: any) => {
            const data = d.data();
            const rYear = data.year_of_publication || data.publicationYear || (data.created_at?.toDate?.()?.getFullYear());
            const rDomain = data._domain || data.type || 'other';
            const rStatus = (data.approval_status || 'pending').toLowerCase();

            // Apply filters if provided
            const matchesYear = !year || String(rYear) === year;
            const matchesDomain = !domain || rDomain === domain;

            if (matchesYear && matchesDomain) {
                filteredCount++;
                byDomain[rDomain] = (byDomain[rDomain] || 0) + 1;
                byStatus[rStatus] = (byStatus[rStatus] || 0) + 1;
            }
        });

        // 4. Response structure matching useDashboard.ts needs
        const result = {
            totalUsers,
            totalRecords: filteredCount,
            byDomain,
            byStatus,
            // Additional Aggregations as required by frontend
            raw: { totalUsers, totalRecords: filteredCount, byDomain, byStatus }
        };

        return response(200, true, 'Statistics calculated successfully.', result);
    } catch (err: any) {
        console.error('[statistics] Error:', err);
        return response(500, false, err.message || 'Error calculating statistics.');
    }
};

function response(code: number, success: boolean, message: string, data: any = null) {
    return {
        statusCode: code,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success, message, data })
    };
}
