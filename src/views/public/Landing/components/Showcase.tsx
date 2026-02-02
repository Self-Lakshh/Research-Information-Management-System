import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

  // ✨ Seamless infinite loop with reflow trick
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const handleTransitionEnd = () => {
      if (currentIndex === 0 || currentIndex === images.length + 1) {
        setIsTransitioning(false)

        const newIndex = currentIndex === 0 ? images.length : 1
        setCurrentIndex(newIndex)

        // Force reflow so browser registers instant jump
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

  // ✨ Autoplay with human-like pacing
  const resetAutoplay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    if (autoPlay) {
      autoPlayRef.current = setInterval(nextSlide, interval)
    }
  }

  useEffect(() => {
    resetAutoplay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [autoPlay, interval])

  const getRealIndex = () => {
    if (currentIndex === 0) return images.length - 1
    if (currentIndex === images.length + 1) return 0
    return currentIndex - 1
  }

  const goToSlide = (realIndex: number) => {
    resetAutoplay()
    setCurrentIndex(realIndex + 1)
  }

  return (
    <section className="py-12 sm:py-16 px-10">
      <div className="container mx-auto px-4 sm:px-6">

        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div
            ref={sliderRef}
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                : ""
            }`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {extendedImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full flex-shrink-0 h-[220px] sm:h-[320px] md:h-[550px] object-cover"
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-secondary text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <ChevronLeft size={25} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <ChevronRight size={25} />
          </button>
        </div>

        <div className="h-6" />

        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                getRealIndex() === i ? "bg-black w-6" : "bg-black/70"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Showcase
