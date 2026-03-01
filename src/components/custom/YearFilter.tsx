import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import { cn } from '@/components/shadcn/utils'

interface YearFilterProps {
    value: string
    onChange: (value: string) => void
    years?: string[]
    className?: string
    variant?: 'select' | 'list'
}

const YearFilter = ({ value, onChange, years, className, variant = 'select' }: YearFilterProps) => {
    const defaultYears = ['all']
    if (!years) {
        const currentYear = new Date().getFullYear()
        for (let i = currentYear; i >= currentYear - 10; i--) {
            defaultYears.push(i.toString())
        }
    }

    const displayYears = years ? ['all', ...years.filter(y => y !== 'all')] : defaultYears
    const isSelected = value && value !== 'all'

    if (variant === 'list') {
        return (
            <div className={cn("flex flex-wrap items-center gap-2", className)}>
                {displayYears.map(year => (
                    <button
                        key={year}
                        onClick={() => onChange(year)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            (value || 'all') === year
                                ? "bg-primary text-white border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                                : "bg-card border-border/60 text-muted-foreground hover:border-border shadow-sm"
                        )}
                    >
                        {year === 'all' ? 'All Time' : year}
                    </button>
                ))}
            </div>
        )
    }

    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger
                className={cn(
                    "w-[130px] h-10 text-foreground font-bold",
                    "border rounded-lg transition-all duration-300 ease-out",
                    isSelected
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-card border-border/60 hover:bg-muted/50 hover:border-border/80 shadow-sm",
                    "focus:outline-none focus:ring-0 focus:border-border/80",
                    className
                )}
            >
                <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-premium border-border/60">
                <SelectItem value="all" className="font-medium">All Time</SelectItem>
                {displayYears.filter(y => y !== 'all').map(year => (
                    <SelectItem key={year} value={year} className="font-medium">{year}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default YearFilter
