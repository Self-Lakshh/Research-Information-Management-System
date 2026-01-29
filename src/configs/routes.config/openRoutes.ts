import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const openRoutes: Routes = [
    {
        key: 'public.landing',
        path: '/',
        component: lazy(() => import('@/views/public/Landing')),
        authority: [],
    },
    {
        key: 'public.privacyPolicy',
        path: '/privacy-policy',
        component: lazy(() => import('@/views/public/LeagalPages/PrivacyPolicy')),
        authority: [],
    },
    {
        key: 'public.termsConditions',
        path: '/terms-and-conditions',
        component: lazy(() => import('@/views/public/LeagalPages/TermsConditions')),
        authority: [],
    },
    {
        key: 'public.cookiePolicy',
        path: '/cookie-policy',
        component: lazy(() => import('@/views/public/LeagalPages/CookiePolicy')),
        authority: [],
    },
    {
        key: 'public.library',
        path: '/library',
        component: lazy(() => import('@/views/public/Library')),
        authority: [],
    }
]

export default openRoutes
