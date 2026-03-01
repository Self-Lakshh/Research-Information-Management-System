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
}

const YearFilter = ({ value, onChange, years, className }: YearFilterProps) => {
    const defaultYears = ['all']
    if (!years) {
        const currentYear = new Date().getFullYear()
        for (let i = currentYear; i >= currentYear - 10; i--) {
            defaultYears.push(i.toString())
        }
    }

    const displayYears = years ? ['all', ...years.filter(y => y !== 'all')] : defaultYears

    const isSelected = value && value !== 'all'

    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger
                className={cn(
                    "w-[130px] h-10 text-foreground",
                    "border rounded-lg transition-all duration-300 ease-out",
                    isSelected
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-card border-border/60 hover:bg-muted/50 hover:border-border/80 shadow-sm",
                    "focus:outline-none focus:ring-0 focus:border-border/80",
                    className
                )}
            >
                <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="all">All Years</SelectItem>
                {displayYears.filter(y => y !== 'all').map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default YearFilter
