import { db } from './utils/firebase-admin';

export const handler = async (event: any, context: any) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } };
    if (event.httpMethod !== 'GET') return response(405, false, 'Method Not Allowed');

    const { type, year, domain, chartYear, chartDomain, compareYears } = event.queryStringParameters || {};
    const compYears = compareYears ? compareYears.split(',') : [];
    
    try {
        console.log('[statistics] Starting aggregation...');
        // 1. All Users Count (Researchers)
        const userSnap = await db.collection('users').where('user_role', '==', 'user').get();
        const totalUsers = userSnap.size;

        // 2. Records Query - Fetch from all known domain collections
        const domainCollections = [
            'ipr', 'journals', 'conferences', 'books', 'awards', 
            'consultancy_projects', 'phd_students', 'other_events'
        ];
        
        // Mapping of collection names back to internal domain keys
        const colToDomain: Record<string, string> = {
            'ipr': 'ipr',
            'journals': 'journal',
            'conferences': 'conference',
            'books': 'book',
            'awards': 'award',
            'consultancy_projects': 'consultancy',
            'phd_students': 'phd_student',
            'other_events': 'other'
        };

        const allDocsPromises = domainCollections.map(async (colName) => {
            try {
                const snap = await db.collection(colName).get();
                console.log(`[statistics] Fetched ${snap.size} docs from ${colName}`);
                return snap.docs.map(doc => ({ 
                    ...doc.data(), 
                    _id: doc.id, 
                    _domain: colToDomain[colName] // Force the domain based on the collection it's in
                }));
            } catch (e) {
                console.error(`[statistics] Error fetching collection ${colName}:`, e);
                return [];
            }
        });

        const allRecords = (await Promise.all(allDocsPromises)).flat();
        console.log(`[statistics] Total records to process: ${allRecords.length}`);

        // 3. Filter and Aggregate
        const byDomain: Record<string, number> = {};
        const byStatus: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
        const statsByYear: Record<string, number> = {};
        
        let approvedNonPhd = 0;
        let pendingNonPhd = 0;
        let rejectedNonPhd = 0;

        // MONTHS array for monthly distribution
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Chart structures
        const chartMonthly: Record<string, Record<number, number>> = {}; // year -> monthIndex -> count
        const chartYearly: Record<string, number> = {}; // year -> count

        allRecords.forEach((item: any) => {
            const data = item;
            const createdAt = data.created_at?.toDate?.() || 
                             (data.created_at && typeof data.created_at.toDate === 'function' ? data.created_at.toDate() : null) ||
                             (data.created_at instanceof Date ? data.created_at : null) || 
                             new Date();
            
            const rYear = data.year_of_publication || data.publicationYear || createdAt.getFullYear();
            const rMonth = createdAt.getMonth();
            const rDomain = (data._domain || data.type || 'other').toLowerCase();
            const rStatus = (data.approval_status || 'pending').toLowerCase();
            const isPhd = (rDomain === 'phd_student' || rDomain === 'phd');

            // --- Aggregation for Stats Overview (controlled by 'year' and 'domain' params) ---
            const matchesStatsYear = !year || String(rYear) === year;
            const matchesStatsDomain = !domain || rDomain === domain;

            if (matchesStatsYear && matchesStatsDomain) {
                byDomain[rDomain] = (byDomain[rDomain] || 0) + 1;
                byStatus[rStatus] = (byStatus[rStatus] || 0) + 1;
                statsByYear[rYear] = (statsByYear[rYear] || 0) + 1;

                if (!isPhd) {
                    if (rStatus === 'approved') approvedNonPhd++;
                    else if (rStatus === 'pending') pendingNonPhd++;
                    else if (rStatus === 'rejected') rejectedNonPhd++;
                }
            }

            // --- Aggregation for Analytics Chart ---
            const matchesChartDomain = !chartDomain || chartDomain === 'all' || rDomain === chartDomain;
            if (matchesChartDomain) {
                // For 'all' years view
                chartYearly[rYear] = (chartYearly[rYear] || 0) + 1;

                // For monthly view (of chartYear or compareYears)
                const yearsToTrack = [chartYear, ...compYears];
                if (yearsToTrack.includes(String(rYear))) {
                    if (!chartMonthly[rYear]) chartMonthly[rYear] = {};
                    chartMonthly[rYear][rMonth] = (chartMonthly[rYear][rMonth] || 0) + 1;
                }
            }
        });

        console.log(`[statistics] Final Results - Approved: ${approvedNonPhd}, Pending: ${pendingNonPhd}, Journal: ${byDomain['journal'] || 0}`);

        // 4. Transform Chart Data for Recharts
        let finalChartData = [];
        if (chartYear === 'all') {
            finalChartData = Object.entries(chartYearly)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([name, count]) => ({ name, current: count }));
        } else {
            finalChartData = MONTHS.map((name, i) => {
                const entry: any = { name, month: i };
                entry.current = chartMonthly[chartYear]?.[i] || 0;
                compYears.forEach((y: string) => {
                    entry[`year_${y}`] = chartMonthly[y]?.[i] || 0;
                });
                return entry;
            });
        }

        const result = {
            totalUsers,
            approvedNonPhd,
            pendingNonPhd,
            rejectedNonPhd,
            byDomain,
            byStatus,
            totalRecords: approvedNonPhd,
            chartData: finalChartData
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
