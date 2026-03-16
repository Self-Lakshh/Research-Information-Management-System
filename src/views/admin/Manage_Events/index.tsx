import { useState } from 'react'
import {
    useAllEvents,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    useToggleEventStatus,
} from '@/hooks/useEvents'
import { EventRecord } from '@/services/firebase/events/types'
import { EventCard } from './components/EventCard'
import { AddEvents } from './components/AddEvents'
import { EventFormModal } from './components/EventFormModal'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { X, CalendarDays } from 'lucide-react'

const ManageEvents = () => {
    const { data: rawEvents = [], isLoading, error } = useAllEvents()
    const events = rawEvents.filter((e: any) => e.is_active !== false)
    const createEvent = useCreateEvent()
    const updateEvent = useUpdateEvent()
    const deleteEvent = useDeleteEvent()
    const toggleStatus = useToggleEventStatus()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null)

    const handleAddClick = () => {
        setSelectedEvent(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (event: EventRecord) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    const handleDeleteClick = async (id: string) => {
        try {
            await toggleStatus.mutateAsync({ id, setActive: false })
        } catch (err) {
            console.error(err)
            alert('Failed to deactivate event.')
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleStatus.mutateAsync({ id, setActive: !currentStatus })
        } catch (err) {
            console.error(err)
            alert('Failed to toggle event status.')
        }
    }

    const handleFormSubmit = async (data: any) => {
        if (selectedEvent) {
            await updateEvent.mutateAsync({ id: selectedEvent.id, data })
        } else {
            await createEvent.mutateAsync(data)
        }
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="shrink-0 bg-card flex items-center justify-between p-4 rounded-lg border border-border/50 shadow-premium">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <CalendarDays className="text-primary h-6 w-6" />
                        Manage Events
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium">Capture & Display Institutional Milestones</p>
                </div>
                <AddEvents onAddClick={handleAddClick} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-card p-4 rounded-xl border border-border/50 shadow-premium custom-scrollbar">
                {error ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 bg-card rounded-3xl border border-rose-500/20">
                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                            <X className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold text-rose-500">Error Loading Events</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">
                            {(error as any).message}
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                        <Spinner className="w-8 h-8 text-primary" />
                        <p className="text-sm text-muted-foreground font-medium animate-pulse">
                            Synchronizing archives...
                        </p>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-2">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/60">
                        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                             <CalendarDays className="h-8 w-8 text-primary/30" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No Events Found</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center">
                            Your institutional timeline is waiting. Click "Add Event" to begin broadcasting milestones.
                        </p>
                    </div>
                )}
            </div>

            <EventFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedEvent}
                onSubmit={handleFormSubmit}
                loading={createEvent.isPending || updateEvent.isPending}
            />
        </div>
    )
}

export default ManageEvents