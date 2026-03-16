import { useState } from 'react'
import {
    useAllPartners,
    useCreatePartner,
    useUpdatePartner,
    useDeletePartner,
    useTogglePartnerStatus,
} from '@/hooks/usePartners'
import { Partner } from '@/services/firebase/partners/types'
import { PartnerCard } from './components/PartnerCard'
import { AddPartners } from './components/AddPartners'
import { PartnerFormModal } from './components/PartnerFormModal'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { X } from 'lucide-react'

const ManagePartners = () => {
    const { data: rawPartners = [], isLoading, error } = useAllPartners()
    const partners = rawPartners.filter((p: any) => p.is_active !== false)
    const createPartner = useCreatePartner()
    const updatePartner = useUpdatePartner()
    const deletePartner = useDeletePartner()
    const toggleStatus = useTogglePartnerStatus()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

    const handleAddClick = () => {
        setSelectedPartner(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (partner: Partner) => {
        setSelectedPartner(partner)
        setIsModalOpen(true)
    }

    const handleDeleteClick = async (id: string) => {
        try {
            await toggleStatus.mutateAsync({ id, setActive: false })
        } catch (err) {
            console.error(err)
            alert('Failed to deactivate partner.')
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleStatus.mutateAsync({ id, setActive: !currentStatus })
        } catch (err) {
            console.error(err)
            alert('Failed to toggle partner status.')
        }
    }

    const handleFormSubmit = async (data: any) => {
        if (selectedPartner) {
            await updatePartner.mutateAsync({ id: selectedPartner.id, data })
        } else {
            await createPartner.mutateAsync(data)
        }
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="shrink-0 bg-card flex items-center justify-between p-4 rounded-lg border border-border/50 shadow-premium">
                <h1 className="text-2xl font-bold tracking-tight">Manage Partners</h1>
                <AddPartners onAddClick={handleAddClick} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-card p-4 rounded-lg border border-border/50 shadow-premium">
                {error ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 bg-card rounded-3xl border border-rose-500/20">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                            <X className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold text-rose-500">Error Loading Partners</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">
                            {(error as any).message}
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                        <Spinner className="w-8 h-8 text-primary" />
                        <p className="text-sm text-muted-foreground font-medium animate-pulse">
                            Loading partners...
                        </p>
                    </div>
                ) : partners.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-2">
                        {partners.map((partner) => (
                            <PartnerCard
                                key={partner.id}
                                partner={partner}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/60">
                        <h3 className="text-xl font-bold text-foreground">No Partners Found</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            You haven't added any partners yet. Click the button above to add one.
                        </p>
                    </div>
                )}
            </div>

            <PartnerFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedPartner}
                onSubmit={handleFormSubmit}
                loading={createPartner.isPending || updatePartner.isPending}
            />
        </div>
    )
}

export default ManagePartners