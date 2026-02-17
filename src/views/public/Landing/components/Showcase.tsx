
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { OptimizedImage } from './shared/OptimizedImage'
import { cn } from '@/components/shadcn/utils'

interface ShowcaseItem {
    src: string
    title: string
}

interface ShowcaseProps {
    items: ShowcaseItem[]
    autoPlay?: boolean
    interval?: number
}

const variants = {
    enter: (direction: number) => ({
        zIndex: 0,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        opacity: 1,
        transition: {
            opacity: { duration: 0.5, ease: 'easeInOut' },
        },
    },
    exit: (direction: number) => ({
        zIndex: 0,
        opacity: 0,
        transition: {
            opacity: { duration: 0.5, ease: 'easeInOut' },
        },
    }),
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
}

export const Showcase = ({
    items,
    autoPlay = true,
    interval = 5000,
}: ShowcaseProps) => {
    const [[page, direction], setPage] = useState([0, 0])
    const [isHovered, setIsHovered] = useState(false)

    const itemIndex = Math.abs(page % items.length)

    const paginate = useCallback((newDirection: number) => {
        setPage((prev) => [prev[0] + newDirection, newDirection])
    }, [])

    useEffect(() => {
        if (!autoPlay || isHovered) return
        const timer = setInterval(() => {
            paginate(1)
        }, interval)
        return () => clearInterval(timer)
    }, [autoPlay, interval, isHovered, paginate])

    return (
        <div
            className="w-full relative group max-w-6xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-border/50 bg-card aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1]">
                <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="popLayout"
                >
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }: PanInfo) => {
                            const swipe = swipePower(offset.x, velocity.x)
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1)
                            }
                        }}
                        className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent"
                    >
                        <OptimizedImage
                            src={items[itemIndex].src}
                            alt={items[itemIndex].title}
                            className="w-full h-full object-cover pointer-events-none"
                        />
                        <div className="absolute bottom-0 left-0 right-0 
                p-3 sm:p-4 
                bg-gradient-to-t from-black/60 to-transparent 
                pt-10 sm:pt-16 
                z-10 pointer-events-none">
                            <h3 className="text-xs sm:text-sm md:text-base 
                 text-center font-semibold tracking-wide 
                 text-white drop-shadow-md">
                                {items[itemIndex].title}
                            </h3>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none z-20">
                    <button
                        onClick={() => paginate(-1)}
                        className="pointer-events-auto p-2 rounded-full bg-secondary text-white transition-colors z-20"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="pointer-events-auto p-2 rounded-full bg-secondary text-white transition-colors z-20"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Page Counter Badge */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/20 font-medium z-10 pointer-events-none">
                    {itemIndex + 1} / {items.length}
                </div>
            </div>

            {/* Dots - Below the image, Centered */}
            <div className="flex items-center justify-center mt-4 px-2">
                <div className="flex items-center gap-2">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const diff = i - itemIndex
                                if (diff !== 0) paginate(diff)
                            }}
                            className={cn(
                                'h-2 w-2 rounded-full transition-colors duration-300',
                                i === itemIndex
                                    ? 'bg-primary'
                                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Showcase
