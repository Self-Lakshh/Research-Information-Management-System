import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auth, db } from '@/configs/firebase.config';
import { useAllRecords } from './useRecords';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { isFunctionsAvailable } from '@/utils/environment';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardParams {
    statsYear?: string;
    statsDomain?: string;
    chartYear?: string;
    chartDomain?: string;
    compareYears?: string[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── API helper ────────────────────────────────────────────────────────────────

const buildQS = (params: Record<string, any>): string => {
    const pairs = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'all');
    return pairs.length ? '?' + new URLSearchParams(pairs.map(([k, v]) => [k, String(v)])).toString() : '';
};

const fetchStatistics = async (opts: { type: string; year?: string; domain?: string }) => {
    if (!isFunctionsAvailable()) return null;

    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const token = await user.getIdToken();

    const qs = buildQS({ type: opts.type, year: opts.year, domain: opts.domain });
    const res = await fetch(`/.netlify/functions/statistics${qs}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const json = await res.json().catch(() => ({ success: false, message: 'Non-JSON response' }));
    if (!json.success) throw new Error(json.message || `HTTP ${res.status}`);
    return json.data;
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useDashboardData = (params: DashboardParams) => {
    const { statsYear = 'all', statsDomain = 'all', chartYear = new Date().getFullYear().toString(), compareYears = [] } = params;

    // Fetch all records for local aggregation in dev mode
    const { data: allRecords = [], isLoading: recordsLoading } = useAllRecords({
        type: statsDomain === 'all' ? undefined : statsDomain,
    } as any);

    // Fetch user count for stats
    const { data: userCount = 0, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-user-count'],
        queryFn: async () => {
            const q = query(collection(db, 'users'), where('user_role', '==', 'user'));
            const snap = await getDocs(q);
            return snap.size;
        },
        staleTime: 10 * 60 * 1000,
    });

    return useQuery({
        queryKey: ['dashboard-data', params, allRecords.length, userCount],
        queryFn: async () => {
            // 1. Try fetching from Cloud Function
            const raw = await fetchStatistics({
                type: 'admin',
                year: statsYear !== 'all' ? statsYear : undefined,
                domain: statsDomain !== 'all' ? statsDomain : undefined,
            });

            // 2. If no function response (local dev), manually aggregate
            if (!raw) {
                const yearFiltered = allRecords.filter(r => {
                    if (statsYear === 'all') return true;
                    const rYear = r.year_of_publication || r.publicationYear ||
                        (r.created_at?.toDate ? r.created_at.toDate().getFullYear() : null);
                    return String(rYear) === statsYear;
                });

                const byDomain: Record<string, number> = {};
                const byStatus: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };

                yearFiltered.forEach(r => {
                    const dom = r._domain || r.type || 'other';
                    byDomain[dom] = (byDomain[dom] || 0) + 1;
                    const status = (r.approval_status || 'pending').toLowerCase();
                    byStatus[status] = (byStatus[status] || 0) + 1;
                });

                const stats = {
                    totalUsers: userCount,
                    totalRecords: yearFiltered.length,
                    pendingApprovals: byStatus.pending ?? 0,
                    monthlySubmissions: yearFiltered.filter(r => {
                        const now = new Date();
                        const rDate = r.created_at?.toDate ? r.created_at.toDate() : new Date();
                        return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
                    }).length,
                    journals: byDomain['journal'] ?? 0,
                    conferences: byDomain['conference'] ?? 0,
                    books: byDomain['book'] ?? 0,
                    iprs: byDomain['ipr'] ?? 0,
                    awards: byDomain['award'] ?? 0,
                    grants: byDomain['consultancy'] ?? 0,
                    phdStudents: byDomain['phd_student'] ?? 0,
                    others: byDomain['other'] ?? 0,
                };

                // Build chart data
                const chartData = MONTHS.map((name, i) => {
                    const entry: Record<string, any> = { name };

                    // Current year (target)
                    const currentYearMatches = allRecords.filter(r => {
                        const d = r.created_at?.toDate ? r.created_at.toDate() : null;
                        if (!d) return false;
                        return d.getFullYear().toString() === chartYear && d.getMonth() === i;
                    });
                    entry.current = currentYearMatches.length;

                    // Comparison years
                    compareYears.forEach(year => {
                        const compMatches = allRecords.filter(r => {
                            const d = r.created_at?.toDate ? r.created_at.toDate() : null;
                            if (!d) return false;
                            return d.getFullYear().toString() === year && d.getMonth() === i;
                        });
                        entry[`year_${year}`] = compMatches.length;
                    });

                    return entry;
                });

                return { stats, chartData, summaryData: [], raw: null };
            }

            // 3. Map Cloud Function response
            const byDomainRaw = raw?.byDomain || {};
            const byStatusRaw = raw?.byStatus || {};
            const stats = {
                totalUsers: raw?.totalUsers ?? 0,
                totalRecords: raw?.totalRecords ?? 0,
                pendingApprovals: byStatusRaw.pending ?? 0,
                monthlySubmissions: (raw?.totalRecords ?? 0),
                journals: byDomainRaw['journal'] ?? 0,
                conferences: byDomainRaw['conference'] ?? 0,
                books: byDomainRaw['book'] ?? 0,
                iprs: byDomainRaw['ipr'] ?? 0,
                awards: byDomainRaw['award'] ?? 0,
                grants: byDomainRaw['consultancy'] ?? 0,
                phdStudents: byDomainRaw['phd_student'] ?? 0,
                others: byDomainRaw['other'] ?? 0,
            };

            // This part normally uses buildMonthlyChartData but we simplified it
            const chartData = MONTHS.map((name, i) => ({ name, current: 0 }));

            return { stats, chartData, summaryData: [], raw };
        },
        enabled: !recordsLoading && !usersLoading,
        staleTime: 5 * 60 * 1000,
    });
};
