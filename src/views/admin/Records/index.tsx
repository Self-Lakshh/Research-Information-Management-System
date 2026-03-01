import { useState } from 'react'
import { Download, X, CheckCircle, Search } from 'lucide-react'
import {
    Searchbar,
    DomainFilter,
    YearFilter,
    ViewSlider,
    RecordTable,
    RecordDetailModal,
    RecordFormModal,
    RecordCard
} from '@/components/custom'
import { COMMON_FILTERS } from '@/configs/rims.config'
import { cn } from '@/components/shadcn/utils'
import type { Record as ResearchRecord, RecordFilters } from '@/@types/rims.types'
import { useAllRecords, useDeleteRecord, useUpdateRecord } from '@/hooks/useRecords'
import { Spinner } from '@/components/shadcn/ui/spinner'

// ============================================
// RECORDS PAGE
// ============================================

const Records = () => {
    const [filters, setFilters] = useState<RecordFilters>({})
    const { data: records = [], isLoading } = useAllRecords(filters)
    const updateRecord = useUpdateRecord()
    const deleteRecord = useDeleteRecord()
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleFilterChange = (key: string, value: unknown) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
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

    const handleDeleteRecord = async (id: string) => {
        if (confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteRecord.mutateAsync(id)
            } catch (error) {
                console.error(error)
                alert('Failed to delete')
            }
        }
    }

    const handleFormSubmit = async (data: any) => {
        if (selectedRecord) {
            try {
                await updateRecord.mutateAsync({ recordId: selectedRecord.id, data })
                setIsEditOpen(false)
            } catch (error) {
                console.error(error)
                alert('Failed to update')
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header & Filters */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-5 shadow-premium flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-foreground tracking-tight">
                            Records
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <ViewSlider viewMode={viewMode} setViewMode={setViewMode} />
                        <div className="h-6 w-px bg-muted/50 hidden sm:block" />
                        <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-5 pb-1 border-t border-muted">
                    <Searchbar
                        value={(filters.searchQuery as string) || ''}
                        onChange={(val) => handleFilterChange('searchQuery', val)}
                        className="w-full sm:max-w-xs"
                    />
                    <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                        <DomainFilter
                            value={(filters.type as string) || 'all'}
                            onChange={(val) => handleFilterChange('type', val)}
                        />
                        <YearFilter
                            value={(filters.year as unknown as string) || 'all'}
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
                        <button className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Records Content */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Spinner className="w-8 h-8" />
                </div>
            ) : records.length === 0 ? (
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-16 text-center shadow-premium">
                    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                        No records found
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
                        We couldn't find any records matching your current filters. Try adjusting your search or filters.
                    </p>
                    {Object.keys(filters).length > 0 && (
                        <button
                            onClick={handleClearFilters}
                            className="mt-6 text-sm font-bold text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {records.map((record) => (
                        <RecordCard
                            key={record.id}
                            record={record}
                            onView={handleViewRecord}
                            onEdit={handleEditRecord}
                            onDelete={(id: string) => handleDeleteRecord(id)}
                        />
                    ))}
                </div>
            ) : (
                <RecordTable
                    records={records}
                    selectedDomain="all"
                    onView={handleViewRecord}
                    onEdit={handleEditRecord}
                    onDelete={handleDeleteRecord}
                />
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
