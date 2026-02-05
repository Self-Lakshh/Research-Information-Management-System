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
      className="min-h-fit flex flex-col px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-12 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col h-full relative z-10 w-full space-y-6 sm:space-y-10 lg:space-y-12">

        {/* Domains Section */}
        <div className="flex-[2] flex flex-col justify-center w-full">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ease-out ${isHeaderVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-10'
              }`}
          >
            <span className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-[0.2em]">Explore</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 mb-3 sm:mb-4">
              Domain / Category
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4">
              Explore our comprehensive research domains and categories providing deep insights into institutional progress.
            </p>
            <div className="flex justify-center pt-3 sm:pt-6">
              <div className="h-1 sm:h-1.5 w-16 sm:w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>
          </div>

          {/* Cards Grid */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full"
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
              className={`flex justify-center mt-10 sm:mt-12 transition-all duration-700 delay-500 ${isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-sm sm:text-base font-bold rounded-full transition-all duration-300 border border-primary/20 hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
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
          className={`flex-[3] flex flex-col justify-center transition-all duration-1000 ease-out ${isShowcaseVisible
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