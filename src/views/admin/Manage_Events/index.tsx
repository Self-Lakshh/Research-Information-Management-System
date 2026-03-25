import { useState, useMemo, useEffect } from 'react'
import {
    useAllEvents,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    useToggleEventStatus,
    useUpdateEventPositions,
} from '@/hooks/useEvents'
import { EventRecord } from '@/services/firebase/events/types'
import { EventCard } from './components/EventCard'
import { AddEvents } from './components/AddEvents'
import { EventFormModal } from './components/EventFormModal'
import { Spinner } from '@/components/shadcn/ui/spinner'
import { X, CalendarDays } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/components/shadcn/utils'

const ManageEvents = () => {
    const { data: rawEvents = [], isLoading, error } = useAllEvents()
    const createEvent = useCreateEvent()
    const updateEvent = useUpdateEvent()
    const deleteEvent = useDeleteEvent()
    const toggleStatus = useToggleEventStatus()
    const updatePositions = useUpdateEventPositions()

    const [localEvents, setLocalEvents] = useState<EventRecord[]>([])
    const [isDragging, setIsDragging] = useState<string | null>(null)

    // Sync local state with query data
    useEffect(() => {
        if (rawEvents && !isDragging) {
            const active = (rawEvents as EventRecord[])
                .filter((e) => e.is_active === true) // Ensure strict sync with Showcase
                .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            setLocalEvents(active)
        }
    }, [rawEvents, isDragging])

    const events = localEvents

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

    const handleFormSubmit = async (data: any) => {
        if (selectedEvent) {
            await updateEvent.mutateAsync({ id: selectedEvent.id, data })
        } else {
            // Set position for new event
            const maxPos = events.reduce((max: number, e: EventRecord) => Math.max(max, e.position || 0), 0)
            await createEvent.mutateAsync({ ...data, position: maxPos + 10 })
        }
    }

    const handleMove = async (id: string, direction: 'up' | 'down') => {
        const currentIndex = events.findIndex((e: EventRecord) => e.id === id)
        if (currentIndex === -1) return

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
        if (targetIndex < 0 || targetIndex >= events.length) return

        const newEvents = [...events]
        const [moved] = newEvents.splice(currentIndex, 1)
        newEvents.splice(targetIndex, 0, moved)

        setLocalEvents(newEvents)
        await saveNewOrder(newEvents)
    }

    const handleDragStart = (id: string) => {
        setIsDragging(id)
    }

    const handleDragEnter = (id: string) => {
        if (!isDragging || isDragging === id) return

        const draggedIdx = events.findIndex(ev => ev.id === isDragging)
        const targetIdx = events.findIndex(ev => ev.id === id)

        if (draggedIdx !== -1 && targetIdx !== -1) {
            const newEvents = [...events]
            const [moved] = newEvents.splice(draggedIdx, 1)
            newEvents.splice(targetIdx, 0, moved)
            setLocalEvents(newEvents)
        }
    }

    const handleDragEnd = async () => {
        setIsDragging(null)
        // Only save if the order actually changed from the query data
        const initialOrder = (rawEvents as EventRecord[])
            .filter((e) => e.is_active === true)
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            .map(e => e.id)
            .join(',')

        const currentOrder = localEvents.map(e => e.id).join(',')

        if (initialOrder !== currentOrder) {
            await saveNewOrder(localEvents)
        }
    }

    const saveNewOrder = async (orderedEvents: EventRecord[]) => {
        try {
            const updates = orderedEvents.map((ev, idx) => {
                const newPos = (idx + 1) * 10
                if (ev.position !== newPos) {
                    return { id: ev.id, position: newPos }
                }
                return null
            }).filter((u): u is { id: string; position: number } => u !== null)

            if (updates.length > 0) {
                await updatePositions.mutateAsync(updates)
            }
        } catch (err) {
            console.error('Failed to save event order:', err)
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
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {events.map((event: EventRecord, index: number) => (
                                <motion.div
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={cn(
                                        "relative cursor-move",
                                        isDragging === event.id && "z-50 opacity-50 scale-105"
                                    )}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={() => handleDragEnter(event.id)}
                                >
                                    <EventCard
                                        event={event}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                        onMoveUp={index > 0 ? () => handleMove(event.id, 'up') : undefined}
                                        onMoveDown={index < events.length - 1 ? () => handleMove(event.id, 'down') : undefined}
                                        onDragStart={() => handleDragStart(event.id)}
                                        onDragEnd={handleDragEnd}
                                        isDragging={isDragging === event.id}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
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