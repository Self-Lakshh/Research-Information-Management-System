import SideNav from '@/components/template/SideNav'
import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import LayoutBase from '@/components/template/LayoutBase'
import useResponsive from '@/utils/hooks/useResponsive'
import Button from '@/components/ui/Button'
import {
    PiBellDuotone,
    PiArrowClockwiseBold,
    PiSunDuotone,
    PiMoonDuotone,
} from 'react-icons/pi'
import { TbChevronDown } from 'react-icons/tb'
import useDarkMode from '@/utils/hooks/useDarkMode'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/ui/select'
import { useEffect, useState, useMemo } from 'react'
import Logo from '@/components/template/Logo'
import { useSessionUser } from '@/store/authStore'

const CollapsibleSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()
    const [isDark, setIsDark] = useDarkMode()
    const [time, setTime] = useState(new Date())
    const { userName } = useSessionUser((state) => state.user)
    const [displayedText, setDisplayedText] = useState('')
    const [isTypingComplete, setIsTypingComplete] = useState(false)

    const welcomeMessage = useMemo(() => `Welcome, ${userName || 'User'}!`, [userName])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval) // cleanup
    }, [])

    // Typing effect for welcome message - continuous loop
    useEffect(() => {
        let currentIndex = 0
        let isDeleting = false
        let pauseTimeout: NodeJS.Timeout | null = null

        const typingInterval = setInterval(() => {
            if (!isDeleting) {
                // Typing forward
                if (currentIndex < welcomeMessage.length) {
                    setDisplayedText(welcomeMessage.slice(0, currentIndex + 1))
                    currentIndex++
                } else {
                    // Pause at the end before deleting
                    setIsTypingComplete(true)
                    clearInterval(typingInterval)
                    pauseTimeout = setTimeout(() => {
                        isDeleting = true
                        setIsTypingComplete(false)
                        startDeletingLoop()
                    }, 2000) // Pause for 2 seconds
                }
            }
        }, 80) // Typing speed in ms

        const startDeletingLoop = () => {
            const deleteInterval = setInterval(() => {
                if (currentIndex > 0) {
                    currentIndex--
                    setDisplayedText(welcomeMessage.slice(0, currentIndex))
                } else {
                    // Start typing again
                    clearInterval(deleteInterval)
                    setTimeout(() => {
                        isDeleting = false
                        startTypingLoop()
                    }, 500) // Brief pause before retyping
                }
            }, 40) // Deleting is faster
        }

        const startTypingLoop = () => {
            const typeInterval = setInterval(() => {
                if (currentIndex < welcomeMessage.length) {
                    setDisplayedText(welcomeMessage.slice(0, currentIndex + 1))
                    currentIndex++
                } else {
                    setIsTypingComplete(true)
                    clearInterval(typeInterval)
                    setTimeout(() => {
                        setIsTypingComplete(false)
                        isDeleting = true
                        startDeletingLoop()
                    }, 2000)
                }
            }, 80)
        }

        return () => {
            clearInterval(typingInterval)
            if (pauseTimeout) clearTimeout(pauseTimeout)
        }
    }, [welcomeMessage])

    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col"
        >
            <Header
                className="shadow-sm dark:shadow-2xl bg-white dark:bg-gray-900 z-30"
                headerStart={
                    <div className="flex items-center gap-4">
                        {smaller.lg && <MobileNav />}
                        {/* {larger.lg && <SideNavToggle />} */}

                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold leading-none mb-0.5">
                                    <Logo logoWidth={220} />
                                </span>
                            </div>
                        </div>

                        <div className="h-7 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                        <div className="text-xs text-teal-500 dark:text-teal-400 font-medium hidden md:block">
                            {/* Update: 11/12/2025, 12:33 PM */}
                            {time.toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </div>
                    </div>
                }
                headerEnd={
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Welcome message with typing effect */}
                        <div className="hidden md:flex items-center">
                            <span className="text-sm font-semibold relative">
                                {/* Invisible placeholder to maintain fixed width */}
                                <span className="invisible">{welcomeMessage}</span>
                                {/* Actual typed text positioned absolutely */}
                                <span className="absolute left-0 top-0 whitespace-nowrap">
                                    {/* Split displayedText into "Welcome, " part and username part */}
                                    <span className="text-black dark:text-white">
                                        {displayedText.slice(0, Math.min(displayedText.length, 9))}
                                    </span>
                                    <span className="text-secondary dark:text-teal-400">
                                        {displayedText.length > 9 ? displayedText.slice(9) : ''}
                                    </span>
                                    <span className="inline-block w-0.5 h-4 ml-0.5 bg-secondary dark:bg-teal-400 animate-pulse align-middle" />
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 ml-1">
                            <Button
                                size="sm"
                                shape="circle"
                                variant="plain"
                                className="w-9 h-9 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                onClick={() =>
                                    setIsDark(isDark ? 'light' : 'dark')
                                }
                                icon={
                                    isDark ? (
                                        <PiMoonDuotone className="text-xl" />
                                    ) : (
                                        <PiSunDuotone className="text-xl" />
                                    )
                                }
                            />
                        </div>

                        <div className="pl-1 border-l border-slate-100 dark:border-slate-800 ml-1">
                            <UserProfileDropdown hoverable={false} />
                        </div>
                    </div>
                }
            />
            <div className="flex flex-auto min-w-0">
                {larger.lg && <SideNav />}
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSide