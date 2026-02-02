import { useEffect, useRef, useState, RefObject } from 'react'

interface UseScrollAnimationOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
}

export const useScrollAnimation = <T extends HTMLElement>(
    options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, boolean] => {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
    const ref = useRef<T>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [threshold, rootMargin, triggerOnce])

    return [ref, isVisible]
}

// Hook for parallax scroll effect
export const useParallax = (speed: number = 0.5) => {
    const [offset, setOffset] = useState(0)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            const scrolled = window.innerHeight - rect.top
            setOffset(scrolled * speed)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    return { ref, offset }
}

// Hook for mouse parallax effect
export const useMouseParallax = (intensity: number = 0.02) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX - window.innerWidth / 2) * intensity
            const y = (e.clientY - window.innerHeight / 2) * intensity
            setPosition({ x, y })
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [intensity])

    return position
}
