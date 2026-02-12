import { Link } from 'react-router-dom'
import { Linkedin, Github, Twitter, Youtube, Mail } from 'lucide-react'
import Logo from './Logo'

import { cn } from '@/components/shadcn/utils'

interface FooterProps {
    className?: string
}

const FooterContent = ({ className }: FooterProps) => {
    const developers = [
        {
            name: 'Lakshya Chopra',
            role: 'Project Lead',
            github: '#',
            linkedin: '#',
        },
        {
            name: 'Riya',
            role: 'Frontend Developer',
            github: '#',
            linkedin: '#',
        },
        {
            name: 'Harshit Suthar',
            role: 'Design Lead',
            github: '#',
            linkedin: '#',
        },
    ]

    return (
        <div
            className={cn(
                'w-full bg-blue-700 dark:bg-gray-900 text-background dark:text-foreground px-4 lg:px-8 py-6',
                className,
            )}
        >
            {/* ================= ROW 1 ================= */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-10">
                {/* Logo & Description */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                    <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
                        <Logo logoWidth={300} mode="dark" />
                    </Link>
                </div>

                {/* Developers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {developers.map((dev, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl bg-background/5 border border-background/20 transition-all duration-300 group backdrop-blur-sm"
                        >
                            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-background font-bold text-lg group-hover:scale-110 transition-transform">
                                {dev.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-tight">
                                    {dev.name}
                                </span>
                                <span className="text-[10px] sm:text-xs font-medium text-background/70 dark:text-foreground/50 uppercase tracking-wider">
                                    {dev.role}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 ml-auto pl-2 border-l border-background/10">
                                <a
                                    href={dev.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-full border border-background/20 hover:bg-background/20 transition-colors text-background"
                                >
                                    <Github size={18} />
                                </a>
                                <a
                                    href={dev.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-full border border-background/20 hover:bg-background/20 transition-colors text-background"
                                >
                                    <Linkedin size={18} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= DIVIDER ================= */}
            <div className="my-8 h-px bg-background/20 dark:bg-foreground/20" />

            {/* ================= ROW 2 ================= */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
                {/* Rights */}
                <div className="order-2 md:order-1 text-center md:text-left space-y-1">
                    <p className="text-background dark:text-background font-medium">
                        © {new Date().getFullYear()} Sir Padampat Singhania University, Udaipur
                    </p>
                </div>

                {/* College Socials */}
                <div className="order-1 md:order-2 flex items-center justify-center gap-4">
                    {[
                        { icon: <Twitter size={18} />, label: "Twitter", href: "#" },
                        { icon: <Linkedin size={18} />, label: "LinkedIn", href: "#" },
                        { icon: <Youtube size={18} />, label: "YouTube", href: "#" },
                        { icon: <Mail size={18} />, label: "Mail", href: "mailto:support@spsu.ac.in" }
                    ].map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            aria-label={social.label}
                            className="h-10 w-10 flex items-center justify-center rounded-full bg-background/5 border border-background/10 hover:bg-background/10 hover:-translate-y-1 transition-all duration-300 text-background/70 "
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FooterContent
