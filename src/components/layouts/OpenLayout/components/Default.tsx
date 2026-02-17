import { ReactNode, useState, useEffect, useRef } from 'react'
import Logo from '@/components/template/Logo'
import { Link } from 'react-router-dom'
import Footer from '@/components/template/Footer'
import { Button } from '@/components/shadcn/ui/button'
import AnimatedBackdrop from '@/components/shared/AnimatedBackdrop'
import { Menu, X, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/components/shadcn/utils'

interface OpenLayoutProps {
    children?: ReactNode
}

const OpenLayout = ({ children }: OpenLayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('home')

    const navLinks = [
        { href: '#home', label: 'Home', id: 'home' },
        { href: '#about', label: 'About', id: 'about' },
        { href: '#features', label: 'Features', id: 'features' },
        { href: '#domains', label: 'Domains', id: 'domains' },
        { href: '#partners', label: 'Partner Portals', id: 'partners' },
    ]

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -80% 0px',
            threshold: 0,
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        navLinks.forEach((link) => {
            const section = document.getElementById(link.id)
            if (section) observer.observe(section)
        })

        return () => observer.disconnect()
    }, [])

    const scrollToSection = (direction: 'up' | 'down') => {
        const sectionElements = navLinks.map(link => document.getElementById(link.id))

        // Find current section index based on scroll position
        const viewportMiddle = window.innerHeight / 3
        let currentIdx = sectionElements.findIndex((el) => {
            if (!el) return false
            const rect = el.getBoundingClientRect()
            return rect.top <= viewportMiddle && rect.bottom > viewportMiddle
        })

        // Fallback for edge cases
        if (currentIdx === -1) {
            currentIdx = navLinks.findIndex(l => l.id === activeSection)
        }

        let nextIdx = currentIdx
        if (direction === 'up') {
            nextIdx = Math.max(0, currentIdx - 1)
        } else {
            nextIdx = Math.min(navLinks.length - 1, currentIdx + 1)
        }

        if (nextIdx !== currentIdx || currentIdx === -1) {
            const nextSection = sectionElements[nextIdx]
            if (nextSection) {
                // If it's the home section, scroll to top
                if (nextIdx === 0) {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                    nextSection.scrollIntoView({ behavior: 'smooth' })
                }
            }
        }
    }

    const footerRef = useRef<HTMLDivElement>(null)
    const [isFooterVisible, setIsFooterVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting)
            },
            { threshold: 0.1 }
        )

        if (footerRef.current) {
            observer.observe(footerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <div className="flex flex-col min-h-screen relative">
            <AnimatedBackdrop />

            {/* Desktop & Mobile Header */}
            <header className="m-4 lg:m-10 top-0 left-0 right-0 z-50 flex items-center justify-between h-16 sm:h-20 px-6 sm:px-10 lg:px-12 xl:px-16 border border-secondary rounded-xl bg-transparent backdrop-blur-md">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <Logo imgClass="w-full" logoWidth="80%" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-all duration-300 relative py-1",
                                activeSection === link.id
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            {link.label}
                            {activeSection === link.id && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
                            )}
                        </a>
                    ))}
                    <Link to="/sign-in">
                        <Button variant="default" className="bg-warning rounded-full px-6">
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
                <div className="fixed top-20 left-4 right-4 z-40 lg:hidden bg-background/95 backdrop-blur-xl border border-secondary rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <nav className="px-4 py-6 space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200",
                                    activeSection === link.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
                                )}
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/sign-in"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block pt-4 px-2"
                        >
                            <Button
                                variant="default"
                                className="w-full bg-warning rounded-full py-6 text-base"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </nav>
                </div>
            )}

            <main className="grow pt-4">{children}</main>

            {/* Footer Wrapper with Ref */}
            <div ref={footerRef}>
                <Footer className="mt-12 sm:mt-16 lg:mt-20" />
            </div>

            {/* Scroll Navigation Buttons */}
            <div className={cn(
                "fixed bottom-8 right-8 z-[100] flex flex-col gap-3 transition-opacity duration-300",
                isFooterVisible && "opacity-0 pointer-events-none"
            )}>
                <button
                    onClick={() => scrollToSection('up')}
                    disabled={activeSection === navLinks[0].id}
                    className={cn(
                        "p-3 rounded-full bg-primary/20 backdrop-blur-md text-primary shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none hover:shadow-primary/20 hover:bg-primary hover:text-background",
                    )}
                    aria-label="Previous section"
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
                <button
                    onClick={() => scrollToSection('down')}
                    disabled={activeSection === navLinks[navLinks.length - 1].id}
                    className={cn(
                        "p-3 rounded-full bg-primary/20 backdrop-blur-md text-primary shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none hover:shadow-primary/20 hover:bg-primary hover:text-background",
                    )}
                    aria-label="Next section"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}

export default OpenLayout