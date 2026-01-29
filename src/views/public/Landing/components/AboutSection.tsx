import { AnimatedBackdrop } from '@/components/shared'

const AboutSection = () => {
    return (
        <section className="w-full py-16 md:py-24 relative">
            <AnimatedBackdrop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        About RIMS
                    </h2>
                    <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Image/Screenshot */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 shadow-xl">
                            {/* Placeholder for dashboard/app screenshots */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-blue-600 h-8 flex items-center px-4 gap-2">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="h-20 bg-blue-100 rounded"></div>
                                        <div className="h-20 bg-cyan-100 rounded"></div>
                                        <div className="h-20 bg-blue-100 rounded"></div>
                                        <div className="h-20 bg-cyan-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Small floating card */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="space-y-6">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            RIMS is a dedicated portal specializing on research
                            management system for the SPSU, utilizing universities,
                            research organization, and other educational institutes. It
                            offers a comprehensive platform for managing, organizing, and
                            reporting research data across various research domains.
                        </p>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Through RIMS, the institution ensures transparency,
                            accountability, and efficient administration of all
                            research-related activities, with a focus on driving
                            innovation, facilitating collaborations, and promoting
                            excellence.
                        </p>

                        <div className="pt-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection
