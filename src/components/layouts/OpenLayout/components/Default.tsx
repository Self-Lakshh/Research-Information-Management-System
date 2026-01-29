import { ReactNode, useState } from 'react'
import Logo from '@/components/template/Logo'
import { Link } from 'react-router-dom'
import Footer from '@/components/template/Footer'
import { Button } from '@/components/shadcn/ui/button'
import AnimatedBackdrop from '@/components/shared/AnimatedBackdrop'
import { Menu, X } from 'lucide-react'

interface OpenLayoutProps {
    children?: ReactNode
}

const OpenLayout = ({ children }: OpenLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#billing', label: 'Billing' },
        { href: '#inventory', label: 'Inventory' },
        { href: '#integrations', label: 'Integrations' },
        { href: '#pricing', label: 'Pricing' },
    ]

    return (
        <div className="flex flex-col min-h-screen relative">
            <AnimatedBackdrop />

            {/* Desktop & Mobile Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center">
                                <Logo logoWidth={180} className="lg:w-[240px]" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                                </a>
                            ))}
                        </nav>

                        {/* Desktop Sign In Button */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link to="/sign-in">
                                <Button
                                    variant="default"
                                    className="bg-warning hover:bg-warning/90 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <nav className="px-4 pb-6 pt-2 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/sign-in"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block"
                        >
                            <Button
                                variant="default"
                                className="w-full bg-warning hover:bg-warning/90 text-white rounded-lg mt-4 shadow-md"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="grow">{children}</main>
            <Footer className="mt-16 sm:mt-24 lg:mt-32" />
        </div>
    )
}

export default OpenLayout
