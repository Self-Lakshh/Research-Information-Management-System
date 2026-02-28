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
    return (
        <div className={cn("relative w-full md:max-w-md", className)}>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 h-10 lg:h-12 bg-card border border-muted/50 focus-visible:ring-primary/20 rounded-xl lg:rounded-2xl shadow-soft transition-all"
            />
        </div>
    )
}

export default Searchbar
