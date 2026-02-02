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
      className="min-h-screen flex flex-col justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center space-y-2 sm:space-y-3 mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 ease-out ${isHeaderVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-10'
            }`}
        >
          <span className="text-xs sm:text-sm font-semibold text-primary/70 uppercase tracking-wider">Collaborations</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
            Our Partner Portal
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl lg:max-w-2xl mx-auto px-2">
            Building bridges across academia, industry, and government for impactful research
          </p>
          <div className="flex justify-center pt-2">
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div
          ref={carouselRef}
          className={`relative w-full overflow-hidden max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isCarouselVisible
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
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / visibleCards}%` }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className={`transform hover:scale-[1.02] transition-all duration-500 ${isCarouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
          className={`flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 lg:mt-10 transition-all duration-700 delay-700 ${isCarouselVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {Array.from({ length: totalPages }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentPage(dotIndex)}
              className={`h-2 sm:h-2.5 lg:h-3 rounded-full transition-all duration-500 hover:scale-125 ${currentPage === dotIndex
                  ? "w-8 sm:w-10 lg:w-12 bg-gradient-to-r from-primary to-secondary shadow-md"
                  : "w-2 sm:w-2.5 lg:w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div
          className={`flex justify-center mt-8 sm:mt-10 transition-all duration-1000 delay-1000 ${isCarouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-primary/5 rounded-full border border-primary/10">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background"
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-primary">500+</span> Researchers
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partners
