import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { OptimizedImage } from "./shared/OptimizedImage"
import { cn } from "@/components/shadcn/utils"

interface ShowcaseProps {
  images: string[]
  autoPlay?: boolean
  interval?: number
}

export const Showcase = ({
  images,
  autoPlay = true,
  interval = 5000,
}: ShowcaseProps) => {
  const extendedImages = [
    images[images.length - 1],
    ...images,
    images[0],
  ]

  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const prevSlide = () => {
    if (!isTransitioning) return
    resetAutoplay()
    setCurrentIndex((prev) => prev - 1)
  }

  const nextSlide = () => {
    if (!isTransitioning) return
    setCurrentIndex((prev) => prev + 1)
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const handleTransitionEnd = () => {
      if (currentIndex === 0 || currentIndex === images.length + 1) {
        setIsTransitioning(false)

        const newIndex = currentIndex === 0 ? images.length : 1
        setCurrentIndex(newIndex)

        requestAnimationFrame(() => {
          slider.style.transition = "none"
          slider.style.transform = `translateX(-${newIndex * 100}%)`

          requestAnimationFrame(() => {
            slider.style.transition = ""
            setIsTransitioning(true)
          })
        })
      }
    }

    slider.addEventListener("transitionend", handleTransitionEnd)
    return () => slider.removeEventListener("transitionend", handleTransitionEnd)
  }, [currentIndex, images.length])

  const resetAutoplay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    if (autoPlay && !isHovered) {
      autoPlayRef.current = setInterval(nextSlide, interval)
    }
  }

  useEffect(() => {
    resetAutoplay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [autoPlay, interval, isHovered])

  const getRealIndex = () => {
    if (currentIndex === 0) return images.length - 1
    if (currentIndex === images.length + 1) return 0
    return currentIndex - 1
  }

  const goToSlide = (realIndex: number) => {
    resetAutoplay()
    setCurrentIndex(realIndex + 1)
  }

  // Touch/Mouse drag handling
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStart(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const offset = clientX - dragStart
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 80
    if (dragOffset > threshold) {
      prevSlide()
    } else if (dragOffset < -threshold) {
      nextSlide()
    }
    setDragOffset(0)
  }

  return (
    <div className="w-full">
      {/* Main Carousel Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Glow Effect Background */}
        <div
          className={cn(
            "absolute -inset-4 rounded-[2rem] opacity-0 transition-opacity duration-700 blur-2xl",
            "bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30",
            isHovered && "opacity-100"
          )}
        />

        {/* Carousel Frame */}
        <div
          className={cn(
            "relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden group",
            "shadow-2xl shadow-black/20",
            "ring-1 ring-white/10",
            "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:z-10 before:pointer-events-none"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); handleDragEnd(); }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Gradient Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10 pointer-events-none" />

          {/* Vignette Effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] z-10 pointer-events-none" />

          {/* Slider Track */}
          <div
            ref={sliderRef}
            className={cn(
              "flex",
              isTransitioning && !isDragging
                ? "transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                : "",
              isDragging && "cursor-grabbing"
            )}
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            {extendedImages.map((src, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 relative h-[180px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[450px]"
              >
                <OptimizedImage
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700 select-none",
                    isHovered ? 'scale-105' : 'scale-100'
                  )}
                />
              </div>
            ))}
          </div>

          {/* Slide Counter Badge */}
          <div className={cn(
            "absolute top-3 right-3 sm:top-4 sm:right-4 z-20",
            "px-3 py-1.5 rounded-full",
            "bg-black/40 backdrop-blur-md",
            "text-white text-xs sm:text-sm font-medium",
            "border border-white/20",
            "transition-all duration-300",
            "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          )}>
            <span className="text-white font-semibold">{getRealIndex() + 1}</span>
            <span className="text-white/60 mx-1">/</span>
            <span className="text-white/60">{images.length}</span>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={cn(
              "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20",
              "bg-white/10 hover:bg-white/25 backdrop-blur-xl",
              "text-white p-2.5 sm:p-3 lg:p-4 rounded-full",
              "transition-all duration-300",
              "hover:scale-110 active:scale-95",
              "opacity-0 group-hover:opacity-100",
              "-translate-x-4 group-hover:translate-x-0",
              "shadow-lg shadow-black/20",
              "border border-white/20",
              "hover:border-white/40",
              "hover:shadow-xl hover:shadow-primary/20"
            )}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className={cn(
              "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20",
              "bg-white/10 hover:bg-white/25 backdrop-blur-xl",
              "text-white p-2.5 sm:p-3 lg:p-4 rounded-full",
              "transition-all duration-300",
              "hover:scale-110 active:scale-95",
              "opacity-0 group-hover:opacity-100",
              "translate-x-4 group-hover:translate-x-0",
              "shadow-lg shadow-black/20",
              "border border-white/20",
              "hover:border-white/40",
              "hover:shadow-xl hover:shadow-primary/20"
            )}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                "bg-gradient-to-r from-primary via-secondary to-primary",
                "shadow-[0_0_10px_2px] shadow-primary/50"
              )}
              style={{ width: `${((getRealIndex() + 1) / images.length) * 100}%` }}
            />
            {/* Animated shine effect on progress bar */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                width: '50%',
                transform: `translateX(${((getRealIndex() + 1) / images.length) * 200}%)`,
                transition: 'transform 0.5s ease-out'
              }}
            />
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-5 lg:mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={cn(
              "relative transition-all duration-500 rounded-full",
              "hover:scale-125 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
              getRealIndex() === i
                ? "w-8 sm:w-10 lg:w-12 h-2 sm:h-2.5 lg:h-3"
                : "w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3"
            )}
          >
            {/* Background */}
            <span
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-500",
                getRealIndex() === i
                  ? "bg-gradient-to-r from-primary to-secondary shadow-md shadow-primary/30"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
            {/* Glow effect for active dot */}
            {getRealIndex() === i && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-sm opacity-50" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Showcase
