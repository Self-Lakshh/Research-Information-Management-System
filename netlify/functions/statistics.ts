import { db } from './utils/firebase-admin';

export const handler = async (event: any, context: any) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } };
    if (event.httpMethod !== 'GET') return response(405, false, 'Method Not Allowed');

    const { type, year, domain, chartYear, chartDomain, compareYears } = event.queryStringParameters || {};
    const compYears = compareYears ? compareYears.split(',') : [];
    
    try {
        console.log('[statistics] Starting optimized aggregation...');
        
        // 1. FAST TOTALS - Using count() aggregation
        const userCountPromise = db.collection('users').where('user_role', '==', 'user').count().get();

        const domainCollections = [
            'ipr', 'journals', 'conferences', 'books', 'awards', 
            'consultancy_projects', 'phd_students', 'other_events'
        ];
        
        const colToDomain: Record<string, string> = {
            'ipr': 'ipr', 'journals': 'journal', 'conferences': 'conference', 'books': 'book',
            'awards': 'award', 'consultancy_projects': 'consultancy', 'phd_students': 'phd_student', 'other_events': 'other'
        };

        // Aggregation for Stats Overview
        // We fetch status counts for ALL domains in parallel using count()
        const domainStatsPromises = domainCollections.map(async (col) => {
            const [appr, pend, rej] = await Promise.all([
                db.collection(col).where('approval_status', '==', 'approved').count().get(),
                db.collection(col).where('approval_status', '==', 'pending').count().get(),
                db.collection(col).where('approval_status', '==', 'rejected').count().get(),
            ]);
            return {
                col,
                domain: colToDomain[col],
                approved: appr.data().count,
                pending: pend.data().count,
                rejected: rej.data().count,
                total: appr.data().count + pend.data().count + rej.data().count
            };
        });

        // 2. CHART DATA - This still requires some document fetching but we use .select()
        // to minimize payload and speed up processing.
        // We only fetch docs for the years we actually care about if possible.
        const yearsToTrack = [chartYear, ...compYears].filter(y => y && y !== 'all');
        
        const chartFetchPromises = domainCollections.map(async (col) => {
            const rDomain = colToDomain[col];
            // Filter by domain early if possible
            if (chartDomain && chartDomain !== 'all' && rDomain !== chartDomain) return [];

            let q: any = db.collection(col);
            
            // If we have specific years to track, we try to optimize. 
            // Note: Since fields vary, we still do some mapping in JS but fetch is faster.
            // Using .select() drastically reduces data transfer
            const snap = await q.select('created_at', 'year_of_publication', 'publicationYear', 'approval_status').get();
            return snap.docs.map((doc: any) => ({ ...doc.data(), _domain: rDomain }));
        });

        // Resolve all promises
        const [userSnap, domainStats, ...chartDocsNested] = await Promise.all([
            userCountPromise,
            Promise.all(domainStatsPromises),
            ...chartFetchPromises
        ]);

        const totalUsers = userSnap.data().count;
        const allRecordsForChart = chartDocsNested.flat();

        // 3. Process Stats Overview
        const byDomain: Record<string, number> = {};
        const byStatus: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
        
        let approvedNonPhd = 0;
        let pendingNonPhd = 0;
        let rejectedNonPhd = 0;

        domainStats.forEach(ds => {
            const isPhd = ds.domain === 'phd_student';
            byDomain[ds.domain] = ds.total;
            
            if (!isPhd) {
                approvedNonPhd += ds.approved;
                pendingNonPhd += ds.pending;
                rejectedNonPhd += ds.rejected;
            }
            
            byStatus.approved += ds.approved;
            byStatus.pending += ds.pending;
            byStatus.rejected += ds.rejected;
        });

        // 4. Process Chart Data
        const chartYearly: Record<string, number> = {};
        const chartMonthly: Record<string, Record<number, number>> = {};
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        allRecordsForChart.forEach((data: any) => {
            const createdAt = data.created_at?.toDate?.() || 
                             (data.created_at && typeof data.created_at.toDate === 'function' ? data.created_at.toDate() : null) ||
                             (data.created_at instanceof Date ? data.created_at : null) || 
                             new Date();
            
            const rYear = data.year_of_publication || data.publicationYear || createdAt.getFullYear();
            const rMonth = createdAt.getMonth();
            const sYear = String(rYear);

            // Yearly totals (for 'all' view)
            chartYearly[sYear] = (chartYearly[sYear] || 0) + 1;

            // Monthly breakdown (for specific year or comparisons)
            if (yearsToTrack.includes(sYear)) {
                if (!chartMonthly[sYear]) chartMonthly[sYear] = {};
                chartMonthly[sYear][rMonth] = (chartMonthly[sYear][rMonth] || 0) + 1;
            }
        });

        // 5. Transform for Recharts
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
