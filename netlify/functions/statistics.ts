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

        const computedStats: Record<string, { approved: number, pending: number, rejected: number, total: number }> = {};
        domainCollections.forEach(col => {
            computedStats[colToDomain[col]] = { approved: 0, pending: 0, rejected: 0, total: 0 };
        });

        // 2 & 4. COMBINED FETCH AND PROCESS - Streamlined to reduce memory and CPU
        const chartDataMap: Record<string, Record<number, number>> = {};
        const chartYearlyMap: Record<string, number> = {};
        const yearsToTrack = [chartYear, ...compYears].filter(y => y && y !== 'all');
        const isAllView = chartYear === 'all';

        // Pre-initialize chart data structure
        yearsToTrack.forEach(y => chartDataMap[y] = {});

        const chartProcessingPromises = domainCollections.map(async (col) => {
            const rDomain = colToDomain[col];
            if (chartDomain && chartDomain !== 'all' && rDomain !== chartDomain) return;

            // Use select to get only necessary fields
            const snap = await db.collection(col)
                .select('created_at', 'year_of_publication', 'publicationYear', 'published_date', 'date_of_publication', 'grant_date', 'month_year', 'filing_date', 'approval_status')
                .get();

            snap.forEach(doc => {
                const data = doc.data();
                let rYear: number | null = null;
                let rMonth: number = -1;

                // Priority 1: Exact explicit dates (YYYY-MM-DD or valid date string)
                const pubDateStr = data.date_of_publication || data.published_date || data.grant_date || data.filing_date;
                if (pubDateStr) {
                    const parsed = new Date(pubDateStr);
                    if (!isNaN(parsed.getTime())) {
                        rYear = parsed.getFullYear();
                        rMonth = parsed.getMonth();
                    }
                }

                // Priority 2: "Month Year" strings (used heavily in Awards)
                if ((!rYear || rMonth === -1) && data.month_year) {
                    const parsed = new Date(data.month_year);
                    if (!isNaN(parsed.getTime())) {
                        rYear = parsed.getFullYear();
                        rMonth = parsed.getMonth();
                    } else {
                        const match = String(data.month_year).match(/\d{4}/);
                        if (match) rYear = Number(match[0]);
                    }
                }

                // Priority 3: Fallback specific year integers (Conferences)
                rYear = rYear || Number(data.year_of_publication || data.publicationYear) || null;

                // Priority 4: Fallback to System Created Date
                const createdAt = data.created_at?.toDate?.() || 
                                 (data.created_at && typeof data.created_at.toDate === 'function' ? data.created_at.toDate() : null) ||
                                 (data.created_at instanceof Date ? data.created_at : null);

                if (!rYear && createdAt) rYear = createdAt.getFullYear();
                if (!rYear) rYear = new Date().getFullYear();

                if (rMonth === -1) {
                    rMonth = createdAt ? createdAt.getMonth() : 0;
                }

                const sYear = String(rYear);

                chartYearlyMap[sYear] = (chartYearlyMap[sYear] || 0) + 1;
                if (chartDataMap[sYear]) {
                    chartDataMap[sYear][rMonth] = (chartDataMap[sYear][rMonth] || 0) + 1;
                }

                // Aggregate KPIs filtered by the strictly derived publication year
                if (isAllView || sYear === chartYear) {
                    const status = data.approval_status || 'pending';
                    const dStats = computedStats[rDomain];
                    if (status === 'approved') dStats.approved++;
                    else if (status === 'pending') dStats.pending++;
                    else dStats.rejected++;
                    dStats.total++;
                }
            });
        });

        // Resolve Processing
        const [userSnap] = await Promise.all([
            userCountPromise,
            Promise.all(chartProcessingPromises)
        ]);

        const totalUsers = userSnap.data().count;

        // 3. Process Stats Overview
        const byDomain: Record<string, number> = {};
        let approvedNonPhd = 0;
        let pendingNonPhd = 0;
        let rejectedNonPhd = 0;

        Object.entries(computedStats).forEach(([domKey, ds]) => {
            const isPhd = domKey === 'phd_student';
            byDomain[domKey] = ds.total;
            if (!isPhd) {
                approvedNonPhd += ds.approved;
                pendingNonPhd += ds.pending;
                rejectedNonPhd += ds.rejected;
            }
        });

        // 5. Transform for Recharts
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let finalChartData = [];
        
        if (isAllView) {
            finalChartData = Object.entries(chartYearlyMap)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([name, count]) => ({ name, current: count }));
        } else {
            finalChartData = MONTHS.map((name, i) => {
                const entry: any = { name, month: i };
                entry.current = chartDataMap[chartYear]?.[i] || 0;
                compYears.forEach((y: string) => {
                    entry[`year_${y}`] = chartDataMap[y]?.[i] || 0;
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
