import { useEffect, useState } from "react"
import { PartnerCard } from "../components/shared/PartnerCard"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const partners = [
  { icon: "/img/others/irins.png", name: "SPSU IRINS", description: "Faculty Profile a major provider of research resources for libraries, offering databases, e-journals, e-books" },
  { icon: "/img/others/ebsco.png", name: "SPSU EBSCO", description: "A major provider of research resources for libraries, offering databases, e-journals, e-books" },
  { icon: "/img/others/delnet.png", name: "DELNET", description: "Access Millions of Networked Library Resources through DELNET" },
  { icon: "/img/others/jstor.png", name: "JSTOR", description: "Digital library providing access to academic journals, books, and primary sources" },
  { icon: "/img/others/scopus.png", name: "SCOPUS", description: "Abstract and citation database of peer-reviewed literature" },
]

export const Partners = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [visibleCards, setVisibleCards] = useState(3)
  const [headerRef, isHeaderVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })
  const [carouselRef, isCarouselVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) setVisibleCards(1)
      else if (window.innerWidth < 1024) setVisibleCards(2)
      else setVisibleCards(3)
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [])

  const totalPages = Math.ceil(partners.length / visibleCards)

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 4000)
    return () => clearInterval(interval)
  }, [totalPages, isPaused])

  return (
    <section
      id="partners"
      className="min-h-fit flex flex-col justify-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 lg:mb-10 transition-all duration-1000 ease-out ${isHeaderVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10'
            }`}
        >
          <span className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-[0.2em]">Collaborations</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
            Our Partner Portal
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4">
            Building bridges across academia, industry, and government for impactful research and sustainable innovation.
          </p>
          <div className="flex justify-center pt-2 sm:pt-4">
            <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div
          ref={carouselRef}
          className={`relative w-full overflow-hidden transition-all duration-1000 delay-300 ${isCarouselVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <div
            className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {partners.map((partner, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-2 sm:px-4"
                style={{ width: `${100 / visibleCards}%` }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className={`transform hover:scale-[1.02] transition-all duration-500 h-full ${isCarouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <PartnerCard {...partner} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div
          className={`flex justify-center gap-3 sm:gap-4 mt-10 sm:mt-12 lg:mt-16 transition-all duration-700 delay-700 ${isCarouselVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {Array.from({ length: totalPages }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentPage(dotIndex)}
              className={`h-2.5 sm:h-3 lg:h-3.5 rounded-full transition-all duration-500 hover:scale-125 ${currentPage === dotIndex
                ? "w-10 sm:w-12 lg:w-16 bg-gradient-to-r from-primary to-secondary shadow-md"
                : "w-2.5 sm:w-3 lg:w-3.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
            />
          ))}
        </div>

        <div
          className={`flex justify-center mt-8 sm:mt-10 transition-all duration-1000 delay-1000 ${isCarouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
        >
          <div className="flex items-center gap-3 sm:gap-4 px-6 py-3 sm:py-4 bg-primary/5 rounded-full border border-primary/10">
            <div className="flex -space-x-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Trusted by <span className="font-bold text-primary">500+</span> Researchers worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partners
