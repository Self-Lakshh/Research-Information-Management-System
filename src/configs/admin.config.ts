import { RecordType, ApprovalStatus, UserRole } from '@/@types/rims.types'
import { FilterConfig } from '@/@types/admin'

export const recordTypeMeta: Record<RecordType, {
    type: RecordType
    label: string
    shortLabel: string
    badgeColor: string
    color: string
    icon: string
}> = {
    ipr: {
        type: 'ipr',
        label: 'IPR',
        shortLabel: 'IPR',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        color: 'indigo',
        icon: 'Shield'
    },
    journal: {
        type: 'journal',
        label: 'Journal',
        shortLabel: 'JRN',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        color: 'blue',
        icon: 'BookOpen'
    },
    conference: {
        type: 'conference',
        label: 'Conference',
        shortLabel: 'CONF',
        badgeColor: 'bg-azure-100 text-azure-700 dark:bg-azure-900/30 dark:text-azure-400',
        color: 'sky',
        icon: 'Users'
    },
    book: {
        type: 'book',
        label: 'Book/Chapter',
        shortLabel: 'BOOK',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        color: 'amber',
        icon: 'FileText'
    },
    award: {
        type: 'award',
        label: 'Award/Recognition',
        shortLabel: 'AWD',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        color: 'rose',
        icon: 'Award'
    },
    consultancy: {
        type: 'consultancy',
        label: 'Consultancy',
        shortLabel: 'CONS',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        color: 'emerald',
        icon: 'Briefcase'
    },

    other: {
        type: 'other',
        label: 'Other',
        shortLabel: 'OTHR',
        badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        color: 'slate',
        icon: 'MoreHorizontal'
    },
    phd_student: {
        type: 'phd_student',
        label: 'PhD Student',
        shortLabel: 'PHD',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        color: 'emerald',
        icon: 'GraduationCap'
    }
}

export const approvalFilters: FilterConfig[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'All Status', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' }
        ]
    },
    {
        key: 'type',
        label: 'Record Type',
        type: 'select',
        options: [
            { label: 'All Types', value: 'all' },
            { label: 'IPR', value: 'ipr' },
            { label: 'Journal', value: 'journal' },
            { label: 'Conference', value: 'conference' },
            { label: 'Book', value: 'book' }
        ]
    }
]

export const userFilters: FilterConfig[] = [
    {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
            { label: 'All Roles', value: 'all' },
            { label: 'Admin', value: 'admin' },
            { label: 'Faculty', value: 'faculty' },
            { label: 'HOD', value: 'hod' },
            { label: 'Dean', value: 'dean' }
        ]
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'All Status', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
        ]
    }
]

export const recordFilters: FilterConfig[] = [
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'All Status', value: 'all' },
            { label: 'Approved', value: 'approved' },
            { label: 'Pending', value: 'pending' },
            { label: 'Rejected', value: 'rejected' }
        ]
    },
    {
        key: 'type',
        label: 'Record Type',
        type: 'select',
        options: [
            { label: 'All Types', value: 'all' },
            { label: 'IPR', value: 'ipr' },
            { label: 'Journal', value: 'journal' },
            { label: 'Conference', value: 'conference' },
            { label: 'Book', value: 'book' },
            { label: 'Award', value: 'award' },
            { label: 'Grant', value: 'grant' }
        ]
    }
]
