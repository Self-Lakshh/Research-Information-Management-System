import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tableMockService } from '@/mock/mockServices/tableMockService'
import type {
    CreateTableInput,
    UpdateTableInput,
    CreateFloorInput,
    UpdateFloorInput,
} from '@/@types/table'

const QUERY_KEYS = {
    tables: ['tables'],
    table: (id: string) => ['tables', id],
    floors: ['floors'],
    tableOrders: (tableId: string) => ['table-orders', tableId],
    stats: ['table-stats'],
}

export const useTables = () => {
    return useQuery({
        queryKey: QUERY_KEYS.tables,
        queryFn: tableMockService.getTables,
    })
}

export const useTable = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.table(id),
        queryFn: () => tableMockService.getTableById(id),
        enabled: !!id,
    })
}

export const useCreateTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateTableInput) => tableMockService.createTable(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.floors })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats })
        },
    })
}

export const useUpdateTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: UpdateTableInput) => tableMockService.updateTable(input),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.table(data.id) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.floors })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats })
        },
    })
}

export const useDeleteTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => tableMockService.deleteTable(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.floors })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats })
        },
    })
}

export const useToggleTableStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => tableMockService.toggleTableStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats })
        },
    })
}

export const useFloors = () => {
    return useQuery({
        queryKey: QUERY_KEYS.floors,
        queryFn: tableMockService.getFloors,
    })
}

export const useCreateFloor = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: CreateFloorInput) => tableMockService.createFloor(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.floors })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats })
        },
    })
}

export const useUpdateFloor = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: UpdateFloorInput) => tableMockService.updateFloor(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.floors })
        },
    })
}

export const useDeleteFloor = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => tableMockService.deleteFloor(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.floors })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats })
        },
    })
}

export const useTableOrders = (tableId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.tableOrders(tableId),
        queryFn: () => tableMockService.getTableOrders(tableId),
        enabled: !!tableId,
    })
}

export const useTableStats = () => {
    return useQuery({
        queryKey: QUERY_KEYS.stats,
        queryFn: tableMockService.getTableStats,
    })
}
