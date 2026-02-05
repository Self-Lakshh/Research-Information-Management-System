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
                'w-full bg-foreground dark:bg-gray-900 text-background dark:text-foreground px-4 lg:px-8 py-6',
                className,
            )}
        >
            {/* ================= ROW 1 ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Logo */}
                <Link to="/" className="flex justify-center md:justify-start">
                    <Logo logoWidth={220} mode="dark" />
                </Link>

                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-4">
                    {developers.map((dev, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-background/5 transition-colors hover:bg-background/10"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                    {dev.name}
                                </span>
                                <span className="text-xs text-background/60 dark:text-foreground/60">
                                    {dev.role}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={dev.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <Github size={16} />
                                </a>
                                <a
                                    href={dev.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    <Linkedin size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= DIVIDER ================= */}
            <div className="my-6 h-px bg-background/10 dark:bg-foreground/10" />

            {/* ================= ROW 2 ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
                {/* Rights */}
                <p className="text-center md:text-left text-background/50 dark:text-foreground/50">
                    © {new Date().getFullYear()} All rights reserved @ Sir
                    Padampat Singhania University, Udaipur
                </p>

                {/* College Socials */}
                <div className="flex justify-center md:justify-end gap-5">
                    <a href="#" aria-label="Twitter">
                        <Twitter size={18} />
                    </a>

                    <a href="#" aria-label="LinkedIn">
                        <Linkedin size={18} />
                    </a>

                    <a href="#" aria-label="YouTube">
                        <Youtube size={18} />
                    </a>

                    <a href="mailto:support@spsu.ac.in" aria-label="Mail">
                        <Mail size={18} />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default FooterContent
