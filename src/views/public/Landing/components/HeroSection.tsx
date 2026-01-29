import { AnimatedBackdrop } from '@/components/shared'

const HeroSection = () => {
    return (
        <section className="w-full py-4 relative">
            <AnimatedBackdrop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Welcome Badge */}
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-400 text-white px-6 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2">
                        <span>👋</span>
                        <span>Welcome to RIMS</span>
                    </div>
                </div>

                {/* Main Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        Sir Padampat Singhania University RIMS
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        Empower your research and manage data across the entire research
                        ecosystem, featuring comprehensive analytics, advanced security, and
                        integration of research data
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
                    <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white text-xl">📚</span>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                            ILT+
                        </div>
                        <p className="text-gray-600 text-sm">Total no. of Research</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white text-xl">👥</span>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                            500+
                        </div>
                        <p className="text-gray-600 text-sm">Total no. of Users</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white text-xl">📖</span>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                            200+
                        </div>
                        <p className="text-gray-600 text-sm">Total no. of Publications</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white text-xl">🎓</span>
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                            200+
                        </div>
                        <p className="text-gray-600 text-sm">Total no. of Scholars</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
