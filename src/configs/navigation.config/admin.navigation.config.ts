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
        icon: 'submissions',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.records',
        path: '/admin/records',
        title: 'Records',
        translateKey: 'nav.admin.records',
        icon: 'report',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.user-management',
        path: '/admin/user-management',
        title: 'User Management',
        translateKey: 'nav.admin.user_management',
        icon: 'staffs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.manage-events',
        path: '/admin/manage-events',
        title: 'Manage Events',
        translateKey: 'nav.admin.manage_events',
        icon: 'staffs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.manage-partners',
        path: '/admin/manage-partners',
        title: 'Manage Partners',
        translateKey: 'nav.admin.manage_partners',
        icon: 'staffs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    }
]

export default adminNavigationConfig
