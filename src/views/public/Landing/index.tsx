import Hero from './components/Hero'
import About from './components/About'
import Domains from './components/Domains'
import Features from './components/Features'
import Showcase from './components/Showcase'
import { Partners } from './components/Partners'

const LandingPage = () => {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <Hero />
            <About />
            <Features />
            <Domains />
            <Showcase
                images={[
                    "/img/others/car1.png",
                    "/img/others/car2.png",
                    "/img/others/car3.png",
                ]}
            />
            <Partners />
        </div>
    )
}

export default LandingPage
