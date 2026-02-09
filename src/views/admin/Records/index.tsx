import { useState } from 'react'
import { Eye, Download, MoreHorizontal } from 'lucide-react'
import {
    DataTable,
    FilterBar,
    RecordDetailModal,
} from '@/components/admin'
import { recordFilters } from '@/configs/admin.config'
import type { ResearchRecord, RecordType, ApprovalStatus } from '@/@types/admin'
import { useAdminUI } from '@/utils/hooks/useAdminUI'

// ============================================
// MOCK DATA
// ============================================

const mockRecords: ResearchRecord[] = [
    {
        id: '1',
        title: 'Machine Learning Approaches for Predictive Analytics in Healthcare',
        type: 'journal',
        author: 'Dr. Rajesh Kumar',
        authorId: '1',
        domain: 'Computer Science',
        date: '2024-01-15',
        year: 2024,
        status: 'approved',
        description: 'This paper presents novel machine learning approaches for predictive analytics in healthcare systems.',
        submittedAt: '2024-01-10',
        updatedAt: '2024-01-15',
        data: {
            journalName: 'IEEE Transactions on Medical Imaging',
            issn: '0278-0062',
            volume: '43',
            issue: '2',
            pages: '245-258',
            impactFactor: 10.6,
            doi: 'https://doi.org/10.1109/TMI.2024.001'
        }
    },
    {
        id: '2',
        title: 'Patent for IoT-based Smart Agriculture System',
        type: 'ipr',
        author: 'Dr. Priya Sharma',
        authorId: '2',
        domain: 'Electronics',
        date: '2024-02-20',
        year: 2024,
        status: 'pending',
        description: 'An innovative IoT-based system for monitoring and automating agricultural processes.',
        submittedAt: '2024-02-18',
        updatedAt: '2024-02-20',
        data: {
            patentNumber: 'IN202411001234',
            filingDate: '2024-02-01',
            status: 'filed',
            inventors: 'Dr. Priya Sharma, Mr. Anil Kumar'
        }
    },
    {
        id: '3',
        title: 'Deep Learning for Autonomous Vehicle Navigation',
        type: 'conference',
        author: 'Dr. Amit Patel',
        authorId: '3',
        domain: 'Computer Science',
        date: '2023-11-10',
        year: 2023,
        status: 'approved',
        description: 'Conference paper on advanced deep learning techniques for self-driving cars.',
        submittedAt: '2023-10-20',
        updatedAt: '2023-11-10',
        data: {
            conferenceName: 'IEEE International Conference on Autonomous Systems',
            location: 'Tokyo, Japan',
            conferenceDate: '2023-11-08',
            conferenceType: 'international',
            pages: '120-128'
        }
    },
    {
        id: '4',
        title: 'Fundamentals of Renewable Energy Systems',
        type: 'book',
        author: 'Dr. Sunita Verma',
        authorId: '4',
        domain: 'Mechanical',
        date: '2023-06-01',
        year: 2023,
        status: 'approved',
        description: 'A comprehensive textbook covering all aspects of renewable energy technologies.',
        submittedAt: '2023-05-15',
        updatedAt: '2023-06-01',
        data: {
            publisher: 'McGraw-Hill Education',
            isbn: '978-0-07-123456-7',
            edition: '1st',
            pages: 450,
            bookType: 'authored'
        }
    },
    {
        id: '5',
        title: 'Best Research Paper Award - National Conference',
        type: 'award',
        author: 'Dr. Rajesh Kumar',
        authorId: '1',
        domain: 'Computer Science',
        date: '2024-03-05',
        year: 2024,
        status: 'pending',
        description: 'Received best paper award for research on AI in education.',
        submittedAt: '2024-03-06',
        updatedAt: '2024-03-06',
        data: {
            awardName: 'Best Research Paper Award',
            awardingBody: 'Computer Society of India',
            awardDate: '2024-03-05',
            awardLevel: 'national'
        }
    }
]

// ============================================
// RECORDS PAGE
// ============================================

const Records = () => {
    const [records] = useState<ResearchRecord[]>(mockRecords)
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const [selectedRecord, setSelectedRecord] = useState<ResearchRecord | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const { StatusBadge, RecordTypeBadge } = useAdminUI()

    const handleFilterChange = (key: string, value: unknown) => {
        setFilters((prev: Record<string, unknown>) => ({ ...prev, [key]: value }))
    }

    const handleClearFilters = () => {
        setFilters({})
    }

    const handleViewRecord = (record: ResearchRecord) => {
        setSelectedRecord(record)
        setIsDetailOpen(true)
    }

    const columns = [
        {
            key: 'title',
            label: 'Title',
            width: '35%',
            render: (value: unknown, row: ResearchRecord) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                        {row.title}
                    </p>
                    <div className="flex items-center gap-2">
                        <RecordTypeBadge type={row.type} />
                    </div>
                </div>
            )
        },
        {
            key: 'author',
            label: 'Author',
            render: (value: unknown) => (
                <span className="text-sm text-foreground">{value as string}</span>
            )
        },
        {
            key: 'domain',
            label: 'Domain',
            render: (value: unknown) => (
                <span className="text-sm text-muted-foreground">{value as string}</span>
            )
        },
        {
            key: 'year',
            label: 'Year',
            align: 'center' as const,
            render: (value: unknown) => (
                <span className="text-sm text-muted-foreground tabular-nums">
                    {value as number}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: unknown) => (
                <StatusBadge status={value as ApprovalStatus} />
            )
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Records</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Browse and manage all research records
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            {/* Filters */}
            <FilterBar
                filters={recordFilters}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Records Table */}
            <DataTable
                columns={columns}
                data={records}
                onRowClick={handleViewRecord}
                rowActions={(row: ResearchRecord) => [
                    {
                        label: 'View Details',
                        onClick: () => handleViewRecord(row),
                        icon: <Eye className="w-4 h-4" />
                    },
                    {
                        label: 'Download',
                        onClick: () => console.log('Download:', row.id),
                        icon: <Download className="w-4 h-4" />
                    }
                ]}
            />

            {/* Record Detail Modal */}
            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                record={selectedRecord}
            />
        </div>
    )
}

export default Records
