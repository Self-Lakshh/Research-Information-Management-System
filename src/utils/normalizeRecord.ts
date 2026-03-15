/**
 * normalizeRecord.ts
 * ──────────────────
 * Maps domain-specific Firestore fields into a unified shape consumed by
 * RecordCard, RecordTable, RecordDetailModal, etc.
 *
 * Each domain record has a `_domain` tag injected by the service hooks.
 * This utility converts those raw records into a common structure so the UI
 * doesn't need to know about domain-specific field names.
 */

import type { Timestamp } from 'firebase/firestore';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Convert a Firestore Timestamp or ISO string to a human-readable date string */
function formatDate(value: any): string {
    if (!value) return '';
    if (typeof value?.toDate === 'function') {
        return value.toDate().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }
    if (typeof value === 'string') {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        }
        return value; // already a readable string (e.g. "March 2023")
    }
    if (typeof value === 'number') {
        return new Date(value).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }
    return String(value);
}

// ── Domain normalisers ─────────────────────────────────────────────────────────

/** IPR – intellectual property right */
function normalizeIPR(r: any) {
    return {
        ...r,
        _domain: 'ipr',
        title: r.title ?? '',
        subtitle: r.applicants?.join(', ') ?? '',
        category: r.patent_type ?? '',
        status: r.status ?? '',
        date: formatDate(r.published_date ?? r.created_at),
    };
}

/** Journal */
function normalizeJournal(r: any) {
    return {
        ...r,
        _domain: 'journal',
        title: r.title_of_paper ?? '',
        subtitle: r.journal_name ?? '',
        category: r.journal_type ?? 'Journal',
        status: r.ISSN_number ? `ISSN: ${r.ISSN_number}` : '',
        date: formatDate(r.date_of_publication ?? r.created_at),
    };
}

/** Conference */
function normalizeConference(r: any) {
    return {
        ...r,
        _domain: 'conference',
        title: r.title_of_paper ?? '',
        subtitle: r.name_of_conference ?? '',
        category: r.origin ?? 'Conference',
        status: r.year_of_publication ? `Year: ${r.year_of_publication}` : '',
        date: formatDate(r.year_of_publication ?? r.created_at),
    };
}

/** Book */
function normalizeBook(r: any) {
    return {
        ...r,
        _domain: 'book',
        title: r.title_of_book ?? '',
        subtitle: r.publisher_name ?? '',
        category: 'Book',
        status: r.ISBN_number ? `ISBN: ${r.ISBN_number}` : '',
        date: formatDate(r.date_of_publication ?? r.created_at),
    };
}

/** Award */
function normalizeAward(r: any) {
    return {
        ...r,
        _domain: 'award',
        title: r.award_name ?? r.title ?? '',
        subtitle: r.institution_body ?? '',
        category: r.country ?? 'Award',
        status: r.month_year ?? '',
        date: formatDate(r.month_year ?? r.created_at),
    };
}

/** Consultancy Project */
function normalizeConsultancy(r: any) {
    return {
        ...r,
        _domain: 'consultancy',
        title: r.project_title ?? '',
        subtitle: r.organization ?? '',
        category: r.status ?? 'Consultancy',
        status: r.amount ? `₹${r.amount}` : '',
        date: formatDate(r.grant_date ?? r.created_at),
    };
}

/** PhD Student */
function normalizePhDStudent(r: any) {
    return {
        ...r,
        _domain: 'phd_student',
        title: r.name_of_student ?? r.name ?? '',
        subtitle: r.enrollment_number ?? '',
        category: r.phd_stream ?? 'PhD Student',
        status: r.supervisor_type ?? '',
        date: formatDate(r.created_at),
    };
}

/** Other Event (FDP / Seminar / Workshop / Keynote) */
function normalizeOther(r: any) {
    return {
        ...r,
        _domain: 'other',
        title: r.topic_title ?? '',
        subtitle: r.organization ?? '',
        category: r.type ?? 'Event',
        status: r.role ?? '',
        date: formatDate(r.date ?? r.created_at),
    };
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * normalizeRecord — normalise a single raw Firestore record into a unified shape.
 * The `_domain` field (injected by the hooks) determines which normaliser runs.
 */
export function normalizeRecord(r: any): any {
    switch (r._domain ?? r.type) {
        case 'ipr':         return normalizeIPR(r);
        case 'journal':     return normalizeJournal(r);
        case 'conference':  return normalizeConference(r);
        case 'book':        return normalizeBook(r);
        case 'award':
        case 'awards':      return normalizeAward(r);
        case 'consultancy': return normalizeConsultancy(r);
        case 'phd_student': return normalizePhDStudent(r);
        case 'other':       return normalizeOther(r);
        default:
            // Unknown domain — pass through as-is with a fallback title
            return {
                ...r,
                title: r.title ?? r.title_of_paper ?? r.title_of_book ?? r.award_name ?? r.project_title ?? r.topic_title ?? r.name_of_student ?? r.id ?? 'Unknown',
                subtitle: '',
                category: r._domain ?? r.type ?? 'Other',
                status: '',
                date: formatDate(r.created_at),
            };
    }
}

/**
 * normalizeRecords — normalise an array of raw records.
 */
export function normalizeRecords(records: any[]): any[] {
    return records.map(normalizeRecord);
}

/**
 * resolveRecordType — extract the domain type string from a (possibly normalised) record.
 * Falls back to `domainFilter` if neither `_domain` nor `type` is present.
 */
export function resolveRecordType(record: any, domainFilter?: string): string {
    return record?._domain ?? record?.type ?? domainFilter ?? 'ipr';
}

/**
 * getYearFromRecord — extract a 4-digit year string from a normalised record.
 * Checks multiple timestamp / date fields.
 */
export function getYearFromRecord(r: any): string | null {
    // 1. Normalised date string (e.g. "5 Mar 2024")
    if (r.date && /\d{4}/.test(r.date)) {
        const m = r.date.match(/\d{4}/);
        if (m) return m[0];
    }
    // 2. Firestore Timestamp on created_at
    const ca = r.created_at;
    if (ca?.toDate) return ca.toDate().getFullYear().toString();
    // 3. Numeric year fields
    const yr = r.year_of_publication ?? r.publicationYear;
    if (yr) return String(yr);
    return null;
}
