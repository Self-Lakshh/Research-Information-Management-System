import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { ADMIN } from '@/constants/roles.constant'

const Home = () => {
    const { user } = useAuth()

    const isAdmin = user.authority?.includes(ADMIN)

    // Redirect to appropriate dashboard based on user role
    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/dashboard" replace />
}

export default Home
