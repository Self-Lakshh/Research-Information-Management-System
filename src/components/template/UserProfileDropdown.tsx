import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { PiUserDuotone, PiSignOutDuotone } from 'react-icons/pi'
import { useAuth } from '@/auth'

type DropdownList = {
    label: string
    path: string
    icon: React.ReactNode
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',
        path: '/profile',
        icon: <PiUserDuotone />,
    },
]

const _UserDropdown = () => {
    const { avatar, userName, email } = useSessionUser((state) => state.user)
    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
    }

    const initials = userName?.split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '?'

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} src={avatar}>
                        {!avatar && initials}
                    </Avatar>
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <Link className="py-2 px-3 flex items-center gap-3" to="/profile">
                    <Avatar src={avatar}>
                        {!avatar && initials}
                    </Avatar>
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                            {userName || 'Anonymous'}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                            {email || 'No email available'}
                        </div>
                    </div>
                </Link>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
