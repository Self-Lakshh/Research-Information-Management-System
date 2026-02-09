import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/shadcn/ui/card'
import { Badge } from '@/components/shadcn/ui/badge'
import { Button } from '@/components/shadcn/ui/button'
import { Input } from '@/components/shadcn/ui/input'
import {
    FileText,
    Search,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    XCircle,
    Plus,
    BookOpen,
    Users,
    Lightbulb,
    Trophy,
    Briefcase,
    Banknote,
    LayoutGrid,
    List,
    MoreHorizontal,
    Eye,
    Edit2,
    Trash2
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { cn } from '@/components/shadcn/utils'
import { SUBMISSION_TYPES, getStatusColor } from '@/configs/submission.config'
import {
    RecordCard,
    RecordFormModal,
    RecordDetailModal,
    RecordTable
} from '@/components/common'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'

const Submissions = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedType, setSelectedType] = useState('journal')
    const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDomain, setSelectedDomain] = useState<string>('all')

    // Mock Data
    const [submissions, setSubmissions] = useState([
        { id: '1', title: 'Improving AI Efficiency in Healthcare', category: 'journal', date: 'Oct 12, 2023', status: 'Approved', journalName: 'IEEE Health Informatics', authors: 'John Doe, Jane Smith', publicationDate: '2023-10-12', indexing: 'scopus' },
        { id: '2', title: 'Blockchain for Academic Veracity', category: 'conference', date: 'Oct 10, 2023', status: 'Pending', conferenceName: 'International Conference on Blockchain', location: 'Dubai, UAE', startDate: '2023-10-10' },
        { id: '3', title: 'AI-based Healthcare Diagnostic System', category: 'ipr', date: 'Sep 25, 2023', status: 'Approved', inventors: 'John Doe', applicationNo: '2023/APP/1234', filingDate: '2023-09-25', patentStatus: 'published' },
        { id: '4', title: 'Deep Learning for Everyone', category: 'book', date: 'Sep 15, 2023', status: 'Rejected', publisher: 'Springer', isbn: '978-3-16-148410-0', publicationYear: 2023 },
        { id: '5', title: 'Smart Cities using IoT', category: 'grant', date: 'Aug 30, 2023', status: 'Pending', agency: 'DST', amount: 500000, pi: 'John Doe', startDate: '2023-08-30' },
    ])

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.status.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDomain = selectedDomain === 'all' || s.category.toLowerCase() === selectedDomain.toLowerCase()

        return matchesSearch && matchesDomain
    })

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
        setSelectedType(submission.category.toLowerCase())
        setSelectedSubmission(submission)
        setIsAddModalOpen(true)
    }

    const handleDeleteSubmission = (id: string) => {
        if (confirm('Are you sure you want to delete this submission?')) {
            setSubmissions(prev => prev.filter(s => s.id !== id))
        }
    }

    const handleFormSubmit = (data: any) => {
        if (selectedSubmission) {
            setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, ...data } : s))
        } else {
            const newSubmission = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                category: selectedType,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'Pending'
            }
            setSubmissions(prev => [newSubmission, ...prev])
        }
        setIsAddModalOpen(false)
    }

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90">My Submissions</h1>
                    <p className="text-muted-foreground font-medium">Manage and track your research portfolio across all domains.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* View Mode Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl border border-muted-foreground/10 h-11">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'px-3 h-full flex items-center justify-center rounded-xl transition-all duration-300',
                                viewMode === 'grid' ? 'bg-background shadow-premium text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                'px-3 h-full flex items-center justify-center rounded-xl transition-all duration-300',
                                viewMode === 'table' ? 'bg-background shadow-premium text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <List className="w-4 h-4 mr-2" />
                        </button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="rounded-2xl h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-soft transition-all duration-300 gap-2">
                                <Plus className="h-4 w-4" /> Add Submission
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-primary/10 shadow-premium">
                            <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Domain Type</div>
                            {Object.entries(SUBMISSION_TYPES).map(([key, config]) => (
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
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                <Card className="flex-1 border-none shadow-soft rounded-[1.5rem] overflow-hidden bg-muted/20">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by title..."
                            className="bg-transparent border-none h-12 pl-12 rounded-none focus-visible:ring-0 text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </Card>

                <div className="flex flex-wrap items-center gap-3">
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger className="w-[180px] h-12 rounded-[1.5rem] border-muted-foreground/10 bg-muted/20 font-bold px-5 focus:ring-primary/20">
                            <SelectValue placeholder="All Domains" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/5 shadow-premium">
                            <SelectItem value="all" className="rounded-lg">All Domains</SelectItem>
                            {Object.entries(SUBMISSION_TYPES).map(([key, config]) => (
                                <SelectItem key={key} value={key} className="rounded-lg capitalize">
                                    {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="rounded-[1.5rem] h-12 border-muted-foreground/10 bg-muted/20 gap-2 font-bold px-6 hover:bg-muted/30">
                        <ArrowUpDown className="h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'grid' ? (
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
