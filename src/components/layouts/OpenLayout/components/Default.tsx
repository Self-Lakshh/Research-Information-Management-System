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
        { href: '#home', label: 'Home' },
        { href: '#about', label: 'About' },
        { href: '#features', label: 'Features' },
        { href: '#domains', label: 'Domains' },
        { href: '#partners', label: 'Partner Portals' },
    ]

    return (
        <div className="flex flex-col min-h-screen relative">
            <AnimatedBackdrop />

            {/* Desktop & Mobile Header */}
            <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-6 sm:px-10 lg:px-16 bg-transparent">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <Logo logoWidth={240} className="g lg:w-[240px]" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link to="/sign-in">
                        <Button variant="default" className="bg-warning rounded-full">
                            Sign In
                        </Button>
                    </Link>
                </nav>

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
            </header>

            {/* Mobile Menu - Outside header */}
            {mobileMenuOpen && (
                <div className="lg:hidden mx-4 sm:mx-6 mb-4 bg-white dark:bg-gray-900 border border-secondary rounded-2xl dark:border-gray-800 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <nav className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/sign-in"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block pt-2"
                        >
                            <Button
                                variant="default"
                                className="w-full bg-warning rounded-full"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </nav>
                </div>
            )}

            <main className="grow">{children}</main>
            <Footer className="mt-12 sm:mt-16 lg:mt-20" />
        </div>
    )
}

export default OpenLayout