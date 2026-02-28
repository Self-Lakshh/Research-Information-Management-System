import { RecordType, ApprovalStatus, UserRole } from '@/@types/rims.types'
import { FieldConfig, FilterConfig } from '@/@types/admin'

// ============================================
// DOMAIN CONFIGURATION INTERFACE
// ============================================

export interface DomainConfig {
    type: RecordType
    label: string
    shortLabel: string
    pluralLabel: string
    icon: string
    color: string
    badgeColor: string
    themeColor: 'indigo' | 'blue' | 'sky' | 'amber' | 'rose' | 'emerald' | 'slate' | 'violet' | 'teal'
    fields: FieldConfig[]
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const createField = (field: Partial<FieldConfig> & { key: string; label: string; type: any }): FieldConfig => ({
    required: true,
    gridSpan: 1,
    ...field
})

// ============================================
// RECORD TYPE CONFIGURATIONS (SINGLE SOURCE OF TRUTH)
// ============================================

export const RECORD_TYPE_CONFIG: Record<RecordType, DomainConfig> = {
    journal: {
        type: 'journal',
        label: 'Journal',
        shortLabel: 'JRN',
        pluralLabel: 'Journal Publications',
        icon: 'BookOpen',
        color: 'text-indigo-600 bg-indigo-600/10',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        themeColor: 'indigo',
        fields: [
            createField({ key: 'title', label: 'Paper Title', type: 'text', gridSpan: 2 }),
            createField({ key: 'journalName', label: 'Journal Name', type: 'text', gridSpan: 2 }),
            createField({ key: 'authors', label: 'Authors', type: 'text', placeholder: 'Separate with commas' }),
            createField({ key: 'publicationDate', label: 'Publication Date', type: 'date' }),
            createField({ key: 'volume', label: 'Volume', type: 'text', required: false }),
            createField({ key: 'issue', label: 'Issue', type: 'text', required: false }),
            createField({ key: 'pages', label: 'Pages', type: 'text', required: false }),
            createField({ key: 'publisher', label: 'Publisher', type: 'text' }),
            createField({ key: 'doi', label: 'DOI', type: 'url', required: false }),
            createField({ key: 'link', label: 'Link to Paper', type: 'url', required: false }),
            createField({
                key: 'indexing',
                label: 'Indexing',
                type: 'select',
                options: [
                    { label: 'SCI', value: 'sci' },
                    { label: 'Scopus', value: 'scopus' },
                    { label: 'UGC Care', value: 'ugc' },
                    { label: 'Other', value: 'other' }
                ]
            }),
            createField({ key: 'impactFactor', label: 'Impact Factor', type: 'number', required: false }),
        ]
    },
    conference: {
        type: 'conference',
        label: 'Conference',
        shortLabel: 'CONF',
        pluralLabel: 'Conference Papers',
        icon: 'Users',
        color: 'text-blue-600 bg-blue-600/10',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        themeColor: 'blue',
        fields: [
            createField({ key: 'title', label: 'Paper Title', type: 'text', gridSpan: 2 }),
            createField({ key: 'conferenceName', label: 'Conference Name', type: 'text', gridSpan: 2 }),
            createField({ key: 'organizer', label: 'Organizer', type: 'text' }),
            createField({ key: 'location', label: 'Location', type: 'text' }),
            createField({ key: 'startDate', label: 'Start Date', type: 'date' }),
            createField({ key: 'endDate', label: 'End Date', type: 'date' }),
            createField({ key: 'authors', label: 'Authors', type: 'text' }),
            createField({
                key: 'presentationType',
                label: 'Presentation Type',
                type: 'select',
                options: [
                    { label: 'Oral', value: 'oral' },
                    { label: 'Poster', value: 'poster' },
                    { label: 'Keynote', value: 'keynote' },
                ]
            }),
            createField({ key: 'proceedingsLink', label: 'Proceedings Link', type: 'url', required: false }),
        ]
    },
    book: {
        type: 'book',
        label: 'Book/Chapter',
        shortLabel: 'BOOK',
        pluralLabel: 'Books & Chapters',
        icon: 'FileText',
        color: 'text-amber-600 bg-amber-600/10',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        themeColor: 'amber',
        fields: [
            createField({ key: 'title', label: 'Title', type: 'text', gridSpan: 2 }),
            createField({
                key: 'type',
                label: 'Type',
                type: 'select',
                options: [
                    { label: 'Authored Book', value: 'authored_book' },
                    { label: 'Edited Book', value: 'edited_book' },
                    { label: 'Book Chapter', value: 'chapter' },
                ]
            }),
            createField({ key: 'authors', label: 'Authors/Editors', type: 'text' }),
            createField({ key: 'publisher', label: 'Publisher', type: 'text' }),
            createField({ key: 'publicationYear', label: 'Year', type: 'number' }),
            createField({ key: 'isbn', label: 'ISBN', type: 'text' }),
            createField({ key: 'doi', label: 'DOI', type: 'url', required: false }),
        ]
    },
    ipr: {
        type: 'ipr',
        label: 'IPR',
        shortLabel: 'IPR',
        pluralLabel: 'IPR & Patents',
        icon: 'Lightbulb',
        color: 'text-sky-600 bg-sky-600/10',
        badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
        themeColor: 'sky',
        fields: [
            createField({ key: 'title', label: 'Title of Invention', type: 'text', gridSpan: 2 }),
            createField({ key: 'inventors', label: 'Inventors', type: 'text', gridSpan: 2 }),
            createField({ key: 'applicationNo', label: 'Application No.', type: 'text' }),
            createField({ key: 'filingDate', label: 'Filing Date', type: 'date' }),
            createField({
                key: 'status',
                label: 'Patent Status',
                type: 'select',
                options: [
                    { label: 'Filed', value: 'filed' },
                    { label: 'Published', value: 'published' },
                    { label: 'Granted', value: 'granted' },
                ]
            }),
            createField({ key: 'publicationDate', label: 'Publication Date', type: 'date', required: false }),
            createField({ key: 'grantDate', label: 'Grant Date', type: 'date', required: false }),
            createField({ key: 'patentNo', label: 'Patent No. (if granted)', type: 'text', required: false }),
        ]
    },
    award: {
        type: 'award',
        label: 'Award/Recognition',
        shortLabel: 'AWD',
        pluralLabel: 'Awards & Recognitions',
        icon: 'Trophy',
        color: 'text-rose-600 bg-rose-600/10',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        themeColor: 'rose',
        fields: [
            createField({ key: 'title', label: 'Award Name', type: 'text', gridSpan: 2 }),
            createField({ key: 'agency', label: 'Awarding Agency', type: 'text' }),
            createField({ key: 'date', label: 'Date', type: 'date' }),
            createField({ key: 'description', label: 'Description', type: 'textarea', gridSpan: 2 }),
        ]
    },
    consultancy: {
        type: 'consultancy',
        label: 'Consultancy',
        shortLabel: 'CONS',
        pluralLabel: 'Consultancy Projects',
        icon: 'Briefcase',
        color: 'text-violet-600 bg-violet-600/10',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        themeColor: 'emerald',
        fields: [
            createField({ key: 'title', label: 'Project Title', type: 'text', gridSpan: 2 }),
            createField({ key: 'client', label: 'Client Organization', type: 'text' }),
            createField({ key: 'amount', label: 'Amount (INR)', type: 'number' }),
            createField({ key: 'startDate', label: 'Start Date', type: 'date' }),
            createField({ key: 'endDate', label: 'End Date', type: 'date', required: false }),
            createField({
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                ]
            }),
        ]
    },
    phd_student: {
        type: 'phd_student',
        label: 'PhD Student',
        shortLabel: 'PHD',
        pluralLabel: 'PhD Students',
        icon: 'GraduationCap',
        color: 'text-emerald-600 bg-emerald-600/10',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        themeColor: 'emerald',
        fields: [
            createField({ key: 'name', label: 'Name of Student', type: 'text', gridSpan: 2 }),
            createField({ key: 'enrollmentNumber', label: 'Enrollment Number', type: 'text' }),
            createField({ key: 'phdStream', label: 'PhD Stream', type: 'text' }),
            createField({ key: 'supervisorType', label: 'Supervisor Type', type: 'text' }),
        ]
    },
    other: {
        type: 'other',
        label: 'Other',
        shortLabel: 'OTHR',
        pluralLabel: 'Other Activities',
        icon: 'MoreHorizontal',
        color: 'text-slate-600 bg-slate-600/10',
        badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        themeColor: 'slate',
        fields: [
            createField({ key: 'title', label: 'Title', type: 'text', gridSpan: 2 }),
            createField({ key: 'description', label: 'Description', type: 'textarea', gridSpan: 2 }),
            createField({ key: 'date', label: 'Date', type: 'date' }),
        ]
    }
}

// ============================================
// FILTER CONFIGURATIONS
// ============================================

export const COMMON_FILTERS: Record<string, FilterConfig[]> = {
    approval: [
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
                ...Object.values(RECORD_TYPE_CONFIG).map(config => ({
                    label: config.label,
                    value: config.type
                }))
            ]
        }
    ],
    user: [
        {
            key: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { label: 'All Roles', value: 'all' },
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }
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
    ],
    record: [
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
                ...Object.values(RECORD_TYPE_CONFIG).map(config => ({
                    label: config.label,
                    value: config.type
                }))
            ]
        }
    ]
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        case 'rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
}
