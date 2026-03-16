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
    {
        key: 'admin.user-profile',
        path: '/admin/user-profile/:id',
        component: lazy(() => import('@/views/admin/User_Management/components/UserProfile')),
        authority: [ADMIN],
    },
    {
        key: 'admin.manage-events',
        path: '/admin/manage-events',
        component: lazy(() => import('@/views/admin/Manage_Events')),
        authority: [ADMIN],
    },
    {
        key: 'admin.manage-partners',
        path: '/admin/manage-partners',
        component: lazy(() => import('@/views/admin/Manage_Partners')),
        authority: [ADMIN],
    },
]

export default adminRoutes
