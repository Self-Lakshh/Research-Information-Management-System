import { lazy } from 'react'
import { USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const userRoutes: Routes = [
    {
        key: 'user.dashboard',
        path: '/user/dashboard',
        component: lazy(() => import('@/views/user/Dashboard')),
        authority: [USER],
    },
    {
        key: 'user.profile',
        path: '/profile',
        component: lazy(() => import('@/views/user/Profile')),
        authority: [USER],
    },
    {
        key: 'user.submissions',
        path: '/user/submissions',
        component: lazy(() => import('@/views/user/Submissions')),
        authority: [USER],
    },
]

export default userRoutes
