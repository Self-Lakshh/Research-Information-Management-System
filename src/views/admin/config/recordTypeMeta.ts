import type { RecordType } from '../types'

// ============================================
// RECORD TYPE METADATA
// ============================================

export interface RecordTypeMeta {
    type: RecordType
    label: string
    pluralLabel: string
    shortLabel: string
    description: string
    icon: string  // Lucide icon name
    badgeColor: string
}

export const recordTypeMeta: Record<RecordType, RecordTypeMeta> = {
    ipr: {
        type: 'ipr',
        label: 'IPR',
        pluralLabel: 'IPRs',
        shortLabel: 'IPR',
        description: 'Patents, Copyrights, and Intellectual Property Rights',
        icon: 'Shield',
        badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
    },
    journal: {
        type: 'journal',
        label: 'Journal Publication',
        pluralLabel: 'Journal Publications',
        shortLabel: 'Journal',
        description: 'Research papers published in academic journals',
        icon: 'BookOpen',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    conference: {
        type: 'conference',
        label: 'Conference Paper',
        pluralLabel: 'Conference Papers',
        shortLabel: 'Conference',
        description: 'Papers presented at conferences and symposiums',
        icon: 'Users',
        badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
    },
    book: {
        type: 'book',
        label: 'Book/Chapter',
        pluralLabel: 'Books & Chapters',
        shortLabel: 'Book',
        description: 'Books authored, edited, or book chapters',
        icon: 'BookMarked',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    },
    award: {
        type: 'award',
        label: 'Award',
        pluralLabel: 'Awards',
        shortLabel: 'Award',
        description: 'Academic and professional recognitions',
        icon: 'Award',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    },
    consultancy: {
        type: 'consultancy',
        label: 'Consultancy',
        pluralLabel: 'Consultancies',
        shortLabel: 'Consult.',
        description: 'Industry consultancy projects',
        icon: 'Briefcase',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
    grant: {
        type: 'grant',
        label: 'Research Grant',
        pluralLabel: 'Research Grants',
        shortLabel: 'Grant',
        description: 'Funded research projects',
        icon: 'Banknote',
        badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    other: {
        type: 'other',
        label: 'Other',
        pluralLabel: 'Other Activities',
        shortLabel: 'Other',
        description: 'Other academic activities',
        icon: 'MoreHorizontal',
        badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
}

// Helper to get all record types as options for selects
export const recordTypeOptions = Object.values(recordTypeMeta).map(meta => ({
    label: meta.label,
    value: meta.type
}))

// Helper to get meta by type
export const getRecordTypeMeta = (type: RecordType): RecordTypeMeta => {
    return recordTypeMeta[type]
}

export default recordTypeMeta
