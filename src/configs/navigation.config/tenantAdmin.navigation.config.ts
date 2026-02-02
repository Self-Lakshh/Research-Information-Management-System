import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import { TENANT_ADMIN } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const tenantAdminNavigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [TENANT_ADMIN],
        subMenu: [],
    },
]

export default tenantAdminNavigationConfig
