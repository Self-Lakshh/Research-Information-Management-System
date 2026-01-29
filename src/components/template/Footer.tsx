import Container from '@/components/shared/Container'
import classNames from '@/utils/classNames'
import { APP_NAME } from '@/constants/app.constant'
import { Link } from 'react-router-dom'
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    MapPin,
    Phone,
    Mail,
} from 'lucide-react'
import Logo from './Logo'

type FooterProps = {
    className?: string
}

const FooterContent = () => {
    const footerLinks = {
        tabs: [
            { label: 'About', href: '#about' },
            { label: 'Features', href: '#features' },
            { label: 'Categories', href: '#categories' },
            { label: 'Partner Portals', href: '#partner-portals' },
        ],
        developers: [
            {
                name: 'Lakshya Chopra',
                position: 'Project Lead',
                github: '#',
                linkedin: '#'
            },
            {
                name: 'Riya',
                position: 'Frontend Developer',
                github: '#',
                linkedin: '#'
            },
            {
                name: 'Harshit Suthar',
                position: 'Design Lead',
                github: '#',
                linkedin: '#'
            },
        ],
    }

    return (
        <div className="flex items-center bg-foreground dark:bg-gray-900 text-background dark:text-foreground justify-between w-full">
            <div className=" mx-auto px-4 lg:px-6 py-10 lg:py-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Logo & Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Link to="/">
                                <Logo logoWidth={320} mode="dark" />
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-background/70 dark:text-foreground">
                                <p>Sir Padampat Singhania University</p>
                            </div>
                            <div className="flex items-center text-background/70 dark:text-foreground">
                                <p>Bhatewar Udaipur 313601,</p>
                            </div>
                            <div className="flex items-center text-background/70 dark:text-foreground">
                                <p>Rajasthan India</p>
                            </div>
                            <div className="flex items-center text-background/70 dark:text-foreground">
                                <p>1800 8896 555</p>
                            </div>
                            <div className="flex items-center text-background/70 dark:text-foreground">
                                <p>info@spsu.ac.in</p>
                            </div>
                        </div>
                    </div>

                    {/* Tab Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Tabs</h4>
                        <ul className="space-y-3">
                            {footerLinks.tabs.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-background/70 dark:text-foreground hover:text-background transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Developer Links */}
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-white mb-4">Developers</h4>
                        <ul className="space-y-3">
                            {footerLinks.developers.map((developer, index) => (
                                <li key={index}>
                                    <div className="flex items-center gap-2">
                                        <div className="text-background/90 dark:text-foreground font-medium">
                                            {developer.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={developer.github}
                                                className="text-background/70 dark:text-foreground hover:text-background transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="GitHub"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>
                                            <a
                                                href={developer.linkedin}
                                                className="text-background/70 dark:text-foreground hover:text-background transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="LinkedIn"
                                            >
                                                <Linkedin size={16} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="text-background/60 dark:text-foreground/80 text-sm">
                                        {developer.position}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-background/10 dark:border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-background/60 dark:text-foreground text-sm">
                        © {new Date().getFullYear()} SPSU. All rights
                        reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-background/60 dark:text-foreground hover:text-background transition-colors"
                        >
                            <Facebook size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-background/60 dark:text-foreground hover:text-background transition-colors"
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-background/60 dark:text-foreground hover:text-background transition-colors"
                        >
                            <Instagram size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-background/60 dark:text-foreground hover:text-background transition-colors"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href="#"
                            className="text-background/60 dark:text-foreground hover:text-background transition-colors"
                        >
                            <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Footer({ className }: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16`,
                className,
            )}
        >
            <FooterContent />
        </footer>
    )
}
