import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Table, Floor, CreateTableInput } from '@/@types/table'

type AddTableDialogProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (input: CreateTableInput) => Promise<void>
    floors: Floor[]
    editTable?: Table | null
}

const AddTableDialog = ({
    isOpen,
    onClose,
    onSubmit,
    floors,
    editTable,
}: AddTableDialogProps) => {
    const [number, setNumber] = useState('')
    const [capacity, setCapacity] = useState('4')
    const [floorId, setFloorId] = useState('')
    const [status, setStatus] = useState<Table['status']>('available')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (editTable) {
            setNumber(editTable.number)
            setCapacity(editTable.capacity.toString())
            setFloorId(editTable.floorId)
            setStatus(editTable.status)
        } else {
            setNumber('')
            setCapacity('4')
            setFloorId(floors[0]?.id || '')
            setStatus('available')
        }
    }, [editTable, floors, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!number || !floorId) return

        setIsSubmitting(true)
        try {
            const floor = floors.find((f) => f.id === floorId)
            await onSubmit({
                number,
                name: `Table ${number}`,
                floorId,
                floorName: floor?.name || '',
                capacity: parseInt(capacity),
                status,
                enabled: true,
            })
            onClose()
        } catch (error) {
            console.error('Error submitting table:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-foreground">
                        {editTable ? 'Edit Table' : 'Add Table'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Table Number */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Table Number or Name *
                            </label>
                            <input
                                type="text"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="Table_12"
                                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Capacity (Seats)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="4"
                                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Floor */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Floor
                            </label>
                            <select
                                value={floorId}
                                onChange={(e) => setFloorId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                {floors.map((floor) => (
                                    <option key={floor.id} value={floor.id}>
                                        {floor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Table['status'])}
                                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="reserved">Reserved</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border rounded-lg text-foreground hover:bg-muted transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTableDialog
