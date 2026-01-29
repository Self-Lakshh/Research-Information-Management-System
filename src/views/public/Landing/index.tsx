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
            <Showcase />
            <Features />
            <Domains />
            <Partners/>
        </div>
    )
}

export default LandingPage
