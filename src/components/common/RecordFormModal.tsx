import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/shadcn/ui/dialog'
import { Button } from '@/components/shadcn/ui/button'
import { DynamicForm } from '@/components/common/DynamicForm'
import { SUBMISSION_TYPES } from '@/configs/submission.config'

interface RecordFormModalProps {
    isOpen: boolean
    onClose: () => void
    type: string
    initialData?: any
    onSubmit: (data: any) => void
    loading?: boolean
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
    isOpen,
    onClose,
    type,
    initialData,
    onSubmit,
    loading
}) => {
    const [formData, setFormData] = React.useState<any>(initialData || {})
    const typeKey = (type || 'journal').toLowerCase()
    const config = SUBMISSION_TYPES[typeKey] || SUBMISSION_TYPES.journal

    React.useEffect(() => {
        setFormData(initialData || {})
    }, [initialData, isOpen])

    if (!config) return null

    const handleFieldChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = () => {
        onSubmit(formData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-primary/5 border-b">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {initialData ? 'Edit' : 'Add'} {config.label}
                    </DialogTitle>
                    <DialogDescription>
                        Please fill in the details for this {config.label.toLowerCase()} record.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <DynamicForm
                        fields={config.fields}
                        data={formData}
                        onChange={handleFieldChange}
                    />
                </div>

                <DialogFooter className="p-4 bg-muted/30 border-t gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="rounded-xl px-8">
                        {loading ? 'Saving...' : initialData ? 'Update Record' : 'Save Record'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
