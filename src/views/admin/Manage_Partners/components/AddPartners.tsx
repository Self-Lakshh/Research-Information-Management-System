import { Button } from '@/components/shadcn/ui/button'
import { Plus } from 'lucide-react'

interface AddPartnersProps {
    onAddClick: () => void
}

export const AddPartners = ({ onAddClick }: AddPartnersProps) => {
    return (
        <Button 
            onClick={onAddClick} 
            className="h-10 px-4 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-premium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
            <Plus className="h-4 w-4 stroke-[3px]" />
            Add Partner
        </Button>
    )
}

export default AddPartners
