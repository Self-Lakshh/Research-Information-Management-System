import { RecordTypeConfig, RecordType } from '@/@types/admin'
import {
    BookOpen,
    Users,
    FileText,
    Lightbulb,
    Trophy,
    Briefcase,
    Banknote,
    MoreHorizontal
} from 'lucide-react'

// Helper function to create standard field config
const createFieldConfig = (field: any) => ({
    required: true,
    gridSpan: 1 as const,
    ...field
})

export const SUBMISSION_TYPES: Record<string, RecordTypeConfig> = {
    journal: {
        type: 'journal',
        label: 'Journal publications',
        pluralLabel: 'Journal Publications',
        icon: 'BookOpen',
        color: 'text-indigo-600 bg-indigo-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Paper Title', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'journalName', label: 'Journal Name', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'authors', label: 'Authors', type: 'text', placeholder: 'Separate with commas' }),
            createFieldConfig({ key: 'publicationDate', label: 'Publication Date', type: 'date' }),
            createFieldConfig({ key: 'volume', label: 'Volume', type: 'text', required: false }),
            createFieldConfig({ key: 'issue', label: 'Issue', type: 'text', required: false }),
            createFieldConfig({ key: 'pages', label: 'Pages', type: 'text', required: false }),
            createFieldConfig({ key: 'publisher', label: 'Publisher', type: 'text' }),
            createFieldConfig({ key: 'doi', label: 'DOI', type: 'url', required: false }),
            createFieldConfig({ key: 'link', label: 'Link to Paper', type: 'url', required: false }),
            createFieldConfig({
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
            createFieldConfig({ key: 'impactFactor', label: 'Impact Factor', type: 'number', required: false }),
        ]
    },
    conference: {
        type: 'conference',
        label: 'Conference Paper',
        pluralLabel: 'Conference Papers',
        icon: 'Users',
        color: 'text-blue-600 bg-blue-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Paper Title', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'conferenceName', label: 'Conference Name', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'organizer', label: 'Organizer', type: 'text' }),
            createFieldConfig({ key: 'location', label: 'Location', type: 'text' }),
            createFieldConfig({ key: 'startDate', label: 'Start Date', type: 'date' }),
            createFieldConfig({ key: 'endDate', label: 'End Date', type: 'date' }),
            createFieldConfig({ key: 'authors', label: 'Authors', type: 'text' }),
            createFieldConfig({
                key: 'presentationType',
                label: 'Presentation Type',
                type: 'select',
                options: [
                    { label: 'Oral', value: 'oral' },
                    { label: 'Poster', value: 'poster' },
                    { label: 'Keynote', value: 'keynote' },
                ]
            }),
            createFieldConfig({ key: 'proceedingsLink', label: 'Proceedings Link', type: 'url', required: false }),
        ]
    },
    book: {
        type: 'book',
        label: 'Book / Chapter',
        pluralLabel: 'Books & Chapters',
        icon: 'FileText',
        color: 'text-emerald-600 bg-emerald-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Title', type: 'text', gridSpan: 2 }),
            createFieldConfig({
                key: 'type',
                label: 'Type',
                type: 'select',
                options: [
                    { label: 'Authored Book', value: 'authored_book' },
                    { label: 'Edited Book', value: 'edited_book' },
                    { label: 'Book Chapter', value: 'chapter' },
                ]
            }),
            createFieldConfig({ key: 'authors', label: 'Authors/Editors', type: 'text' }),
            createFieldConfig({ key: 'publisher', label: 'Publisher', type: 'text' }),
            createFieldConfig({ key: 'publicationYear', label: 'Year', type: 'number' }),
            createFieldConfig({ key: 'isbn', label: 'ISBN', type: 'text' }),
            createFieldConfig({ key: 'doi', label: 'DOI', type: 'url', required: false }),
        ]
    },
    ipr: {
        type: 'ipr',
        label: 'IPR / Patent',
        pluralLabel: 'IPR & Patents',
        icon: 'Lightbulb',
        color: 'text-amber-600 bg-amber-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Title of Invention', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'inventors', label: 'Inventors', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'applicationNo', label: 'Application No.', type: 'text' }),
            createFieldConfig({ key: 'filingDate', label: 'Filing Date', type: 'date' }),
            createFieldConfig({
                key: 'status',
                label: 'Patent Status',
                type: 'select',
                options: [
                    { label: 'Filed', value: 'filed' },
                    { label: 'Published', value: 'published' },
                    { label: 'Granted', value: 'granted' },
                ]
            }),
            createFieldConfig({ key: 'publicationDate', label: 'Publication Date', type: 'date', required: false }),
            createFieldConfig({ key: 'grantDate', label: 'Grant Date', type: 'date', required: false }),
            createFieldConfig({ key: 'patentNo', label: 'Patent No. (if granted)', type: 'text', required: false }),
        ]
    },
    award: {
        type: 'award',
        label: 'Award / Recognition',
        pluralLabel: 'Awards & Recognitions',
        icon: 'Trophy',
        color: 'text-rose-600 bg-rose-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Award Name', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'agency', label: 'Awarding Agency', type: 'text' }),
            createFieldConfig({ key: 'date', label: 'Date', type: 'date' }),
            createFieldConfig({ key: 'description', label: 'Description', type: 'textarea', gridSpan: 2 }),
        ]
    },
    consultancy: {
        type: 'consultancy',
        label: 'Consultancy',
        pluralLabel: 'Consultancy Projects',
        icon: 'Briefcase',
        color: 'text-violet-600 bg-violet-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Project Title', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'client', label: 'Client Organization', type: 'text' }),
            createFieldConfig({ key: 'amount', label: 'Amount (INR)', type: 'number' }),
            createFieldConfig({ key: 'startDate', label: 'Start Date', type: 'date' }),
            createFieldConfig({ key: 'endDate', label: 'End Date', type: 'date', required: false }),
            createFieldConfig({
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
    grant: {
        type: 'grant',
        label: 'Research Grant',
        pluralLabel: 'Research Grants',
        icon: 'Banknote',
        color: 'text-teal-600 bg-teal-600/10',
        fields: [
            createFieldConfig({ key: 'title', label: 'Project Title', type: 'text', gridSpan: 2 }),
            createFieldConfig({ key: 'agency', label: 'Funding Agency', type: 'text' }),
            createFieldConfig({ key: 'amount', label: 'Amount (INR)', type: 'number' }),
            createFieldConfig({ key: 'startDate', label: 'Start Date', type: 'date' }),
            createFieldConfig({ key: 'endDate', label: 'End Date', type: 'date' }),
            createFieldConfig({ key: 'pi', label: 'Principal Investigator', type: 'text' }),
            createFieldConfig({ key: 'coPi', label: 'Co-PI(s)', type: 'text', required: false }),
            createFieldConfig({
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { label: 'Submitted', value: 'submitted' },
                    { label: 'Sanctioned', value: 'sanctioned' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Rejected', value: 'rejected' },
                ]
            }),
        ]
    },
}

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        case 'rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
}
