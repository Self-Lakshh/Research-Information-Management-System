import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAllPartners,
    createPartner,
    updatePartner,
    deletePartner,
    deactivatePartner,
    activatePartner,
    getActivePartners,
} from '@/services/firebase/partners/partner.services'
import type { Partner, CreatePartnerData, UpdatePartnerData } from '@/services/firebase/partners/types'

export const PARTNERS_QUERY_KEY = ['partners']

export const useAllPartners = () => {
    return useQuery({
        queryKey: PARTNERS_QUERY_KEY,
        queryFn: getAllPartners,
    })
}

export const useActivePartners = () => {
    return useQuery({
        queryKey: [...PARTNERS_QUERY_KEY, 'active'],
        queryFn: getActivePartners,
    })
}

export const useCreatePartner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createPartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
        },
    })
}

export const useUpdatePartner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePartnerData }) =>
            updatePartner(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
        },
    })
}

export const useTogglePartnerStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, setActive }: { id: string; setActive: boolean }) =>
            setActive ? activatePartner(id) : deactivatePartner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
        },
    })
}

export const useDeletePartner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deletePartner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY })
        },
    })
}
