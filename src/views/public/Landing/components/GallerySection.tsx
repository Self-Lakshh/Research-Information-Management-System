import { AnimatedBackdrop } from '@/components/shared'

const GallerySection = () => {
    return (
        <section className="w-full py-16 md:py-24 relative">
            <AnimatedBackdrop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Large Event Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100">
                        {/* Placeholder for actual event image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="text-6xl mb-4">🎓</div>
                                <p className="text-gray-600 text-lg">
                                    Event Gallery - Conference Hall
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Research presentations and academic gatherings
                                </p>
                            </div>
                        </div>
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GallerySection
