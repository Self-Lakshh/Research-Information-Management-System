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

    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger className={cn("w-[130px] h-10 lg:h-12 bg-card border border-muted/50 rounded-xl lg:rounded-2xl shadow-soft", className)}>
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
