import { useState, useRef, useEffect } from "react"
import { cn } from "@/components/shadcn/utils"
import { Skeleton } from "./Skeleton"

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
    skeletonClassName?: string
    onLoad?: () => void
    onError?: () => void
}

export const OptimizedImage = ({
    src,
    alt,
    className,
    skeletonClassName,
    onLoad,
    onError
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const [hasError, setHasError] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for lazy loading
    useEffect(() => {
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
                rootMargin: "100px", // Start loading 100px before entering viewport
                threshold: 0.1
            }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const handleImageLoad = () => {
        setIsLoaded(true)
        onLoad?.()
    }

    const handleImageError = () => {
        setHasError(true)
        onError?.()
    }

    return (
        <div ref={imgRef} className="relative w-full h-full overflow-hidden">
            {/* Skeleton placeholder */}
            {!isLoaded && !hasError && (
                <div className={cn("absolute inset-0", skeletonClassName)}>
                    <Skeleton className="w-full h-full" />
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-muted-foreground text-sm">Failed to load image</div>
                </div>
            )}

            {/* Actual image - only load when in view */}
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "transition-all duration-700 ease-out",
                        isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm",
                        className
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
    )
}

export default OptimizedImage
