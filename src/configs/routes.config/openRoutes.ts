import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const openRoutes: Routes = [
    {
        key: 'public.landing',
        path: '/',
        component: lazy(() => import('@/views/public/Landing')),
        authority: [],
    },
]

export default openRoutes
