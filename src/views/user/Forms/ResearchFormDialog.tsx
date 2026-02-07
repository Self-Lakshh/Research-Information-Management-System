import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/shadcn/ui/dialog'
import { ResearchCategory } from '@/@types/research'
import ResearchForm from './ResearchForm'

interface ResearchFormDialogProps {
    category: ResearchCategory | null
    isOpen: boolean
    onClose: () => void
}

const categoryLabels: Record<ResearchCategory, string> = {
    IPR: 'Intellectual Property Right (IPR)',
    PHD_Student_Data: 'PhD Student Data',
    Journal: 'Journal Publication',
    Conference: 'Conference Proceeding',
    Book: 'Book / Chapters',
    Consultancy_Project_Grants: 'Consultancy & Grants',
    Awards: 'Awards & Recognition',
    Others: 'Other Academic Activities',
}

const ResearchFormDialog = ({ category, isOpen, onClose }: ResearchFormDialogProps) => {
    if (!category) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{categoryLabels[category]}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your {categoryLabels[category]} submission.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <ResearchForm category={category} onSuccess={onClose} onCancel={onClose} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResearchFormDialog
