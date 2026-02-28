import { useState } from 'react'
import { CheckCircle, XCircle, LayoutGrid, List } from 'lucide-react'
import {
    Searchbar,
    DomainFilter,
    YearFilter,
    ConfirmDialog,
} from '@/components/custom'
import {
    RecordTable,
    RecordDetailModal,
    RecordCard
} from '@/components/custom'
import { COMMON_FILTERS } from '@/configs/rims.config'
import { cn } from '@/components/shadcn/utils'
import type { Record as ResearchRecord, User } from '@/@types/rims.types'
import { usePendingRecords, useApproveRecord, useRejectRecord } from '@/hooks/useRecords'
import { Spinner } from '@/components/shadcn/ui/spinner'
import ViewSlider from '@/components/custom/ViewSlider'
// ============================================

const RecentRequests = () => {
    const [filters, setFilters] = useState<Record<string, unknown>>({})
    const { data: records = [], isLoading } = usePendingRecords()
    const approveRecord = useApproveRecord()
    const rejectRecord = useRejectRecord()
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

    const handleConfirmAction = async () => {
        if (!actionDialog.requestId) return;
        try {
            if (actionDialog.type === 'approve') {
                await approveRecord.mutateAsync(actionDialog.requestId);
            } else {
                await rejectRecord.mutateAsync(actionDialog.requestId);
            }
            setActionDialog({ isOpen: false, type: 'approve', requestId: null })
        } catch (error) {
            console.error(error)
            alert(`Failed to ${actionDialog.type} record`)
        }
    }

    const pendingCount = records.length



    const approvalActions = [
        {
            label: 'Approve Request',
            onClick: (record: any) => handleApprove(record.id),
            icon: <CheckCircle className="w-4 h-4" />,
            variant: 'success' as const
        },
        {
            label: 'Reject Request',
            onClick: (record: any) => handleReject(record.id),
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
                <ViewSlider viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-2xl border border-muted/50 shadow-soft">
                <Searchbar
                    value={(filters.search as string) || ''}
                    onChange={(val) => handleFilterChange('search', val)}
                    className="flex-1 min-w-[200px]"
                />

                <div className="flex flex-wrap items-center gap-3">
                    <DomainFilter
                        value={(filters.type as string) || 'all'}
                        onChange={(val) => handleFilterChange('type', val)}
                    />
                    <YearFilter
                        value={(filters.year as string) || 'all'}
                        onChange={(val) => handleFilterChange('year', val)}
                    />

                    {Object.keys(filters).length > 0 && (
                        <button
                            onClick={handleClearFilters}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Requests Content */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Spinner className="w-8 h-8" />
                </div>
            ) : records.length === 0 ? (
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
