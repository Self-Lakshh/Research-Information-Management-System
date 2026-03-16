import { useState, useMemo, useEffect } from 'react'
import { Download, X, Search } from 'lucide-react'
import {
    Searchbar,
    DomainFilter,
    YearFilter,
    ViewSlider,
    RecordCard,
    RecordTable,
    RecordDetailModal,
    RecordFormModal,
    AddSubmissions,
} from '@/components/custom'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { useAllRecords, useDeleteRecord, useUpdateRecord, useCreateRecord } from '@/hooks/useRecords'
import type { RecordType } from '@/@types/rims.types'
import { cn } from '@/components/shadcn/utils'

const Records = () => {
    const [domainFilter, setDomainFilter] = useState<string>('all')
    const [yearFilter, setYearFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('approved')
    const [search, setSearch] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [addType, setAddType] = useState<string>('journal')

    // ── Fetch ─────────────────────────────────────────────────────────────
    const { data: rawRecords = [], isLoading, error } = useAllRecords({
        type: domainFilter === 'all' ? undefined : domainFilter,
        approvalStatus: statusFilter === 'all' ? undefined : statusFilter,
    } as any)

    const updateRecord = useUpdateRecord()
    const deleteRecord = useDeleteRecord()
    const createRecord = useCreateRecord()

    // ── Client-side search + year filter ──────────────────────────────────
    const displayed = useMemo(() => {
        return rawRecords.filter((r: any) => {
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
    }, [rawRecords, search, yearFilter])

    const clearFilters = () => { setSearch(''); setYearFilter('all'); setStatusFilter('approved') }
    const hasFilters = !!search || yearFilter !== 'all' || statusFilter !== 'approved'

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (!confirm('Warning: This will deactivate this record from the permanent archive. Proceed?')) return
        const record = rawRecords.find((r: any) => r.id === id)
        const type = (record?._domain || record?.type || domainFilter) as RecordType
        try {
            await deleteRecord.mutateAsync({ type, recordId: id })
        } catch (err) {
            console.error(err)
            alert('Failed to delete.')
        }
    }

    const handleEdit = (record: any) => {
        setAddType(record.type || 'journal')
        setSelectedRecord(record)
        setIsEditOpen(true)
    }

    const handleAddClick = (type: string) => {
        setAddType(type)
        setSelectedRecord(null)
        setIsAddOpen(true)
    }

    const handleFormSubmit = async (data: any) => {
        try {
            const type = addType as RecordType
            if (selectedRecord) {
                await updateRecord.mutateAsync({ recordId: selectedRecord.id, data: { ...data, type } })
                setIsEditOpen(false)
            } else {
                await createRecord.mutateAsync({ ...data, type })
                setIsAddOpen(false)
            }
        } catch (err) {
            console.error(err)
            alert('Failed to save.')
        }
    }

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden gap-4">

            {/* ── Header ── */}
            <div className="bg-card border border-muted/40 rounded-2xl p-4 shadow-sm flex flex-col gap-4 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Records Audit</h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                            Permanent Archive Management
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ViewSlider viewMode={viewMode} setViewMode={setViewMode} />
                        <AddSubmissions onAddClick={handleAddClick} />
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white transition-all">
                            <Download className="w-3.5 h-3.5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-muted/30">
                    <Searchbar value={search} onChange={setSearch} className="w-full sm:max-w-xs" />

                    <div className="h-6 w-px bg-muted/30 hidden sm:block mx-1" />

                    <div className="flex items-center gap-2 flex-wrap">
                        <DomainFilter value={domainFilter} onChange={v => setDomainFilter(v)} />
                        <YearFilter value={yearFilter} onChange={setYearFilter} />

                        <div className="flex items-center bg-muted/20 p-1 rounded-xl border border-muted/50">
                            {[
                                { val: 'approved', label: 'Approved' },
                                { val: 'rejected', label: 'Rejected' },
                                { val: 'all', label: 'All Status' }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    onClick={() => setStatusFilter(opt.val)}
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                                        statusFilter === opt.val
                                            ? "bg-background shadow-sm text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {hasFilters && (
                            <button
                                onClick={clearFilters}
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
                        <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-6 h-6 text-rose-500" />
                        </div>
                        <p className="text-rose-500 font-bold">Error loading records</p>
                        <p className="text-xs text-muted-foreground mt-1">{(error as any).message}</p>
                    </div>

                ) : isLoading ? (
                    <div className="py-20 flex-auto flex items-center justify-center">
                        <Spinner className="w-6 h-6" />
                    </div>

                ) : displayed.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No records found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                            {hasFilters
                                ? 'Adjust your filters to see more results.'
                                : `The permanent archive for ${domainFilter} is currently empty.`}
                        </p>
                    </div>

                ) : viewMode === 'grid' ? (
                    <div className="flex-auto overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                            {displayed.map((record: any) => (
                                <RecordCard
                                    key={record.id}
                                    record={record}
                                    onView={(r) => { setSelectedRecord(r); setIsDetailOpen(true) }}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
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
                            onEdit={handleEdit}
                            onDelete={handleDelete}
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

            {/* Edit Modal */}
            {selectedRecord && (
                <RecordFormModal
                    isOpen={isEditOpen}
                    onClose={() => { setIsEditOpen(false); setSelectedRecord(null) }}
                    type={addType as any}
                    initialData={selectedRecord}
                    onSubmit={handleFormSubmit}
                    loading={updateRecord.isPending}
                />
            )}

            {/* Add Modal */}
            <RecordFormModal
                isOpen={isAddOpen}
                onClose={() => { setIsAddOpen(false); setSelectedRecord(null) }}
                type={addType as any}
                onSubmit={handleFormSubmit}
                loading={createRecord.isPending}
            />
        </div>
    )
}

export default Records
