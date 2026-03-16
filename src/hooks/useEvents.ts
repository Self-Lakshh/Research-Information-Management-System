import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAllEvents,
    getActiveEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    deactivateEvent,
    activateEvent,
} from '@/services/firebase/events/event.services'
import type { EventRecord, CreateEventData, UpdateEventData } from '@/services/firebase/events/types'

export const EVENTS_QUERY_KEY = ['events']

export const useAllEvents = () => {
    return useQuery({
        queryKey: EVENTS_QUERY_KEY,
        queryFn: getAllEvents,
    })
}

export const useActiveEvents = () => {
    return useQuery({
        queryKey: [...EVENTS_QUERY_KEY, 'active'],
        queryFn: getActiveEvents,
    })
}

export const useCreateEvent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
        },
    })
}

export const useUpdateEvent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
            updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
        },
    })
}

export const useDeleteEvent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
        },
    })
}

export const useToggleEventStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, setActive }: { id: string; setActive: boolean }) =>
            setActive ? activateEvent(id) : deactivateEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
        },
    })
}
