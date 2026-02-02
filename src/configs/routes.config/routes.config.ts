import authRoute from './authRoute'
import openRoutes from './openRoutes'
import adminRoutes from './adminRoutes'
import userRoutes from './userRoutes'
import commonRoutes from './commonRoutes'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute, ...openRoutes]

export const protectedRoutes: Routes = [
    ...adminRoutes,
    ...userRoutes,
    ...commonRoutes,
]
