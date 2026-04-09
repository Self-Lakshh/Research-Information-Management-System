import { Button } from '@/components/shadcn/ui/button'
import { Plus } from 'lucide-react'

interface AddEventsProps {
    onAddClick: () => void
}

export const AddEvents = ({ onAddClick }: AddEventsProps) => {
    return (
        <Button 
            onClick={onAddClick}
            className="h-10 px-4 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-premium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
            <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Add Event
        </Button>
    )
}
