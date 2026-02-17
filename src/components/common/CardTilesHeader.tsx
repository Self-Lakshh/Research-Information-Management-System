
import React from 'react'
import {
    Search,
    Filter,
    LayoutGrid,
    List,
    FileText,
    FileSpreadsheet,
    Download,
    Calendar
} from 'lucide-react'
import { Button } from '@/components/shadcn/ui/button'
import { Input } from '@/components/shadcn/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { Card } from '@/components/shadcn/ui/card'
import { cn } from '@/components/shadcn/utils'
import { SUBMISSION_TYPES } from '@/configs/submission.config'

interface CardTilesHeaderProps {
    viewMode: 'grid' | 'table'
    setViewMode: (mode: 'grid' | 'table') => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    selectedDomain: string
    setSelectedDomain: (domain: string) => void
    selectedYear: string
    setSelectedYear: (year: string) => void
    years: string[]
    onExport: (format: 'pdf' | 'excel') => void
    className?: string
}

export const CardTilesHeader: React.FC<CardTilesHeaderProps> = ({
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedDomain,
    setSelectedDomain,
    selectedYear,
    setSelectedYear,
    years = [],
    onExport,
    className
}) => {

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                {/* Search Bar */}
                <Card className="flex-1 border-none shadow-soft rounded-[1.5rem] overflow-hidden bg-muted/20">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search records..."
                            className="bg-transparent border-none h-12 pl-12 rounded-none focus-visible:ring-0 text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </Card>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Domain Filter */}
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

                    {/* Year Filter */}
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[140px] h-12 rounded-[1.5rem] border-muted-foreground/10 bg-muted/20 font-bold px-5 focus:ring-primary/20">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 opacity-50" />
                                <SelectValue placeholder="Year" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/5 shadow-premium max-h-[300px]">
                            <SelectItem value="all" className="rounded-lg">All Years</SelectItem>
                            {years.map((year) => (
                                <SelectItem key={year} value={year} className="rounded-lg">
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-muted rounded-2xl border border-muted-foreground/10 h-12">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'px-3 h-full flex items-center justify-center rounded-xl transition-all duration-300',
                                viewMode === 'grid' ? 'bg-background shadow-premium text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                'px-3 h-full flex items-center justify-center rounded-xl transition-all duration-300',
                                viewMode === 'table' ? 'bg-background shadow-premium text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Table View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Export Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-[1.5rem] h-12 border-muted-foreground/10 bg-muted/20 gap-2 font-bold px-4 hover:bg-muted/30">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-primary/10 shadow-premium min-w-[150px]">
                            <DropdownMenuItem onClick={() => onExport('pdf')} className="gap-2 p-3 cursor-pointer rounded-xl">
                                <FileText className="h-4 w-4 text-red-500" />
                                <span className="font-medium">Export as PDF</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExport('excel')} className="gap-2 p-3 cursor-pointer rounded-xl">
                                <FileSpreadsheet className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Export as Excel</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}
