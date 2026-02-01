import { useEffect, useState } from "react"
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
  const [index, setIndex] = useState(0)

  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const nextSlide = () =>
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [index, autoPlay, interval])

  return (
    <section className="py-12 sm:py-16 px-10">
      <div className="container mx-auto px-4 sm:px-6">

        {/* IMAGE CONTAINER ONLY */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full flex-shrink-0 h-[220px] sm:h-[320px] md:h-[380px] object-cover"
              />
            ))}
          </div>

          {/* Arrows stay inside image box */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* GAP */}
        <div className="h-6" />

        {/* DOTS CONTAINER (SEPARATE BLOCK) */}
        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === i ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Showcase
