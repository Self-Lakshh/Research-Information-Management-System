import { Button } from '@/components/shadcn/ui/button'
import { Plus } from 'lucide-react'

interface AddEventsProps {
    onAddClick: () => void
}

export const AddEvents = ({ onAddClick }: AddEventsProps) => {
    return (
        <Button 
            onClick={onAddClick}
            className="bg-primary hover:bg-primary/90 text-white shadow-premium transition-all duration-300 hover:scale-105 active:scale-95"
        >
            <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
    )
}
