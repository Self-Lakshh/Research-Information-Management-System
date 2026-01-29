import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // Refetch when window is focused
            retry: false, // Don't retry on error for now
            staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
            gcTime: 1000 * 60 * 10, // Cache is kept for 10 minutes (formerly cacheTime)
        },
    },
})
