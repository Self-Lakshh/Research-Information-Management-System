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
import { DynamicForm } from './DynamicForm'
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config'
import { RecordType } from '@/@types/rims.types'

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
    const typeKey = (type || 'journal').toLowerCase() as RecordType
    const config = RECORD_TYPE_CONFIG[typeKey] || RECORD_TYPE_CONFIG.journal

    React.useEffect(() => {
        if (initialData) {
            // Flatten the 'data' object so DynamicForm can read the keys directly
            setFormData({
                ...initialData,
                ...(initialData.data || {})
            })
        } else {
            setFormData({})
        }
    }, [initialData, isOpen])

    if (!config) return null

    const handleFieldChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = () => {
        const submitData: any = {
            title: formData.title || '',
            year: formData.year || formData.publicationYear || new Date().getFullYear().toString(),
            description: formData.description || '',
            data: {}
        }

        // Put all config-defined fields (except root ones) into 'data'
        config.fields.forEach(field => {
            if (!['title', 'description'].includes(field.key)) {
                submitData.data[field.key] = formData[field.key]
            }
        })

        // Capture files if added
        if (formData.file) {
            submitData.files = [formData.file]
        }

        onSubmit(submitData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-card border border-muted/50 rounded-3xl shadow-premium">
                <DialogHeader className="p-6 bg-primary/5 border-b border-muted/50">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {initialData ? 'Edit' : 'Add'} {config.label}
                    </DialogTitle>
                    <DialogDescription>
                        Please fill in the details for this {config.label.toLowerCase()} record.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <DynamicForm
                        fields={[...config.fields, { key: 'file', label: 'Supporting Document', type: 'file', gridSpan: 2 } as any]}
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
