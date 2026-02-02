import adminNavigationConfig from './admin.navigation.config'
import userNavigationConfig from './user.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    ...adminNavigationConfig,
    ...userNavigationConfig,
]

export default navigationConfig
