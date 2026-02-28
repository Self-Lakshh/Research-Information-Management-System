import React, { useState, useMemo } from 'react'
import { Card } from '@/components/shadcn/ui/card'
import { useUserRecords, useCreateRecord, useUpdateRecord, useDeleteRecord } from '@/hooks/useRecords'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { Button } from '@/components/shadcn/ui/button'
import {
    Plus,
    Search,
    FileText
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { cn } from '@/components/shadcn/utils'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import {
    RecordCard,
    RecordFormModal,
    RecordDetailModal,
    RecordTable,
    CardTilesHeader
} from '@/components/custom'

const Submissions = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedType, setSelectedType] = useState('journal')
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDomain, setSelectedDomain] = useState<string>('all')
    const [selectedYear, setSelectedYear] = useState<string>('all')

    const { data: submissions = [], isLoading } = useUserRecords()
    const createRecord = useCreateRecord()
    const updateRecord = useUpdateRecord()
    const deleteRecord = useDeleteRecord()

    const availableYears = useMemo(() => {
        const years = new Set<string>();
        submissions.forEach((s: any) => {
            let date = null;
            if (s.created_at) {
                date = s.created_at.toDate ? s.created_at.toDate() : new Date(s.created_at);
            }
            if (date && !isNaN(date.getTime())) {
                years.add(date.getFullYear().toString());
            }
            // Check specific year fields if date parsing fails or as fallback
            const anyRecord = s as any;
            if (anyRecord.publicationYear) years.add(anyRecord.publicationYear.toString());
            if (anyRecord.publicationDate) {
                const pubDate = new Date(anyRecord.publicationDate);
                if (!isNaN(pubDate.getTime())) years.add(pubDate.getFullYear().toString());
            }
        });
        return Array.from(years).sort((a, b) => b.localeCompare(a));
    }, [submissions]);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter((s: any) => {
            const matchesSearch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.approval_status?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesDomain = selectedDomain === 'all' || s.type?.toLowerCase() === selectedDomain.toLowerCase()

            // Extract year logic
            let recordYear = '';
            if (s.created_at) {
                const date = s.created_at.toDate ? s.created_at.toDate() : new Date(s.created_at);
                recordYear = date.getFullYear().toString();
            }
            const pubYear = (s as any).publicationYear?.toString();
            const pubDateYear = (s as any).publicationDate ? new Date((s as any).publicationDate).getFullYear().toString() : undefined;

            const matchesYear = selectedYear === 'all' ||
                recordYear === selectedYear ||
                (pubYear && pubYear === selectedYear) ||
                (pubDateYear && pubDateYear === selectedYear);

            return matchesSearch && matchesDomain && matchesYear
        })
    }, [submissions, searchQuery, selectedDomain, selectedYear])

    const handleAddClick = (type: string) => {
        setSelectedType(type)
        setSelectedSubmission(null)
        setIsAddModalOpen(true)
    }

    const handleViewDetail = (submission: any) => {
        setSelectedSubmission(submission)
        setIsDetailOpen(true)
    }

    const handleEditSubmission = (submission: any) => {
        setSelectedType(submission.type?.toLowerCase() || 'journal')
        setSelectedSubmission(submission)
        setIsAddModalOpen(true)
    }

    const handleDeleteSubmission = async (id: string) => {
        if (confirm('Are you sure you want to delete this submission?')) {
            try {
                await deleteRecord.mutateAsync(id)
            } catch (error) {
                console.error(error)
                alert('Failed to delete record')
            }
        }
    }

    const handleFormSubmit = async (data: any) => {
        try {
            if (selectedSubmission) {
                await updateRecord.mutateAsync({ recordId: selectedSubmission.id, data })
            } else {
                await createRecord.mutateAsync({ ...data, type: selectedType })
            }
            setIsAddModalOpen(false)
        } catch (error) {
            console.error(error)
            alert('Failed to save record')
        }
    }

    const handleExport = (format: 'pdf' | 'excel') => {
        console.log(`Exporting as ${format}...`)
        // Implement export logic here
        alert(`Exporting as ${format}...`)
    }

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">My Submissions</h1>
                    <p className="text-muted-foreground font-medium">Manage and track your research portfolio across all domains.</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-2xl h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-soft transition-all duration-300 gap-2">
                            <Plus className="h-4 w-4" /> Add Submission
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-primary/10 shadow-premium">
                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Domain Type</div>
                        {Object.entries(RECORD_TYPE_CONFIG).map(([key, config]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => handleAddClick(key)}
                                className="cursor-pointer rounded-xl py-2.5 gap-3 group transition-colors"
                            >
                                <div className={cn("p-2 rounded-lg bg-background border border-muted group-hover:bg-primary/5 transition-colors", config.color.replace('text-', 'bg-').replace('500', '50'))}>
                                    <FileText className={cn("h-4 w-4", config.color)} />
                                </div>
                                <span className="font-semibold text-sm">{config.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Controls Header */}
            <CardTilesHeader
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                years={availableYears}
                onExport={handleExport}
            />

            {/* Content View */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Spinner className="w-8 h-8" />
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((item) => (
                            <RecordCard
                                key={item.id}
                                record={item}
                                onView={handleViewDetail}
                                onEdit={handleEditSubmission}
                                onDelete={handleDeleteSubmission}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                                <Search className="h-10 w-10 text-muted-foreground " />
                            </div>
                            <p className="text-muted-foreground font-bold">No submissions found matching your search.</p>
                        </div>
                    )}
                </div>
            ) : (
                <Card className="border-none shadow-premium rounded-2xl overflow-hidden">
                    <RecordTable
                        records={filteredSubmissions}
                        selectedDomain={selectedDomain}
                        onView={handleViewDetail}
                        onEdit={handleEditSubmission}
                        onDelete={handleDeleteSubmission}
                    />
                </Card>
            )}

            {/* Modals */}
            <RecordFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                type={selectedType}
                initialData={selectedSubmission}
                onSubmit={handleFormSubmit}
            />

            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                record={selectedSubmission}
            />
        </div>
    )
}

export default Submissions
