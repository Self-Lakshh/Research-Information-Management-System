import { useState } from 'react'
import { Download, Plus, LayoutGrid, List } from 'lucide-react'
import {
    FilterBar,
} from '@/components/custom'
import {
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
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
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
                filters={COMMON_FILTERS.record}
                values={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Records Content */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Spinner className="w-8 h-8" />
                </div>
            ) : viewMode === 'table' ? (
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
                            onDelete={(id: string) => handleDeleteRecord(id)}
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
