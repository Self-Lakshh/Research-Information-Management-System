import { useState, useRef, useEffect } from "react"
import { cn } from "@/components/shadcn/utils"
import { Skeleton } from "./Skeleton"

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
    skeletonClassName?: string
    priority?: boolean
    onLoad?: () => void
    onError?: () => void
}

export const OptimizedImage = ({
    src,
    alt,
    className,
    skeletonClassName,
    priority = false,
    onLoad,
    onError
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(priority)
    const [hasError, setHasError] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true)
                        observer.disconnect()
                    }
                })
            },
            {
                rootMargin: "200px", // Increased margin for smoother appearance
                threshold: 0.01
            }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [priority])

    const handleImageLoad = () => {
        setIsLoaded(true)
        onLoad?.()
    }

    const handleImageError = () => {
        setHasError(true)
        onError?.()
    }

    return (
        <div ref={imgRef} className="relative w-full h-full overflow-hidden bg-muted/30">
            {/* Skeleton placeholder */}
            {!isLoaded && !hasError && (
                <div className={cn("absolute inset-0 z-10", skeletonClassName)}>
                    <Skeleton className="w-full h-full" />
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted z-20">
                    <div className="text-muted-foreground text-xs flex flex-col items-center gap-2">
                        <span className="opacity-50">Image unavailable</span>
                    </div>
                </div>
            )}

            {/* Actual image - only load when in view */}
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "transition-all duration-1000 ease-in-out",
                        isLoaded 
                            ? "opacity-100 scale-100 blur-0" 
                            : "opacity-0 scale-110 blur-xl",
                        className
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                />
            )}
        </div>
    )
}

export default OptimizedImage
