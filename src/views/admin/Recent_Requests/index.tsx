import { useState } from 'react'
import { CheckCircle, XCircle, LayoutGrid, List } from 'lucide-react'
import {
    FilterBar,
    ConfirmDialog,
} from '@/components/admin'
import {
    RecordTable,
    RecordDetailModal,
    RecordCard
} from '@/components/common'
import { approvalFilters } from '@/configs/admin.config'
import { cn } from '@/components/shadcn/utils'
import type { ApprovalRequest, ResearchRecord, User } from '@/@types/admin'

// ============================================
// MOCK DATA
// ============================================

const mockUser: User = {
    id: '1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@university.edu',
    user_role: 'user',
    faculty: 'Electronics',
    created_at: '2021-08-20',
    status: 'active'
}

const mockRequests: ApprovalRequest[] = [
    {
        id: '1',
        recordId: '101',
        record: {
            id: '101',
            title: 'Novel Approach to Quantum Computing Using Superconducting Qubits',
            type: 'journal',
            author: 'Dr. Priya Sharma',
            authorId: '1',
            domain: 'Computer Science',
            date: '2024-01-20',
            year: 2024,
            status: 'pending',
            description: 'This research presents a breakthrough in quantum computing architecture using superconducting qubit arrays.',
            submittedAt: '2024-01-18',
            updatedAt: '2024-01-20',
            data: {
                journalName: 'Nature Physics',
                issn: '1745-2473',
                impactFactor: 19.6
            }
        },
        submittedBy: mockUser,
        submittedAt: '2024-01-18T10:30:00',
        status: 'pending'
    },
    {
        id: '2',
        recordId: '102',
        record: {
            id: '102',
            title: 'Patent Application: AI-Powered Medical Diagnostic Tool',
            type: 'ipr',
            author: 'Dr. Amit Patel',
            authorId: '3',
            domain: 'Biotechnology',
            date: '2024-01-22',
            year: 2024,
            status: 'pending',
            description: 'An artificial intelligence system for rapid diagnosis of infectious diseases from blood samples.',
            submittedAt: '2024-01-21',
            updatedAt: '2024-01-22',
            data: {
                patentNumber: 'IN202411002345',
                filingDate: '2024-01-15',
                status: 'filed'
            }
        },
        submittedBy: { ...mockUser, id: '3', name: 'Dr. Amit Patel' },
        submittedAt: '2024-01-21T14:15:00',
        status: 'pending'
    },
    {
        id: '3',
        recordId: '103',
        record: {
            id: '103',
            title: 'DST-SERB Research Grant for Climate Change Study',
            type: 'grant',
            author: 'Dr. Sunita Verma',
            authorId: '4',
            domain: 'Civil',
            date: '2024-01-25',
            year: 2024,
            status: 'pending',
            description: 'Funded research project studying the impact of climate change on coastal infrastructure.',
            submittedAt: '2024-01-24',
            updatedAt: '2024-01-25',
            data: {
                fundingAgency: 'DST-SERB',
                amount: 4500000,
                duration: 36
            }
        },
        submittedBy: { ...mockUser, id: '4', name: 'Dr. Sunita Verma' },
        submittedAt: '2024-01-24T09:00:00',
        status: 'pending'
    },
    {
        id: '4',
        recordId: '104',
        record: {
            id: '104',
            title: 'Best Paper Award at IEEE Conference 2024',
            type: 'award',
            author: 'Dr. Rajesh Kumar',
            authorId: '1',
            domain: 'Computer Science',
            date: '2024-01-28',
            year: 2024,
            status: 'pending',
            description: 'Recognition for outstanding research contribution in artificial intelligence.',
            submittedAt: '2024-01-27',
            updatedAt: '2024-01-28',
            data: {
                awardName: 'Best Paper Award',
                awardingBody: 'IEEE Computer Society',
                awardLevel: 'international'
            }
        },
        submittedBy: { ...mockUser, id: '1', name: 'Dr. Rajesh Kumar' },
        submittedAt: '2024-01-27T16:45:00',
        status: 'pending'
    }
]

// ============================================
// RECENT REQUESTS PAGE
// ============================================

const RecentRequests = () => {
    const [requests] = useState<ApprovalRequest[]>(mockRequests)
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [selectedRecord, setSelectedRecord] = useState<ResearchRecord | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean
        type: 'approve' | 'reject'
        requestId: string | null
    }>({
        isOpen: false,
        type: 'approve',
        requestId: null
    })

    const handleFilterChange = (key: string, value: unknown) => {
        setFilters((prev: Record<string, unknown>) => ({ ...prev, [key]: value }))
    }

    const handleClearFilters = () => {
        setFilters({})
    }

    const handleApprove = (id: string) => {
        setActionDialog({ isOpen: true, type: 'approve', requestId: id })
    }

    const handleReject = (id: string) => {
        setActionDialog({ isOpen: true, type: 'reject', requestId: id })
    }

    const handleView = (record: any) => {
        setSelectedRecord(record)
        setIsDetailOpen(true)
    }

    const handleConfirmAction = () => {
        console.log(
            `${actionDialog.type} request:`,
            actionDialog.requestId
        )
        setActionDialog({ isOpen: false, type: 'approve', requestId: null })
        // TODO: API call to approve/reject
    }

    const pendingCount = requests.filter((r) => r.status === 'pending').length

    // Records formatted for table/card view
    const records = requests.map(req => ({
        ...req.record,
        id: req.record.id,
        requestId: req.id,
        submittedBy: req.submittedBy,
        requestedAt: req.submittedAt
    }))

    const approvalActions = [
        {
            label: 'Approve Request',
            onClick: (record: any) => handleApprove(record.requestId),
            icon: <CheckCircle className="w-4 h-4" />,
            variant: 'success' as const
        },
        {
            label: 'Reject Request',
            onClick: (record: any) => handleReject(record.requestId),
            icon: <XCircle className="w-4 h-4" />,
            variant: 'danger' as const
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Recent Requests
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''} require your attention
                    </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-muted/50">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300',
                            viewMode === 'grid'
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Cards
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300',
                            viewMode === 'table'
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <List className="w-3.5 h-3.5" />
                        Table
                    </button>
                </div>
            </div>

            {/* Filters */}
            <FilterBar
                filters={approvalFilters}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Requests Content */}
            {records.length === 0 ? (
                <div className="bg-card/50 backdrop-blur-sm rounded-[2rem] border border-border/50 p-16 text-center shadow-premium">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                        All caught up!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                        There are no pending requests at the moment. You've processed all recent submissions.
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {records.map((record) => (
                        <RecordCard
                            key={record.id}
                            record={record}
                            onView={handleView}
                            actions={approvalActions}
                        />
                    ))}
                </div>
            ) : (
                <RecordTable
                    records={records}
                    selectedDomain="all"
                    onView={handleView}
                    actions={approvalActions}
                />
            )}

            {/* Record Detail Modal */}
            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                record={selectedRecord}
            />

            {/* Approval/Rejection Confirmation */}
            <ConfirmDialog
                isOpen={actionDialog.isOpen}
                onClose={() =>
                    setActionDialog({ isOpen: false, type: 'approve', requestId: null })
                }
                onConfirm={handleConfirmAction}
                title={
                    actionDialog.type === 'approve' ? 'Approve Request' : 'Reject Request'
                }
                message={
                    actionDialog.type === 'approve'
                        ? 'Are you sure you want to approve this request? The record will be published immediately.'
                        : 'Are you sure you want to reject this request? The submitter will be notified.'
                }
                confirmLabel={actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
                variant={actionDialog.type === 'approve' ? 'default' : 'danger'}
            />
        </div>
    )
}

export default RecentRequests
