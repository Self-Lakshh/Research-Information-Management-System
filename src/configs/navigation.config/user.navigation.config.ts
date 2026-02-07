import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import { USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const userNavigationConfig: NavigationTree[] = [
    {
        key: 'user.dashboard',
        path: '/user/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.user.dashboard',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [USER],
        subMenu: [],
    },
    {
        key: 'user.submissions',
        path: '/user/submissions',
        title: 'My Submissions',
        translateKey: 'nav.user.submissions',
        icon: 'submissions',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [USER],
        subMenu: [],
    },
    {
        key: 'user.profile',
        path: '/user/profile',
        title: 'Profile',
        translateKey: 'nav.user.profile',
        icon: 'user',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [USER],
        subMenu: [],
    },
]

export default userNavigationConfig
