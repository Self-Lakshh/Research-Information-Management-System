import { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
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
            icon: <X className="w-4 h-4" />,
            variant: 'danger' as const
        }
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-5 shadow-premium flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-foreground tracking-tight">
                            Recent Requests
                        </h1>
                    </div>
                    <ViewSlider viewMode={viewMode} setViewMode={setViewMode} />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-5 pb-1 border-t border-muted">
                    <Searchbar
                        value={(filters.search as string) || ''}
                        onChange={(val) => handleFilterChange('search', val)}
                        className="w-full sm:max-w-xs"
                    />
                    <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
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
                                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Requests Content */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Spinner className="w-8 h-8" />
                </div>
            ) : records.length === 0 ? (
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-16 text-center shadow-premium">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
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
