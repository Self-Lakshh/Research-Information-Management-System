import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { cn } from '@/components/shadcn/utils'

import useAuth from '@/auth/useAuth'

interface DomainFilterProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

const DomainFilter = ({ value, onChange, className }: DomainFilterProps) => {
    const { user } = useAuth()
    const isAdmin = user?.user_role === 'admin'
    const isSelected = value && value !== 'all';

    const filteredRecords = Object.entries(RECORD_TYPE_CONFIG).filter(([key]) => {
        if (isAdmin) return true
        return key !== 'phd_student'
    })

    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger
                className={cn(
                    "w-[160px] h-10 text-foreground",
                    "border rounded-lg transition-all duration-300 ease-out",
                    isSelected
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-card border-border/60 hover:bg-muted/50 hover:border-border/80 shadow-sm",
                    "focus:outline-none focus:ring-0 focus:border-border/80",
                    className
                )}
            >
                <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="all">All Domains</SelectItem>
                {filteredRecords.map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default DomainFilter
