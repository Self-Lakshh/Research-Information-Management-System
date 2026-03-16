import { RecordType, ApprovalStatus, UserRole } from '@/@types/rims.types'


// ============================================
// FIELD CONFIGURATION TYPES
// ============================================

export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'date'
    | 'select'
    | 'multiselect'
    | 'file'
    | 'url'
    | 'user_select'

export interface FieldConfig {
    key: string
    label: string
    type: FieldType
    required?: boolean
    placeholder?: string
    options?: { label: string; value: string }[]
    gridSpan?: 1 | 2 // For form layout
    multiple?: boolean // For multi-select or multi-file
}

export interface FilterConfig {
    key: string
    label: string
    type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text'
    options?: { label: string; value: string }[]
    placeholder?: string
}

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
    multiple: false,
    ...field
})

// ============================================
// RECORD TYPE CONFIGURATIONS (SINGLE SOURCE OF TRUTH)
// ============================================

export const RECORD_TYPE_CONFIG: Record<RecordType, DomainConfig> = {
    ipr: {
        type: 'ipr',
        label: 'IPR Publications',
        shortLabel: 'IPR',
        pluralLabel: 'IPR Publications',
        icon: 'Lightbulb',
        color: 'text-sky-600 bg-sky-600/10',
        badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
        themeColor: 'sky',
        fields: [
            createField({ key: 'title', label: 'Title of Invention', type: 'text', gridSpan: 2 }),
            createField({ key: 'inventors', label: 'Inventors', type: 'user_select', gridSpan: 2, multiple: true }),
            createField({ key: 'application_no', label: 'Application No.', type: 'text' }),
            createField({ key: 'filing_date', label: 'Filing Date', type: 'date' }),
            createField({ key: 'applicants', label: 'Applicants', type: 'text', placeholder: 'Comma separated names' }),
            createField({ key: 'country', label: 'Country', type: 'text' }),
            createField({
                key: 'patent_type',
                label: 'Patent Type',
                type: 'select',
                options: [
                    { label: 'Design', value: 'design' },
                    { label: 'Utility', value: 'utility' },
                    { label: 'Patent', value: 'patent' },
                    { label: 'Ordinary', value: 'ordinary' },
                    { label: 'Copyright', value: 'copyright' }
                ]
            }),
            createField({
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { label: 'Registered', value: 'registered' },
                    { label: 'Granted', value: 'granted' },
                    { label: 'Published', value: 'published' }
                ]
            }),
            createField({ key: 'published_date', label: 'Published Date', type: 'date' }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false, multiple: true })
        ]
    },
    phd_student: {
        type: 'phd_student',
        label: 'PhD Student Data',
        shortLabel: 'PHD',
        pluralLabel: 'PhD Student Records',
        icon: 'GraduationCap',
        color: 'text-emerald-600 bg-emerald-600/10',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        themeColor: 'emerald',
        fields: [
            createField({ key: 'name_of_student', label: 'Name of Student', type: 'text', gridSpan: 2 }),
            createField({ key: 'faculty_ref', label: 'Faculty / Supervisor', type: 'user_select', gridSpan: 2 }),
            createField({
                key: 'supervisor_type',
                label: 'Supervisor Type',
                type: 'select',
                options: [
                    { label: 'Major Advisor', value: 'major_advisor' },
                    { label: 'Advisor', value: 'advisor' }
                ]
            }),
            createField({ key: 'enrollment_number', label: 'Enrollment Number', type: 'text' }),
            createField({ key: 'phd_stream', label: 'PhD Stream', type: 'text' }),
            createField({ key: 'file', label: 'Supporting Document', type: 'file', required: false, multiple: true })
        ]
    },
    journal: {
        type: 'journal',
        label: 'Journal Publication',
        shortLabel: 'JRN',
        pluralLabel: 'Journal Publications',
        icon: 'BookOpen',
        color: 'text-indigo-600 bg-indigo-600/10',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        themeColor: 'indigo',
        fields: [
            createField({ key: 'title_of_paper', label: 'Title of Paper', type: 'text', gridSpan: 2 }),
            createField({ key: 'authors', label: 'Authors', type: 'user_select', gridSpan: 2, multiple: true }),
            createField({ key: 'journal_name', label: 'Journal Name', type: 'text', gridSpan: 2 }),
            createField({
                key: 'journal_type',
                label: 'Journal Type',
                type: 'select',
                options: [
                    { label: 'SCI', value: 'sci' },
                    { label: 'Scopus', value: 'scopus' },
                    { label: 'Web of Science', value: 'web_of_science' },
                    { label: 'ESCI', value: 'esci' }
                ]
            }),
            createField({ key: 'isbn_issn_number', label: 'ISSN Number', type: 'text' }),
            createField({ key: 'date_of_publication', label: 'Date of Publication', type: 'date' }),
            createField({ key: 'web_link', label: 'Web Link', type: 'url', required: false }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false, multiple: true })
        ]
    },
    conference: {
        type: 'conference',
        label: 'Conference Paper',
        shortLabel: 'CONF',
        pluralLabel: 'Conference Papers',
        icon: 'Users',
        color: 'text-blue-600 bg-blue-600/10',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        themeColor: 'blue',
        fields: [
            createField({ key: 'title_of_paper', label: 'Title of Paper', type: 'text', gridSpan: 2 }),
            createField({ key: 'authors', label: 'Authors', type: 'user_select', gridSpan: 2, multiple: true }),
            createField({ key: 'title_of_proceedings', label: 'Title of Proceedings', type: 'text', gridSpan: 2 }),
            createField({ key: 'name_of_conference', label: 'Name of Conference', type: 'text', gridSpan: 2 }),
            createField({
                key: 'origin',
                label: 'Conference Origin',
                type: 'select',
                options: [
                    { label: 'National', value: 'national' },
                    { label: 'International', value: 'international' }
                ]
            }),
            createField({ key: 'year_of_publication', label: 'Year of Publication', type: 'text' }),
            createField({ key: 'isbn_issn_number', label: 'ISBN/ISSN Number', type: 'text' }),
            createField({ key: 'name_of_publisher', label: 'Name of Publisher', type: 'text' }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false, multiple: true })
        ]
    },
    book: {
        type: 'book',
        label: 'Book Publication',
        shortLabel: 'BOOK',
        pluralLabel: 'Book Publications',
        icon: 'FileText',
        color: 'text-amber-600 bg-amber-600/10',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        themeColor: 'amber',
        fields: [
            createField({ key: 'title_of_book', label: 'Title of Book', type: 'text', gridSpan: 2 }),
            createField({ key: 'authors', label: 'Authors', type: 'user_select', gridSpan: 2, multiple: true }),
            createField({ key: 'publisher_name', label: 'Publisher Name', type: 'text' }),
            createField({ key: 'isbn_number', label: 'ISBN Number', type: 'text' }),
            createField({ key: 'date_of_publication', label: 'Date of Publication', type: 'date' }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false })
        ]
    },
    consultancy: {
        type: 'consultancy',
        label: 'Consultancy & Grants',
        shortLabel: 'CONS',
        pluralLabel: 'Consultancy Projects',
        icon: 'Briefcase',
        color: 'text-violet-600 bg-violet-600/10',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        themeColor: 'emerald',
        fields: [
            createField({ key: 'project_title', label: 'Project Title', type: 'text', gridSpan: 2 }),
            createField({ key: 'principal_investigator_ref', label: 'Principal Investigator', type: 'user_select', gridSpan: 2 }),
            createField({ key: 'co_investigators_refs', label: 'Co-Investigators', type: 'user_select', gridSpan: 2, multiple: true }),
            createField({ key: 'organization', label: 'Organization', type: 'text' }),
            createField({ key: 'organization_url', label: 'Organization URL', type: 'url', required: false }),
            createField({ key: 'amount', label: 'Amount', type: 'number' }),
            createField({ key: 'institution', label: 'Institution', type: 'text' }),
            createField({ key: 'duration', label: 'Duration', type: 'text' }),
            createField({ key: 'grant_date', label: 'Grant Date', type: 'date' }),
            createField({
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' }
                ]
            }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false, multiple: true })
        ]
    },
    award: {
        type: 'award',
        label: 'Awards & Recognition',
        shortLabel: 'AWD',
        pluralLabel: 'Awards & Recognitions',
        icon: 'Trophy',
        color: 'text-rose-600 bg-rose-600/10',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        themeColor: 'rose',
        fields: [
            createField({ key: 'award_name', label: 'Award Name', type: 'text', gridSpan: 2 }),
            createField({ key: 'title', label: 'Title / Purpose', type: 'text', gridSpan: 2 }),
            createField({ key: 'recipient_ref', label: 'Recipient', type: 'user_select', gridSpan: 2 }),
            createField({ key: 'institution_body', label: 'Institution / Body', type: 'text' }),
            createField({ key: 'country', label: 'Country', type: 'text' }),
            createField({ key: 'month_year', label: 'Month & Year', type: 'text', placeholder: 'e.g. March 2024' }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false, multiple: true })
        ]
    },
    other: {
        type: 'other',
        label: 'Other Activities',
        shortLabel: 'OTHR',
        pluralLabel: 'Other Activities',
        icon: 'MoreHorizontal',
        color: 'text-slate-600 bg-slate-600/10',
        badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        themeColor: 'slate',
        fields: [
            createField({
                key: 'type',
                label: 'Activity Type',
                type: 'select',
                options: [
                    { label: 'FDP', value: 'fdp' },
                    { label: 'Seminar', value: 'seminar' },
                    { label: 'Workshop', value: 'workshop' },
                    { label: 'Keynote Speaker', value: 'keynote_speaker' }
                ]
            }),
            createField({ key: 'topic_title', label: 'Topic / Title', type: 'text', gridSpan: 2 }),
            createField({ key: 'organization', label: 'Organization', type: 'text' }),
            createField({ key: 'role', label: 'Role', type: 'text' }),
            createField({ key: 'date', label: 'Date', type: 'date' }),
            createField({ key: 'involved_faculty_refs', label: 'Involved Faculty', type: 'user_select', gridSpan: 2, multiple: true }),
            createField({ key: 'file', label: 'Supporting Documents', type: 'file', required: false, multiple: true })
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
