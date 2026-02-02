import { useScrollAnimation } from "../hooks/useScrollAnimation"
import { OptimizedImage } from "./shared/OptimizedImage"

export const About = () => {
  const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const [imageRef, isImageVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })
  const [contentRef, isContentVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section
      id="about"
      className="min-h-screen flex items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div ref={sectionRef} className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* Image with Parallax Effect */}
          <div
            ref={imageRef}
            className={`relative group order-2 md:order-1 transition-all duration-1000 ease-out ${isImageVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-20'
              }`}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700 animate-pulse" />

            {/* Decorative Frame */}
            <div className="absolute -inset-2 border-2 border-primary/20 rounded-2xl sm:rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500" />

            <div className="relative rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full aspect-video transform group-hover:scale-[1.02] transition-all duration-700">
              <OptimizedImage
                src="/img/others/mockup.png"
                className="w-full h-full object-cover"
                alt="RIMS Platform"
                skeletonClassName="rounded-xl sm:rounded-2xl"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-primary text-primary-foreground px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xs sm:text-sm font-semibold">Trusted Platform</span>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className={`space-y-4 sm:space-y-5 lg:space-y-6 order-1 md:order-2 transition-all duration-1000 delay-300 ease-out ${isContentVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-20'
              }`}
          >
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-semibold text-primary/70 uppercase tracking-wider">About Us</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mt-2">
                About RIMS
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              RIMS is a dedicated portal consolidating all research-related
              information from the SPSU academic community. The Research
              Information Management System (RIMS) serves as a centralized
              digital platform to document, manage, and showcase the
              scholarly, research, and innovation activities of the institution.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              It reflects the academic excellence, research productivity, and
              societal contributions of faculty members, researchers, and
              scholars. Through RIMS, the institution ensures transparency,
              accessibility, and systematic organization of all research-related
              data, supporting accreditation, rankings, collaborations, and
              strategic decision-making.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
              {['Centralized', 'Transparent', 'Data-Driven', 'Accessible'].map((tag, i) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full transition-all duration-500 hover:bg-primary hover:text-primary-foreground cursor-default ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                  style={{ transitionDelay: `${800 + i * 100}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About