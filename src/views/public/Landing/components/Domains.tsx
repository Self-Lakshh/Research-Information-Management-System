import { useState } from "react"
import { DomainCard } from "../components/shared/DomainCard"
import { ChevronDown, ChevronUp } from "lucide-react"
import Showcase from "./Showcase"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

export const Domains = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [headerRef, isHeaderVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })
  const [cardsRef, isCardsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })
  const [showcaseRef, isShowcaseVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  const domains = [
    {
      title: "IPR & Patents",
      image: "/img/categories/1.png",
      desc: "Intellectual Property Rights & Patents, Copyrights, Trademarks",
      points: ["Patents filed/published/granted", "Copyrights", "Trademarks"],
    },
    {
      title: "Journal Publications",
      image: "/img/categories/2.png",
      points: ["Journal articles", "Scopus/WoS indexed", "Faculty & scholar entries"],
    },
    {
      title: "Conference Publications",
      image: "/img/categories/3.png",
      points: ["Conference papers", "Proceedings", "Presentations"],
    },
    {
      title: "Book Publications",
      image: "/img/categories/4.png",
      points: ["Books authored", "Book chapters", "Edited volumes"],
    },
    {
      title: "Research Projects",
      image: "/img/categories/5.png",
      points: ["Funded projects", "Ongoing research", "Completed projects"],
    },
    {
      title: "Awards & Recognition",
      image: "/img/categories/6.png",
      points: ["Awards received", "Honors", "Fellowships"],
    },
    {
      title: "Consultancy",
      image: "/img/categories/7.png",
      points: ["Industry consultancy", "Expert services", "Technical advice"],
    },
    {
      title: "Collaborations",
      image: "/img/categories/8.png",
      points: ["MoUs", "Research partnerships", "International collaborations"],
    },
  ]

  const visibleDomains = isExpanded ? domains : domains.slice(0, 4)

  return (
    <section
      id="domains"
      className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-12 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto flex flex-col h-full relative z-10">

        {/* Domains Section */}
        <div className="flex-[2] flex flex-col justify-center">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ease-out ${isHeaderVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-10'
              }`}
          >
            <span className="text-xs sm:text-sm font-semibold text-primary/70 uppercase tracking-wider">Explore</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mt-1 mb-2">
              Domain / Category
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl lg:max-w-2xl mx-auto px-2">
              Explore our comprehensive research domains and categories
            </p>
            <div className="flex justify-center pt-3">
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>
          </div>

          {/* Cards Grid */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto w-full"
          >
            {visibleDomains.map((d, i) => (
              <div
                key={i}
                className={`transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 hover:shadow-xl ${isCardsVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <DomainCard {...d} />
              </div>
            ))}
          </div>

          {/* View More / View Less Button */}
          {domains.length > 4 && (
            <div
              className={`flex justify-center mt-6 sm:mt-8 transition-all duration-700 delay-500 ${isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-2 px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-sm sm:text-base font-semibold rounded-full transition-all duration-300 border border-primary/20 hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              >
                <span>{isExpanded ? "View Less" : "View More Domains"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Showcase Section */}
        <div
          ref={showcaseRef}
          className={`flex-[3] flex flex-col justify-center mt-6 sm:mt-8 lg:mt-10 transition-all duration-1000 ease-out ${isShowcaseVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
            }`}
        >
          <Showcase
            images={[
              "/img/others/car1.png",
              "/img/others/car2.png",
              "/img/others/car3.png",
            ]}
          />
        </div>

      </div>
    </section>
  )
}

export default Domains