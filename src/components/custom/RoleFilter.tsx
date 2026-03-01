import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import { cn } from '@/components/shadcn/utils'

interface RoleFilterProps {
    value: string
    onChange: (value: string) => void
    roles?: string[]
    className?: string
}

const RoleFilter = ({ value, onChange, roles, className }: RoleFilterProps) => {
    const defaultRoles = ['all', 'admin', 'user']

    const displayRoles = roles ? ['all', ...roles.filter(r => r !== 'all')] : defaultRoles

    const isSelected = value && value !== 'all'

    return (
        <Select value={value || 'all'} onValueChange={onChange}>
            <SelectTrigger
                className={cn(
                    "w-[130px] h-10 text-foreground capitalize",
                    "border rounded-lg transition-all duration-300 ease-out",
                    isSelected
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-card border-border/60 hover:bg-muted/50 hover:border-border/80 shadow-sm",
                    "focus:outline-none focus:ring-0 focus:border-border/80",
                    className
                )}
            >
                <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="all">All Roles</SelectItem>
                {displayRoles.filter(r => r !== 'all').map(role => (
                    <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default RoleFilter
