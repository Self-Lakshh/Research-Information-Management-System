import { Badge } from "@/components/shadcn/ui/badge"
import { StatCard } from "../components/shared/StatCard"
import { Database, BookOpen, FileText, Users } from "lucide-react"
import { useScrollAnimation, useMouseParallax } from "../hooks/useScrollAnimation"

export const Hero = () => {
  const [heroRef, isHeroVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const mousePosition = useMouseParallax(0.015)

  return (
    <section id="home" className="relative min-h-fit flex items-center pt-20 pb-4 sm:pt-24 sm:pb-6 lg:pt-28 lg:pb-8 px-4 sm:px-6 lg:px-12 xl:px-16 overflow-hidden">

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
            animationDelay: '1s'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl"
          style={{ transform: `translate(calc(-50% + ${mousePosition.x}px), calc(-50% + ${mousePosition.y}px))` }}
        />
      </div>

      <div
        ref={heroRef}
        className="max-w-7xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10"
      >

        {/* Top Badge */}
        <div
          className={`transition-all duration-1000 ease-out ${isHeroVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10'
            }`}
        >
          <Badge className="bg-warning text-sm sm:text-base lg:text-lg rounded-full px-6 sm:px-8 lg:px-12 py-2 sm:py-2.5 hover:bg-warning hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-default">
            Research Management Platform
          </Badge>
        </div>

        {/* Title */}
        <div
          className={`space-y-4 sm:space-y-6 transition-all duration-1000 delay-200 ease-out ${isHeroVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-primary leading-tight tracking-tight">
            Sir Padampat Singhania University{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              RIMS
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
            Software that integrates databases across the entire lifecycle of
            institutions, helping with reporting, analysis, and promotion of
            research activities.
          </p>
        </div>

        {/* Stats Row */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-2 sm:pt-4 transition-all duration-1000 delay-500 ease-out ${isHeroVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          {[
            { icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />, value: "1L+", label: "IPR & Patents", delay: 0 },
            { icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />, value: "50Cr+", label: "Journal Publications", delay: 100 },
            { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />, value: "200+", label: "Conference Publications", delay: 200 },
            { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, value: "200+", label: "Book Publications", delay: 300 },
          ].map((stat, i) => (
            <div
              key={i}
              className={`transform hover:scale-105 transition-all duration-500 hover:shadow-lg ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              style={{ transitionDelay: `${600 + stat.delay}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Hero