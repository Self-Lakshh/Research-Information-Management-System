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
      image: "/img/categories/ipr.png",
      description:
        "Comprehensive intellectual property portfolio including patents, copyrights, and trademarks, reflecting institutional innovation output, technology transfer potential, and legal protection of research-driven intellectual assets.",
      tags: ["Patents", "Copyrights", "Trademarks", "Technology Transfer"],
    },
    {
      title: "Journal Publications",
      image: "/img/categories/journal.png",
      description:
        "Peer-reviewed scholarly articles published in high-impact journals indexed in Scopus and Web of Science, demonstrating academic excellence, research visibility, and global citation footprint.",
      tags: ["Scopus Indexed", "WoS Indexed", "Peer-Reviewed", "Faculty & Scholars"],
    },
    {
      title: "Conference Publications",
      image: "/img/categories/conference.png",
      description:
        "Research papers presented and published in reputed national and international conference proceedings, fostering scholarly dissemination, academic networking, and emerging research dialogue.",
      tags: ["Conference Papers", "Proceedings", "Presentations", "Technical Sessions"],
    },
    {
      title: "Book & Chapter Publications",
      image: "/img/categories/book.png",
      description:
        "Authored and edited academic books and book chapters contributing to disciplinary knowledge, scholarly documentation, and long-form research dissemination across diverse subject domains.",
      tags: ["Authored Books", "Book Chapters", "Edited Volumes", "Academic Publishing"],
    },
    {
      title: "Consultancy Project Grants",
      image: "/img/categories/cpg.png",
      description:
        "Industry and government-sponsored consultancy projects delivering domain expertise, applied research solutions, and revenue-generating knowledge transfer aligned with societal and technological challenges.",
      tags: ["Industry Consultancy", "Funded Projects", "Expert Services", "Applied Research"],
    },
    {
      title: "PhD Student Data",
      image: "/img/categories/phd.png",
      description:
        "Doctoral research ecosystem encompassing enrolled scholars, thesis progress, supervisors, and awarded degrees, representing advanced research training, knowledge creation, and institutional research capacity.",
      tags: ["Doctoral Scholars", "Thesis Progress", "Supervisors", "PhD Awards"],
    },
    {
      title: "Awards & Recognition",
      image: "/img/categories/awards.png",
      description:
        "Prestigious awards, honors, fellowships, and recognitions received by faculty and researchers, highlighting academic distinction, research impact, and national and international professional acclaim.",
      tags: ["Awards", "Honors", "Fellowships", "Distinctions"],
    },
    {
      title: "Workshops, Seminars & FDP",
      image: "/img/categories/fdp.png",
      description:
        "Academic events including workshops, seminars, faculty development programs, and keynote lectures that promote knowledge exchange, capacity building, and interdisciplinary scholarly engagement.",
      tags: ["Workshops", "Seminars", "FDP", "Keynote Speakers"],
    },
  ]

  const visibleDomains = isExpanded ? domains : domains.slice(0, 4)

  return (
    <section
      id="domains"
      className="min-h-fit flex flex-col px-6 sm:px-10 lg:px-12 xl:px-16 py-4 sm:py-6 lg:py-10 relative overflow-hidden"
    >

      <div className="max-w-7xl mx-auto flex flex-col h-full relative z-10 w-full space-y-6 sm:space-y-10 lg:space-y-12">

        {/* Domains Section */}
        <div className="flex-[2] flex flex-col justify-center w-full">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-4 sm:mb-6 transition-all duration-1000 ease-out ${isHeaderVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-10'
              }`}
          >
            <span className="text-[10px] sm:text-xs font-bold text-primary/70 uppercase tracking-[0.2em]">Explore</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-2 mb-3 sm:mb-4 font-heading">
              Domain / Category
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-snug">
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
                className={`transition-all duration-500 ${isCardsVisible
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
              className={`flex justify-center mt-8 sm:mt-10 transition-all duration-700 delay-500 ${isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
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