import { useState, useMemo } from 'react'
import { CheckCircle, X, Clock, XCircle } from 'lucide-react'
import {
    Searchbar,
    DomainFilter,
    YearFilter,
    ConfirmDialog,
    RecordCard,
    RecordTable,
    RecordDetailModal,
} from '@/components/custom'
import ViewSlider from '@/components/custom/ViewSlider'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { usePendingRecords, useSetRecordStatus } from '@/hooks/useRecords'
import { cn } from '@/components/shadcn/utils'
import type { Record as ResearchRecord, RecordType } from '@/@types/rims.types'

// ─────────────────────────────────────────────────────────────────────────────
// Recent Requests
// ─ "Pending" tab  → records with approval_status = 'pending'
// ─ "Rejected" tab → records with approval_status = 'rejected'
// Both tabs share the same Approve / Reject actions.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_TABS = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
] as const

type StatusTab = typeof STATUS_TABS[number]['key']

const RecentRequests = () => {
    // ── State ──────────────────────────────────────────────────────────────
    const [domainFilter, setDomainFilter] = useState<string>('all')
    const [yearFilter, setYearFilter] = useState<string>('all')
    const [search, setSearch] = useState('')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [selectedRecord, setSelectedRecord] = useState<ResearchRecord | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        action: 'approve' | 'reject'
        record: ResearchRecord | null
    }>({ open: false, action: 'approve', record: null })

    // ── Data ──────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<StatusTab>('pending')
    const selectedType = domainFilter === 'all' ? undefined : (domainFilter as RecordType)
    const {
        data: rawData = [],
        isLoading,
        error,
        refetch,
    } = usePendingRecords(selectedType, activeTab)

    const setStatus = useSetRecordStatus()

    // ── Client-side search + year filter ──────────────────────────────────
    const displayed = useMemo(() => {
        return rawData.filter((r: any) => {
            const title = (
                r.title ||
                r.title_of_paper ||
                r.title_of_book ||
                r.award_name ||
                r.project_title ||
                r.topic_title ||
                r.name_of_student ||
                ''
            ).toLowerCase()

            const matchesSearch = !search || (() => {
                const q = search.toLowerCase()
                const hay = [
                    title,
                    r.journal_name,
                    r.name_of_conference,
                    r.organization,
                    r.institution_body,
                    r.publisher_name,
                    r.patent_type,
                    r._domain
                ].join(' ').toLowerCase()
                return hay.includes(q)
            })()

            const matchesYear = yearFilter === 'all' || (() => {
                const dateVal = r.date || r.date_of_publication || r.published_date || r.grant_date || r.month_year || r.year_of_publication || r.publicationYear || ''
                if (String(dateVal).includes(yearFilter)) return true
                const ca = r.created_at
                if (ca?.toDate) return ca.toDate().getFullYear().toString() === yearFilter
                return false
            })()

            return matchesSearch && matchesYear
        })
    }, [rawData, search, yearFilter])

    const hasFilters = !!search || yearFilter !== 'all'

    // ── Handlers ──────────────────────────────────────────────────────────
    const openApprove = (record: any) =>
        setConfirmDialog({ open: true, action: 'approve', record })
    const openReject = (record: any) =>
        setConfirmDialog({ open: true, action: 'reject', record })

    const handleConfirm = async () => {
        const { record, action } = confirmDialog
        if (!record) return
        const type = (record._domain || record.type || domainFilter) as RecordType
        try {
            await setStatus.mutateAsync({
                type,
                recordId: (record as any).id!,
                status: action === 'approve' ? 'approved' : 'rejected',
            })
            setConfirmDialog({ open: false, action: 'approve', record: null })
            refetch()
        } catch (err) {
            console.error('Status update failed:', err)
            alert(`Failed to ${action} record.`)
        }
    }

    const approvalActions = activeTab === 'pending' ? [
        { label: 'Approve Submission', onClick: openApprove, icon: <CheckCircle className="w-4 h-4" />, variant: 'success' as const },
        { label: 'Reject Submission', onClick: openReject, icon: <X className="w-4 h-4" />, variant: 'danger' as const },
    ] : [
        { label: 'Re-Approve', onClick: openApprove, icon: <CheckCircle className="w-4 h-4" />, variant: 'success' as const },
    ]

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden gap-4">

            {/* ── Header ── */}
            <div className="bg-card border border-muted/40 rounded-2xl p-4 shadow-sm flex flex-col gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-xl font-bold text-foreground leading-none">Review Desk</h1>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5 opacity-60">
                                Institutional Verification Hub
                            </p>
                        </div>

                        <div className="h-10 w-px bg-muted/30 hidden md:block" />

                        {/* Status Tabs */}
                        <div className="flex items-center bg-muted/20 p-1 rounded-xl border border-muted/40">
                            {STATUS_TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            isActive
                                                ? "bg-background shadow-sm text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                        )}
                                    >
                                        <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-muted-foreground/60")} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <ViewSlider viewMode={viewMode} setViewMode={setViewMode} />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-muted/30">
                    <Searchbar value={search} onChange={setSearch} className="w-full sm:max-w-xs" />
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <DomainFilter value={domainFilter} onChange={setDomainFilter} />
                        <YearFilter value={yearFilter} onChange={setYearFilter} />
                        {hasFilters && (
                            <button
                                onClick={() => { setSearch(''); setYearFilter('all') }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-auto flex flex-col min-h-0 bg-card border border-muted/40 rounded-2xl shadow-sm overflow-hidden">
                {error ? (
                    <div className="p-12 text-center">
                        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                        <p className="text-rose-500 font-bold">Error loading queue</p>
                    </div>

                ) : isLoading ? (
                    <div className="py-20 flex-auto flex items-center justify-center">
                        <Spinner className="w-6 h-6" />
                    </div>

                ) : displayed.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Queue Clear!</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                            All pending submissions have been reviewed.
                        </p>
                    </div>

                ) : viewMode === 'grid' ? (
                    <div className="flex-auto overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                            {displayed.map((record) => (
                                <RecordCard
                                    key={record.id}
                                    record={record}
                                    onView={(r) => { setSelectedRecord(r); setIsDetailOpen(true) }}
                                    actions={approvalActions}
                                />
                            ))}
                        </div>
                    </div>

                ) : (
                    <div className="flex-auto min-h-0">
                        <RecordTable
                            records={displayed}
                            selectedDomain={domainFilter}
                            onView={(r) => { setSelectedRecord(r); setIsDetailOpen(true) }}
                            actions={approvalActions}
                        />
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                record={selectedRecord}
            />

            <ConfirmDialog
                isOpen={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, action: 'approve', record: null })}
                onConfirm={handleConfirm}
                title={confirmDialog.action === 'approve' ? 'Confirm Approval' : 'Reject Submission'}
                message={
                    confirmDialog.action === 'approve'
                        ? 'This submission will be published to the public archive.'
                        : 'Please provide a reason if you wish to reject this submission.'
                }
                confirmLabel={confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
                variant={confirmDialog.action === 'approve' ? 'default' : 'danger'}
            />
        </div>
    )
}

export default RecentRequests
