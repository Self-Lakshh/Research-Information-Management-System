import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { cn } from '@/components/shadcn/utils'

interface DomainFilterProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

const DomainFilter = ({ value, onChange, className }: DomainFilterProps) => {
    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger className={cn("w-[160px] h-10 lg:h-12 bg-card border border-muted/50 rounded-xl lg:rounded-2xl shadow-soft", className)}>
                <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="all">All Domains</SelectItem>
                {Object.entries(RECORD_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default DomainFilter
