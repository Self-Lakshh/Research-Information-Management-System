import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import FeaturesSection from './components/FeaturesSection'
import CategorySection from './components/CategorySection'
import GallerySection from './components/GallerySection'
import PartnerPortalSection from './components/PartnerPortalSection'
import FooterSection from './components/FooterSection'

const LandingPage = () => {
    return (
        <div className="w-full relative">
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <CategorySection />
            <GallerySection />
            <PartnerPortalSection />
            <FooterSection />
        </div>
    )
}

export default LandingPage
