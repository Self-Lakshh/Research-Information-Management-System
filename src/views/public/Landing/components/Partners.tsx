import { useEffect, useState } from "react"
import { PartnerCard } from "../components/shared/PartnerCard"

const partners = [
  { icon: "/logos/spu-irins.png", name: "SPSU IRINS", description: "Faculty Profile a major provider of research resources for libraries, offering databases, e-journals, e-books" },
  { icon: "/logos/spu-ebsco.png", name: "SPSU EBSCO", description: "A major provider of research resources for libraries, offering databases, e-journals, e-books" },
  { icon: "/logos/delnet.png", name: "DELNET", description: "Access Millions of Networked Library Resources through DELNET" },
  { icon: "/logos/jstor.png", name: "JSTOR", description: "Digital library providing access to academic journals, books, and primary sources" },
  { icon: "/logos/scopus.png", name: "SCOPUS", description: "Abstract and citation database of peer-reviewed literature" },
]

export const Partners = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [visibleCards, setVisibleCards] = useState(3)

  // Detect screen size
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
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 text-center space-y-10 sm:space-y-12">

        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Our Partner Portal
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
            Building bridges across academia, industry, and government for impactful research
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto max-w-6xl overflow-hidden">
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
                <PartnerCard {...partner} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pt-4 sm:pt-6">
          {Array.from({ length: totalPages }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentPage(dotIndex)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                currentPage === dotIndex
                  ? "w-6 bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners
