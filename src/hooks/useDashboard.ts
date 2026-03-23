import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auth, db } from '@/configs/firebase.config';
import { useAllRecords } from './useRecords';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { isFunctionsAvailable } from '@/utils/environment';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
    totalUsers: number;
    approvedNonPhd: number;
    pendingNonPhd: number;
    rejectedNonPhd: number;
    totalRecords: number;
    journals: number;
    conferences: number;
    books: number;
    iprs: number;
    awards: number;
    grants: number;
    phd_student: number;
    others: number;
}

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

const fetchStatistics = async (opts: { 
    type: string; 
    year?: string; 
    domain?: string;
    chartYear?: string;
    chartDomain?: string;
    compareYears?: string[];
}) => {
    if (!isFunctionsAvailable()) return null;

    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const token = await user.getIdToken();

    const qs = buildQS({ 
        type: opts.type, 
        year: opts.year, 
        domain: opts.domain,
        chartYear: opts.chartYear,
        chartDomain: opts.chartDomain,
        compareYears: opts.compareYears?.join(',')
    });
    
    const res = await fetch(`/api/statistics${qs}`, {
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
    const { 
        statsYear = 'all', 
        statsDomain = 'all', 
        chartYear = new Date().getFullYear().toString(), 
        chartDomain = 'all',
        compareYears = [] 
    } = params;

    // Fetch all records for local aggregation in dev mode (Fallback only)
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
                chartYear,
                chartDomain,
                compareYears
            });

            // 2. Return API result if available
            if (raw) {
                return {
                    stats: {
                        totalUsers: raw.totalUsers,
                        approvedNonPhd: raw.approvedNonPhd,
                        pendingNonPhd: raw.pendingNonPhd,
                        rejectedNonPhd: raw.rejectedNonPhd,
                        totalRecords: raw.approvedNonPhd,
                        journals: raw.byDomain?.['journal'] ?? 0,
                        conferences: raw.byDomain?.['conference'] ?? 0,
                        books: raw.byDomain?.['book'] ?? 0,
                        iprs: raw.byDomain?.['ipr'] ?? 0,
                        awards: raw.byDomain?.['award'] ?? 0,
                        grants: raw.byDomain?.['consultancy'] ?? 0,
                        phd_student: raw.byDomain?.['phd_student'] ?? 0,
                        others: raw.byDomain?.['other'] ?? 0,
                    },
                    chartData: raw.chartData || [],
                    summaryData: [],
                    raw
                };
            }

            // 3. Simple Fallback mapping for local dev
            return {
                stats: {
                    totalUsers: userCount,
                    approvedNonPhd: 0,
                    pendingNonPhd: 0,
                    rejectedNonPhd: 0,
                    totalRecords: 0,
                    journals: 0,
                    conferences: 0,
                    books: 0,
                    iprs: 0,
                    awards: 0,
                    grants: 0,
                    phd_student: 0,
                    others: 0,
                },
                chartData: [],
                summaryData: [],
                raw: null
            };
        },
        enabled: !recordsLoading && !usersLoading,
        staleTime: 5 * 60 * 1000,
    });
};
