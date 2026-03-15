import { useState, useMemo } from 'react'
import { Plus, Search, FileText, X, LayoutGrid, List } from 'lucide-react'
import { Card } from '@/components/shadcn/ui/card'
import { Button } from '@/components/shadcn/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import {
    Searchbar,
    DomainFilter,
    YearFilter,
    RecordCard,
    RecordTable,
    RecordFormModal,
    RecordDetailModal,
} from '@/components/custom'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { cn } from '@/components/shadcn/utils'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { useAllUserRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from '@/hooks/useRecords'
import type { RecordType } from '@/@types/rims.types'

const Submissions = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [search, setSearch] = useState('')
    const [domainFilter, setDomainFilter] = useState('all')
    const [yearFilter, setYearFilter] = useState('all')
    const [addType, setAddType] = useState<string>('journal')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selected, setSelected] = useState<any | null>(null)

    // ── Data ──────────────────────────────────────────────────────────────
    const { data: submissions = [], isLoading, error } = useAllUserRecords()
    const createRecord = useCreateRecord()
    const updateRecord = useUpdateRecord()
    const deleteRecord = useDeleteRecord()

    // ── Available years from data ──────────────────────────────────────────
    const availableYears = useMemo(() => {
        const years = new Set<string>()

        // 1. Add baseline years (2021 to current/next)
        const now = new Date()
        const currentYear = now.getFullYear()
        const endYear = now.getMonth() === 11 ? currentYear + 1 : currentYear
        for (let i = 2021; i <= endYear; i++) {
            years.add(i.toString())
        }

        // 2. Add years found in data (for legacy or future records)
        submissions.forEach((s: any) => {
            const dateVal = s.date || s.date_of_publication || s.published_date || s.grant_date || s.month_year || s.year_of_publication || s.publicationYear || ''
            const yearStr = String(dateVal).match(/\d{4}/)?.[0]
            if (yearStr) years.add(yearStr)

            if (s.created_at) {
                const d = s.created_at.toDate ? s.created_at.toDate() : new Date(s.created_at)
                if (!isNaN(d.getTime())) years.add(d.getFullYear().toString())
            }
        })
        return Array.from(years).sort((a, b) => b.localeCompare(a))
    }, [submissions])

    // ── Client-side filter ────────────────────────────────────────────────
    const displayed = useMemo(() => {
        return submissions.filter((s: any) => {
            const title = (
                s.title ||
                s.title_of_paper ||
                s.title_of_book ||
                s.award_name ||
                s.project_title ||
                s.topic_title ||
                s.name_of_student ||
                ''
            ).toLowerCase()

            const matchesSearch = !search || title.includes(search.toLowerCase()) ||
                (s.approval_status || 'pending').toLowerCase().includes(search.toLowerCase())

            const matchesDomain = domainFilter === 'all' || s.type === domainFilter

            let matchesYear = yearFilter === 'all'
            if (!matchesYear) {
                const dateVal = s.date || s.date_of_publication || s.published_date || s.grant_date || s.month_year || s.year_of_publication || s.publicationYear || ''
                matchesYear = String(dateVal).includes(yearFilter)

                if (!matchesYear && s.created_at) {
                    const d = s.created_at.toDate ? s.created_at.toDate() : new Date(s.created_at)
                    matchesYear = d.getFullYear().toString() === yearFilter
                }
            }

            return matchesSearch && matchesDomain && matchesYear
        })
    }, [submissions, search, domainFilter, yearFilter])

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleAddClick = (type: string) => {
        setAddType(type)
        setSelected(null)
        setIsAddOpen(true)
    }

    const handleEdit = (record: any) => {
        setAddType(record.type || 'journal')
        setSelected(record)
        setIsAddOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this submission? This action cannot be undone.')) return
        const record = submissions.find((s: any) => s.id === id)
        const type = record?.type || 'journal'
        try {
            await deleteRecord.mutateAsync({ type: type as RecordType, recordId: id })
        } catch (err) {
            console.error(err)
            alert('Failed to delete.')
        }
    }

    const handleFormSubmit = async (data: any) => {
        try {
            const type = addType as RecordType
            if (selected) {
                await updateRecord.mutateAsync({ recordId: selected.id, data: { ...data, type } })
            } else {
                await createRecord.mutateAsync({ ...data, type })
            }
            setIsAddOpen(false)
            setSelected(null)
        } catch (err) {
            console.error(err)
            alert('Failed to save.')
        }
    }

    const clearFilters = () => { setSearch(''); setDomainFilter('all'); setYearFilter('all') }
    const hasFilters = !!search || domainFilter !== 'all' || yearFilter !== 'all'

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden gap-6 p-1">
            {/* Header Section */}
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 shadow-premium flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Records Portfolio</h1>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                            {isLoading ? 'Synchronizing…' : `${submissions.length} Research Entities Found`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center bg-muted/20 p-1 rounded-2xl border border-border/50 mr-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'grid' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'table' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-2xl h-11 px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium transition-all duration-300">
                                <Plus className="w-4 h-4 mr-2 stroke-3" />
                                New Submission
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-premium border-muted/20 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                Research Domain
                            </div>
                            {Object.entries(RECORD_TYPE_CONFIG)
                                .map(([key, config]) => (
                                    <DropdownMenuItem
                                        key={key}
                                        onClick={() => handleAddClick(key)}
                                        className="cursor-pointer rounded-xl py-2.5 gap-3 focus:bg-primary/5 group"
                                    >
                                        <div className={cn('p-2 rounded-lg bg-background border border-muted/50 transition-colors group-focus:border-primary/30', config.color)}>
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold text-sm group-focus:text-primary transition-colors">{config.label}</span>
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/40 p-3 shadow-sm flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Searchbar
                    value={search}
                    onChange={setSearch}
                    className="w-full sm:max-w-xs"
                />
                <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                    <DomainFilter value={domainFilter} onChange={setDomainFilter} className="w-full sm:w-[160px]" />
                    <YearFilter value={yearFilter} onChange={setYearFilter} years={availableYears} className="w-full sm:w-[120px]" />
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-auto overflow-hidden">
                {error ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 bg-card rounded-3xl border border-rose-500/20">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                            <X className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold text-rose-500">Synchronization Error</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">{(error as any).message}</p>
                        <Button variant="outline" className="mt-6 rounded-xl" onClick={() => window.location.reload()}>Retry Connection</Button>
                    </div>
                ) : isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                        <Spinner className="w-8 h-8 text-primary" />
                        <p className="text-sm text-muted-foreground font-medium animate-pulse">Fetching your research data…</p>
                    </div>
                ) : displayed.length > 0 ? (
                    <div className="h-full">
                        {viewMode === 'grid' ? (
                            <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {displayed.map((item: any) => (
                                        <RecordCard
                                            key={item.id}
                                            record={item}
                                            onView={(r) => { setSelected(r); setIsDetailOpen(true) }}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Card className="h-full border border-border/40 shadow-premium rounded-2xl overflow-hidden bg-card/50">
                                <RecordTable
                                    records={displayed}
                                    selectedDomain={domainFilter}
                                    onView={(r) => { setSelected(r); setIsDetailOpen(true) }}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </Card>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/60">
                        <div className="h-20 w-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Search className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No Submissions Found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto text-center mt-2 leading-relaxed">
                            {hasFilters
                                ? "No items match your high-precision search criteria."
                                : "You haven't initiated any research submissions yet. Begin your portfolio today."}
                        </p>
                        {hasFilters ? (
                            <Button variant="ghost" className="mt-4 rounded-xl font-bold text-primary" onClick={clearFilters}>Reset All Filters</Button>
                        ) : (
                            <Button className="mt-6 rounded-xl shadow-premium h-11 px-8" onClick={() => handleAddClick('journal')}>Initiate First Submission</Button>
                        )}
                    </div>
                )}
            </div>

            {/* Global Modals */}
            <RecordFormModal
                isOpen={isAddOpen}
                onClose={() => { setIsAddOpen(false); setSelected(null) }}
                type={addType}
                initialData={selected}
                onSubmit={handleFormSubmit}
                loading={createRecord.isPending || updateRecord.isPending}
            />

            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => { setIsDetailOpen(false); setSelected(null) }}
                record={selected}
            />
        </div>
    )
}

export default Submissions
