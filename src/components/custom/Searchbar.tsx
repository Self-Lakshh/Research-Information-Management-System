import { Search } from 'lucide-react'
import { Input } from '@/components/shadcn/ui/input'
import { cn } from '@/components/shadcn/utils'

interface SearchbarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

const Searchbar = ({ value, onChange, placeholder = "Search records...", className }: SearchbarProps) => {
    const isActive = value && value.length > 0;

    return (
        <div className={cn("relative group w-full", className)}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className={cn(
                    "h-4 w-4 md:h-[18px] md:w-[18px] transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/80"
                )} />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "pl-10 md:pl-11 h-10 w-full text-sm",
                    "text-foreground placeholder:text-muted-foreground/60",
                    "border rounded-lg transition-all duration-300 ease-out",
                    isActive
                        ? "bg-primary/10 border-primary/50 shadow-sm"
                        : "bg-card border-border/60 hover:bg-muted/50 hover:border-border/80 shadow-sm",
                    "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border/80"
                )}
            />
        </div>
    )
}

export default Searchbar
