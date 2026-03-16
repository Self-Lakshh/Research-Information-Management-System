import React from 'react'
import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/shadcn/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { cn } from '@/components/shadcn/utils'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import useAuth from '@/auth/useAuth'

interface AddSubmissionsProps {
    onAddClick: (type: string) => void
}

const AddSubmissions: React.FC<AddSubmissionsProps> = ({ onAddClick }) => {
    const { user } = useAuth()
    
    // Check if user is admin
    const isAdmin = user?.user_role === 'admin'

    // Filter record types: User can't see 'phd_student'
    const filteredRecords = Object.entries(RECORD_TYPE_CONFIG).filter(([key]) => {
        if (isAdmin) return true
        return key !== 'phd_student'
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rounded-lg h-10 px-3 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium transition-all duration-300">
                    <Plus className="w-4 h-4 stroke-3" />
                    New Submission
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl p-2 shadow-premium border-muted/20 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    Research Domain
                </div>
                {filteredRecords.map(([key, config]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => onAddClick(key)}
                        className="cursor-pointer rounded-xl py-2.5 gap-3 focus:bg-primary/5 group"
                    >
                        <div
                            className={cn(
                                'p-2 rounded-lg bg-background border border-muted/50 transition-colors group-focus:border-primary/30',
                                config.color
                            )}
                        >
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm group-focus:text-primary transition-colors">
                            {config.label}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AddSubmissions
