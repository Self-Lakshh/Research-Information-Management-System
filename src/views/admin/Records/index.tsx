import { useState } from 'react'
import { Download, Plus, LayoutGrid, List } from 'lucide-react'
import {
    FilterBar,
} from '@/components/admin'
import {
    RecordTable,
    RecordDetailModal,
    RecordFormModal,
    RecordCard
} from '@/components/common'
import { recordFilters } from '@/configs/admin.config'
import { cn } from '@/components/shadcn/utils'
import type { ResearchRecord } from '@/@types/admin'

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
    const [records, setRecords] = useState<any[]>(mockRecords)
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleFilterChange = (key: string, value: unknown) => {
        setFilters((prev: Record<string, unknown>) => ({ ...prev, [key]: value }))
    }

    const handleClearFilters = () => {
        setFilters({})
    }

    const handleViewRecord = (record: any) => {
        setSelectedRecord(record)
        setIsDetailOpen(true)
    }

    const handleEditRecord = (record: any) => {
        setSelectedRecord(record)
        setIsEditOpen(true)
    }

    const handleDeleteRecord = (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            setRecords(prev => prev.filter(r => r.id !== id))
        }
    }

    const handleFormSubmit = (data: any) => {
        setRecords(prev => prev.map(r => r.id === selectedRecord.id ? { ...r, ...data } : r))
        setIsEditOpen(false)
    }

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
                <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-muted/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                                viewMode === 'grid'
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                                viewMode === 'table'
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List className="w-3.5 h-3.5" />
                            Table
                        </button>
                    </div>

                    <div className="h-8 w-px bg-muted/50" />

                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-muted/50 border border-muted/50 hover:bg-muted text-foreground transition-all duration-300">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <FilterBar
                filters={recordFilters}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Records Content */}
            {viewMode === 'table' ? (
                <RecordTable
                    records={records}
                    selectedDomain="all"
                    onView={handleViewRecord}
                    onEdit={handleEditRecord}
                    onDelete={handleDeleteRecord}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records.map((record) => (
                        <RecordCard
                            key={record.id}
                            record={record}
                            onView={handleViewRecord}
                            onEdit={handleEditRecord}
                            onDelete={(id) => handleDeleteRecord(id)}
                        />
                    ))}
                </div>
            )}

            {/* Record Detail Modal */}
            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                record={selectedRecord}
            />

            {/* Record Form Modal */}
            {selectedRecord && (
                <RecordFormModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    type={selectedRecord.type || selectedRecord.category}
                    initialData={selectedRecord}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    )
}

export default Records
