import type { FieldConfig, RecordType } from '../types'

// ============================================
// COMMON FIELDS (shared across record types)
// ============================================

const commonFields: FieldConfig[] = [
    {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Enter title',
        gridSpan: 2
    },
    {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter description',
        gridSpan: 2
    },
    {
        key: 'domain',
        label: 'Domain',
        type: 'select',
        required: true,
        options: [
            { label: 'Computer Science', value: 'cs' },
            { label: 'Electronics', value: 'ece' },
            { label: 'Mechanical', value: 'mech' },
            { label: 'Civil', value: 'civil' },
            { label: 'Biotechnology', value: 'biotech' },
            { label: 'Management', value: 'mgmt' },
            { label: 'Other', value: 'other' }
        ]
    },
    {
        key: 'year',
        label: 'Year',
        type: 'number',
        required: true,
        placeholder: 'YYYY'
    }
]

// ============================================
// RECORD TYPE SPECIFIC FIELDS
// ============================================

export const recordFieldConfig: Record<RecordType, FieldConfig[]> = {
    ipr: [
        ...commonFields,
        {
            key: 'patentNumber',
            label: 'Patent/IPR Number',
            type: 'text',
            required: true,
            placeholder: 'e.g., IN202311XXXXXX'
        },
        {
            key: 'filingDate',
            label: 'Filing Date',
            type: 'date',
            required: true
        },
        {
            key: 'status',
            label: 'IPR Status',
            type: 'select',
            required: true,
            options: [
                { label: 'Filed', value: 'filed' },
                { label: 'Published', value: 'published' },
                { label: 'Granted', value: 'granted' },
                { label: 'Rejected', value: 'rejected' }
            ]
        },
        {
            key: 'inventors',
            label: 'Inventors',
            type: 'text',
            required: true,
            placeholder: 'Comma-separated names',
            gridSpan: 2
        }
    ],

    journal: [
        ...commonFields,
        {
            key: 'journalName',
            label: 'Journal Name',
            type: 'text',
            required: true,
            placeholder: 'Enter journal name',
            gridSpan: 2
        },
        {
            key: 'issn',
            label: 'ISSN',
            type: 'text',
            placeholder: 'XXXX-XXXX'
        },
        {
            key: 'volume',
            label: 'Volume',
            type: 'text',
            placeholder: 'e.g., 12'
        },
        {
            key: 'issue',
            label: 'Issue',
            type: 'text',
            placeholder: 'e.g., 3'
        },
        {
            key: 'pages',
            label: 'Pages',
            type: 'text',
            placeholder: 'e.g., 45-52'
        },
        {
            key: 'impactFactor',
            label: 'Impact Factor',
            type: 'number',
            placeholder: 'e.g., 3.5'
        },
        {
            key: 'indexing',
            label: 'Indexing',
            type: 'multiselect',
            options: [
                { label: 'SCI', value: 'sci' },
                { label: 'SCIE', value: 'scie' },
                { label: 'Scopus', value: 'scopus' },
                { label: 'Web of Science', value: 'wos' },
                { label: 'UGC Care', value: 'ugc' }
            ]
        },
        {
            key: 'doi',
            label: 'DOI',
            type: 'url',
            placeholder: 'https://doi.org/...'
        }
    ],

    conference: [
        ...commonFields,
        {
            key: 'conferenceName',
            label: 'Conference Name',
            type: 'text',
            required: true,
            placeholder: 'Enter conference name',
            gridSpan: 2
        },
        {
            key: 'location',
            label: 'Location',
            type: 'text',
            placeholder: 'City, Country'
        },
        {
            key: 'conferenceDate',
            label: 'Conference Date',
            type: 'date',
            required: true
        },
        {
            key: 'conferenceType',
            label: 'Conference Type',
            type: 'select',
            options: [
                { label: 'International', value: 'international' },
                { label: 'National', value: 'national' },
                { label: 'Regional', value: 'regional' }
            ]
        },
        {
            key: 'isbn',
            label: 'ISBN',
            type: 'text',
            placeholder: 'ISBN number'
        },
        {
            key: 'pages',
            label: 'Pages',
            type: 'text',
            placeholder: 'e.g., 120-128'
        },
        {
            key: 'doi',
            label: 'DOI',
            type: 'url',
            placeholder: 'https://doi.org/...'
        }
    ],

    book: [
        ...commonFields,
        {
            key: 'publisher',
            label: 'Publisher',
            type: 'text',
            required: true,
            placeholder: 'Publisher name'
        },
        {
            key: 'isbn',
            label: 'ISBN',
            type: 'text',
            required: true,
            placeholder: 'ISBN number'
        },
        {
            key: 'edition',
            label: 'Edition',
            type: 'text',
            placeholder: 'e.g., 1st, 2nd'
        },
        {
            key: 'pages',
            label: 'Total Pages',
            type: 'number',
            placeholder: 'Number of pages'
        },
        {
            key: 'bookType',
            label: 'Type',
            type: 'select',
            options: [
                { label: 'Authored Book', value: 'authored' },
                { label: 'Edited Book', value: 'edited' },
                { label: 'Book Chapter', value: 'chapter' }
            ]
        },
        {
            key: 'coAuthors',
            label: 'Co-Authors',
            type: 'text',
            placeholder: 'Comma-separated names',
            gridSpan: 2
        }
    ],

    award: [
        ...commonFields,
        {
            key: 'awardName',
            label: 'Award Name',
            type: 'text',
            required: true,
            placeholder: 'Name of the award',
            gridSpan: 2
        },
        {
            key: 'awardingBody',
            label: 'Awarding Body',
            type: 'text',
            required: true,
            placeholder: 'Organization name'
        },
        {
            key: 'awardDate',
            label: 'Award Date',
            type: 'date',
            required: true
        },
        {
            key: 'awardLevel',
            label: 'Level',
            type: 'select',
            options: [
                { label: 'International', value: 'international' },
                { label: 'National', value: 'national' },
                { label: 'State', value: 'state' },
                { label: 'University', value: 'university' }
            ]
        },
        {
            key: 'prizeAmount',
            label: 'Prize Amount (if any)',
            type: 'number',
            placeholder: 'Amount in INR'
        }
    ],

    consultancy: [
        ...commonFields,
        {
            key: 'clientName',
            label: 'Client/Organization',
            type: 'text',
            required: true,
            placeholder: 'Client name',
            gridSpan: 2
        },
        {
            key: 'projectTitle',
            label: 'Project Title',
            type: 'text',
            required: true,
            placeholder: 'Project title',
            gridSpan: 2
        },
        {
            key: 'startDate',
            label: 'Start Date',
            type: 'date',
            required: true
        },
        {
            key: 'endDate',
            label: 'End Date',
            type: 'date'
        },
        {
            key: 'amount',
            label: 'Consultancy Amount',
            type: 'number',
            required: true,
            placeholder: 'Amount in INR'
        },
        {
            key: 'status',
            label: 'Project Status',
            type: 'select',
            options: [
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Completed', value: 'completed' }
            ]
        }
    ],

    grant: [
        ...commonFields,
        {
            key: 'fundingAgency',
            label: 'Funding Agency',
            type: 'text',
            required: true,
            placeholder: 'e.g., DST, AICTE, UGC',
            gridSpan: 2
        },
        {
            key: 'projectTitle',
            label: 'Project Title',
            type: 'text',
            required: true,
            placeholder: 'Project title',
            gridSpan: 2
        },
        {
            key: 'sanctionNumber',
            label: 'Sanction Number',
            type: 'text',
            required: true,
            placeholder: 'Sanction/Grant number'
        },
        {
            key: 'sanctionDate',
            label: 'Sanction Date',
            type: 'date',
            required: true
        },
        {
            key: 'duration',
            label: 'Duration (months)',
            type: 'number',
            placeholder: 'e.g., 36'
        },
        {
            key: 'amount',
            label: 'Grant Amount',
            type: 'number',
            required: true,
            placeholder: 'Amount in INR'
        },
        {
            key: 'status',
            label: 'Grant Status',
            type: 'select',
            options: [
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Closed', value: 'closed' }
            ]
        },
        {
            key: 'coInvestigators',
            label: 'Co-Investigators',
            type: 'text',
            placeholder: 'Comma-separated names',
            gridSpan: 2
        }
    ],

    other: [
        ...commonFields,
        {
            key: 'category',
            label: 'Category',
            type: 'text',
            required: true,
            placeholder: 'Type of activity'
        },
        {
            key: 'details',
            label: 'Details',
            type: 'textarea',
            gridSpan: 2,
            placeholder: 'Provide additional details'
        },
        {
            key: 'supportingDocument',
            label: 'Supporting Document',
            type: 'file'
        }
    ]
}

export default recordFieldConfig
