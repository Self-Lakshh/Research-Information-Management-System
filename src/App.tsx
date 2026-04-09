import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './configs/queryClient'

import { Toaster } from 'sonner'

function App() {
    return (
        <Theme>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        <Layout>
                            <Views />
                        </Layout>
                    </AuthProvider>
                </BrowserRouter>
                <ReactQueryDevtools initialIsOpen={false} />
                <Toaster position="bottom-right" richColors toastOptions={{
                    style: { borderRadius: '12px', padding: '16px', fontWeight: 'bold' }
                }} />
            </QueryClientProvider>
        </Theme>
    )
}

export default App
