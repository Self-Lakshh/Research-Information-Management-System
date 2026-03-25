import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PartnerCard } from './shared/PartnerCard'
import { useActivePartners } from '@/hooks/usePartners'
import { Skeleton, PartnerCardSkeleton } from './shared/Skeleton'

export const Partners = () => {
    const { data: activePartners = [], isLoading } = useActivePartners()
    const [isHovered, setIsHovered] = useState(false)
    
    // Internal state for the current viewing "index" for the counter
    const [activeIndex, setActiveIndex] = useState(0)

    // Configuration for the marquee
    const CARD_WIDTH = 340 // Base card width
    const GAP = 24 // gap-6 is 24px
    const STEP = CARD_WIDTH + GAP

    // We use a spring for smooth manual skipping
    const x = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.1 })

    // Auto-scroll logic (Marquee flow)
    useEffect(() => {
        if (isLoading || activePartners.length === 0 || isHovered) return

        let lastTime = performance.now()
        let animId: number

        const animate = (time: number) => {
            const deltaTime = time - lastTime
            lastTime = time
            
            // Move slowly (e.g. 50 pixels per second)
            const speed = 0.05 
            const newX = x.get() - (speed * deltaTime)
            
            // Loop logic: if we've moved past one entire set, reset to start of second set
            const totalWidth = activePartners.length * STEP
            if (Math.abs(newX) >= totalWidth) {
                x.set(newX + totalWidth)
            } else {
                x.set(newX)
            }

            // Update active index for the counter (optional global indicator)
            // Note: Individual cards already show their index via props
            const wrappedX = Math.abs(x.get()) % totalWidth
            setActiveIndex(Math.floor(wrappedX / STEP) % activePartners.length)

            animId = requestAnimationFrame(animate)
        }

        animId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animId)
    }, [isLoading, activePartners.length, isHovered, STEP, x])

    // Manual Skip Handlers
    const skipNext = () => {
        const current = x.get()
        const target = Math.floor((current - STEP) / STEP) * STEP
        x.set(target)
    }

    const skipPrev = () => {
        const current = x.get()
        const target = Math.ceil((current + STEP) / STEP) * STEP
        x.set(target)
    }

    // Triple the list for seamless infinite looping
    const tripledPartners = useMemo(() => {
        if (activePartners.length === 0) return []
        return [...activePartners, ...activePartners, ...activePartners]
    }, [activePartners])

    if (!isLoading && activePartners.length === 0) return null

    return (
        <section
            id="partners"
            className="min-h-fit flex flex-col justify-center py-6 sm:py-10 lg:py-16 px-6 sm:px-10 lg:px-12 xl:px-16 relative overflow-hidden"
        >
            <div className="w-full relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12 lg:mb-16">
                    <span className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-[0.2em] animate-fade-in-up">
                        Strategic Collaborations
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary animate-fade-in-up delay-100 font-heading tracking-tight">
                        Our Research Partners
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200 leading-relaxed font-medium">
                        Fostering impactful relationships across industry and academia to drive 
                        technological breakthroughs.
                    </p>
                    <div className="flex justify-center pt-4 animate-fade-in-up delay-300">
                        <div className="h-1.5 w-24 bg-linear-to-r from-primary/60 via-primary to-primary/60 rounded-full shadow-sm" />
                    </div>
                </div>

                {/* Marquee with Manual Controls */}
                <div 
                    className="relative group pt-10 pb-20"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Manual Chevrons */}
                    {!isLoading && activePartners.length > 0 && (
                        <>
                            <button
                                onClick={skipPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-card/80 border border-border/50 shadow-premium backdrop-blur-md text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                                aria-label="Previous partner"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={skipNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-card/80 border border-border/50 shadow-premium backdrop-blur-md text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                                aria-label="Next partner"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Scrolling Content */}
                    <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                        {isLoading ? (
                            <div className="flex gap-6 overflow-hidden">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={`skeleton-${i}`} className="w-[340px] shrink-0">
                                        <PartnerCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                className="flex gap-6"
                                style={{ x: springX, width: 'max-content' }}
                            >
                                {tripledPartners.map((partner, index) => (
                                    <div 
                                        key={`${partner.id}-${index}`} 
                                        className="w-[280px] sm:w-[320px] lg:w-[340px] shrink-0"
                                    >
                                        <PartnerCard 
                                            name={partner.name}
                                            description={partner.description}
                                            logo_url={partner.logo_url}
                                            link={partner.link}
                                            index={index % activePartners.length}
                                            total={activePartners.length}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Progress Indicator Track */}
                    {!isLoading && activePartners.length > 0 && (
                        <div className="flex justify-center items-center gap-1.5 mt-10">
                            {activePartners.map((_, i) => (
                                <div
                                    key={`indicator-${i}`}
                                    className={`h-1 rounded-full transition-all duration-700 ${
                                        i === activeIndex 
                                            ? 'w-10 bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]' 
                                            : 'w-2 bg-muted'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Partners
