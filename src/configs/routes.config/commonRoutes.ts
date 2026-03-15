import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const commonRoutes: Routes = [
    {
        key: 'common.profile',
        path: '/profile',
        component: lazy(() => import('@/views/user/Profile')),
        authority: [ADMIN, USER],
    },
]

export default commonRoutes
