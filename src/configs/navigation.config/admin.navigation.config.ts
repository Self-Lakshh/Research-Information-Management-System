import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import { ADMIN } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const adminNavigationConfig: NavigationTree[] = [
    {
        key: 'admin.dashboard',
        path: '/admin/dashboard',
        title: 'Admin Dashboard',
        translateKey: 'nav.admin.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.recent-requests',
        path: '/admin/recent-requests',
        title: 'Recent Requests',
        translateKey: 'nav.admin.recentrequests',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.records',
        path: '/admin/records',
        title: 'Records',
        translateKey: 'nav.admin.records',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.user-management',
        path: '/admin/user-management',
        title: 'User Management',
        translateKey: 'nav.admin.user_management',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
]

export default adminNavigationConfig
