import { Button } from '@/components/shadcn/ui/button'
import { Plus } from 'lucide-react'

interface AddPartnersProps {
    onAddClick: () => void
}

export const AddPartners = ({ onAddClick }: AddPartnersProps) => {
    return (
        <Button onClick={onAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Partner
        </Button>
    )
}

export default AddPartners
