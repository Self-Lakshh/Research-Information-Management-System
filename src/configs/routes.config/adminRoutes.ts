import { lazy } from 'react'
import { ADMIN } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const adminRoutes: Routes = [
    {
        key: 'admin.dashboard',
        path: '/admin/dashboard',
        component: lazy(() => import('@/views/admin/Dashboard')),
        authority: [ADMIN],
    },
    {
        key: 'admin.records',
        path: '/admin/records',
        component: lazy(() => import('@/views/admin/Records')),
        authority: [ADMIN],
    },
    {
        key: 'admin.recent-requests',
        path: '/admin/recent-requests',
        component: lazy(() => import('@/views/admin/Recent_Requests')),
        authority: [ADMIN],
    },
    {
        key: 'admin.user-management',
        path: '/admin/user-management',
        component: lazy(() => import('@/views/admin/User_Management')),
        authority: [ADMIN],
    },
]

export default adminRoutes
